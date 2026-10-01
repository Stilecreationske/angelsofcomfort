begin;

-- Self-service profile updates previously allowed role/status escalation.
-- Profile administration remains available to active superadmins.
drop policy if exists "Profiles can update their own record" on public.profiles;

alter table public.visit_logs add column activities text not null default '';
create unique index visit_logs_one_per_assignment on public.visit_logs(assignment_id);
alter table public.visit_logs add constraint visit_log_completion_valid check (
  visit_ended_at is null or (
    visit_started_at is not null and visit_ended_at >= visit_started_at
    and summary is not null and summary ~ '[^[:space:]]'
  )
) not valid;

-- Only the transition function can write logs; RLS controls reads.
drop policy if exists "Caregivers manage their visit logs" on public.visit_logs;
drop policy if exists "Superadmin manage visit logs" on public.visit_logs;
drop policy if exists "Families view visit logs for their loved ones" on public.visit_logs;
revoke insert, update, delete on public.visit_logs from anon, authenticated;
grant select on public.visit_logs to authenticated;

create policy "Superadmin read visit logs" on public.visit_logs for select to authenticated
using (public.user_has_role('superadmin'));
create policy "Assigned caregivers read visit logs" on public.visit_logs for select to authenticated
using (public.user_has_role('caregiver') and caregiver_id = auth.uid() and exists (
  select 1 from public.caregiver_assignments a
  where a.id = visit_logs.assignment_id and a.caregiver_id = auth.uid()
));
create policy "Families read completed connected logs" on public.visit_logs for select to authenticated
using (public.user_has_role('family') and visit_ended_at is not null and exists (
  select 1 from public.caregiver_assignments a join public.clients c on c.id = a.client_id
  where a.id = visit_logs.assignment_id and c.family_contact = auth.uid()
));

-- A definer helper avoids recursive clients <-> assignments RLS evaluation.
create or replace function public.caregiver_has_client(p_client_id uuid)
returns boolean language sql stable security definer set search_path = public
as $$
  select public.user_has_role('caregiver') and exists (
    select 1 from public.caregiver_assignments a
    where a.client_id = p_client_id and a.caregiver_id = auth.uid()
  );
$$;
revoke all on function public.caregiver_has_client(uuid) from public, anon;
grant execute on function public.caregiver_has_client(uuid) to authenticated;
create policy "Assigned caregivers read clients" on public.clients for select to authenticated
using (public.caregiver_has_client(id));

-- Row locking serializes arrival/save/clock-out and prevents duplicate logs.
-- Caller identity and timestamps always come from the database.
create or replace function public.record_visit(
  p_assignment_id uuid, p_action text, p_activities text default '', p_notes text default ''
) returns void
language plpgsql security definer set search_path = public
as $$
declare
  assignment public.caregiver_assignments;
  visit public.visit_logs;
begin
  if not public.user_has_role('caregiver') then
    raise exception 'Active caregiver access required' using errcode = '42501';
  end if;
  select * into assignment from public.caregiver_assignments
    where id = p_assignment_id for update;
  if not found or assignment.caregiver_id is distinct from auth.uid() then
    raise exception 'Visit is not assigned to you' using errcode = '42501';
  end if;
  select * into visit from public.visit_logs where assignment_id = p_assignment_id;
  if p_action = 'arrive' then
    if assignment.status <> 'scheduled' or visit.id is not null then
      raise exception 'This visit has already started or is unavailable';
    end if;
    insert into public.visit_logs(assignment_id, caregiver_id, visit_started_at)
      values (assignment.id, auth.uid(), now());
    update public.caregiver_assignments set status = 'in_progress' where id = assignment.id;
  elsif p_action in ('save', 'complete') then
    if assignment.status <> 'in_progress' or visit.id is null
       or visit.visit_started_at is null or visit.visit_ended_at is not null
       or visit.caregiver_id is distinct from auth.uid() then
      raise exception 'Record arrival before logging an active visit';
    end if;
    if p_action = 'complete' and coalesce(p_notes, '') !~ '[^[:space:]]' then
      raise exception 'Visit notes are required before clock-out';
    end if;
    update public.visit_logs set activities = coalesce(p_activities, ''), summary = coalesce(p_notes, ''),
      visit_ended_at = case when p_action = 'complete' then now() else null end
      where id = visit.id;
    if p_action = 'complete' then
      update public.caregiver_assignments set status = 'completed' where id = assignment.id;
    end if;
  else
    raise exception 'Unknown visit action';
  end if;
end;
$$;
revoke all on function public.record_visit(uuid, text, text, text) from public, anon;
grant execute on function public.record_visit(uuid, text, text, text) to authenticated;

-- Atomic create/assign, optionally creating a client linked to an existing family.
create or replace function public.create_assigned_visit(
  p_client_id uuid, p_caregiver_id uuid, p_scheduled_for timestamptz,
  p_duration integer, p_instructions text default '',
  p_first_name text default '', p_last_name text default '', p_family_id uuid default null
) returns uuid
language plpgsql security definer set search_path = public
as $$
declare client_id uuid := p_client_id; assignment_id uuid;
begin
  if not public.user_has_role('superadmin') then
    raise exception 'Active superadmin access required' using errcode = '42501';
  end if;
  if not exists (select 1 from public.profiles where user_id = p_caregiver_id
    and role = 'caregiver' and status = 'active') then
    raise exception 'Select an active caregiver';
  end if;
  if p_scheduled_for is null or p_duration is null or p_duration <= 0 then
    raise exception 'Start time and positive duration are required';
  end if;
  if client_id is null then
    if length(btrim(coalesce(p_first_name, ''))) = 0
       or length(btrim(coalesce(p_last_name, ''))) = 0
       or not exists (select 1 from public.profiles where user_id = p_family_id
         and role = 'family' and status = 'active') then
      raise exception 'Client name and an active family contact are required';
    end if;
    insert into public.clients(first_name, last_name, family_contact)
      values (btrim(p_first_name), btrim(p_last_name), p_family_id) returning id into client_id;
  elsif not exists (select 1 from public.clients c join public.profiles p on p.user_id = c.family_contact
    where c.id = client_id and c.status = 'active' and p.role = 'family' and p.status = 'active') then
    raise exception 'Select an active client linked to an active family';
  end if;
  insert into public.caregiver_assignments(client_id, caregiver_id, scheduled_for, visit_duration_minutes, notes)
    values (client_id, p_caregiver_id, p_scheduled_for, p_duration, p_instructions)
    returning id into assignment_id;
  return assignment_id;
end;
$$;
revoke all on function public.create_assigned_visit(uuid, uuid, timestamptz, integer, text, text, text, uuid) from public, anon;
grant execute on function public.create_assigned_visit(uuid, uuid, timestamptz, integer, text, text, text, uuid) to authenticated;
commit;
