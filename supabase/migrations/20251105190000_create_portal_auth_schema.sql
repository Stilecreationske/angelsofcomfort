-- Helper to keep updated_at fresh on tables that include the column
create or replace function public.set_current_timestamp_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Helper to check the caller's role safely within RLS policies
-- Primary profile record for every authenticated user
create table if not exists profiles (
  user_id uuid primary key references auth.users on delete cascade,
  email text not null unique,
  role text not null check (role in ('superadmin', 'caregiver', 'family')),
  first_name text,
  last_name text,
  status text not null default 'active',
  invited_by uuid references auth.users on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger profiles_set_updated_at
  before update on profiles
  for each row
execute procedure public.set_current_timestamp_updated_at();

alter table profiles enable row level security;

create or replace function public.user_has_role(target_role text)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from profiles
    where user_id = auth.uid()
      and role = target_role
      and status = 'active'
  );
$$;

create policy "Profiles can read their own record"
  on profiles
  for select
  using (auth.uid() = user_id);

create policy "Profiles can update their own record"
  on profiles
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Superadmin manage profiles"
  on profiles
  for all
  using (user_has_role('superadmin'))
  with check (user_has_role('superadmin'));

-- Invitations sent by the superadmin to onboard caregivers or family members
create table if not exists portal_invitations (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  role text not null check (role in ('caregiver', 'family')),
  token text not null unique,
  expires_at timestamptz not null,
  accepted_at timestamptz,
  created_by uuid references auth.users on delete set null,
  created_at timestamptz not null default now()
);

alter table portal_invitations enable row level security;

create policy "Superadmin manage invitations"
  on portal_invitations
  for all
  using (user_has_role('superadmin'))
  with check (user_has_role('superadmin'));

-- Clients under Angels of Comfort care
create table if not exists clients (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  family_contact uuid references profiles(user_id) on delete set null,
  status text not null default 'active',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger clients_set_updated_at
  before update on clients
  for each row
  execute procedure public.set_current_timestamp_updated_at();

alter table clients enable row level security;

create policy "Superadmin manage clients"
  on clients
  for all
  using (user_has_role('superadmin'))
  with check (user_has_role('superadmin'));

create policy "Families view connected clients"
  on clients
  for select
  using (
    exists (
      select 1
      from profiles p
      where p.user_id = auth.uid()
        and p.role = 'family'
        and p.status = 'active'
        and clients.family_contact = p.user_id
    )
  );

-- Caregiver assignments that pair a caregiver with a client visit
create table if not exists caregiver_assignments (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients(id) on delete cascade,
  caregiver_id uuid references profiles(user_id) on delete set null,
  scheduled_for timestamptz,
  visit_duration_minutes integer,
  status text not null default 'scheduled',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger caregiver_assignments_set_updated_at
  before update on caregiver_assignments
  for each row
  execute procedure public.set_current_timestamp_updated_at();

alter table caregiver_assignments enable row level security;

create policy "Superadmin manage assignments"
  on caregiver_assignments
  for all
  using (user_has_role('superadmin'))
  with check (user_has_role('superadmin'));

create policy "Caregivers view their assignments"
  on caregiver_assignments
  for select
  using (
    exists (
      select 1
      from profiles p
      where p.user_id = auth.uid()
        and p.role = 'caregiver'
        and p.status = 'active'
        and caregiver_assignments.caregiver_id = p.user_id
    )
  );

create policy "Families view assignments for their loved ones"
  on caregiver_assignments
  for select
  using (
    exists (
      select 1
      from profiles p
      where p.user_id = auth.uid()
        and p.role = 'family'
        and p.status = 'active'
    )
    and exists (
      select 1
      from clients c
      where c.id = caregiver_assignments.client_id
        and c.family_contact = auth.uid()
    )
  );

-- Logs that capture what happened during a caregiver visit
create table if not exists visit_logs (
  id uuid primary key default gen_random_uuid(),
  assignment_id uuid not null references caregiver_assignments(id) on delete cascade,
  caregiver_id uuid references profiles(user_id) on delete set null,
  visit_started_at timestamptz,
  visit_ended_at timestamptz,
  summary text,
  recommendations text,
  created_at timestamptz not null default now()
);

alter table visit_logs enable row level security;

create policy "Superadmin manage visit logs"
  on visit_logs
  for all
  using (user_has_role('superadmin'))
  with check (user_has_role('superadmin'));

create policy "Caregivers manage their visit logs"
  on visit_logs
  for all
  using (
    exists (
      select 1
      from profiles p
      where p.user_id = auth.uid()
        and p.role = 'caregiver'
        and p.status = 'active'
        and visit_logs.caregiver_id = p.user_id
    )
  )
  with check (
    exists (
      select 1
      from profiles p
      where p.user_id = auth.uid()
        and p.role = 'caregiver'
        and p.status = 'active'
        and visit_logs.caregiver_id = p.user_id
    )
  );

create policy "Families view visit logs for their loved ones"
  on visit_logs
  for select
  using (
    exists (
      select 1
      from clients c
      join caregiver_assignments ca on ca.id = visit_logs.assignment_id
      where c.id = ca.client_id
        and c.family_contact = auth.uid()
    )
  );
