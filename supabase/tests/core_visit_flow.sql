-- Run against a disposable database after migrations. Fixtures roll back.
begin;
create function pg_temp.assert_true(value boolean, message text) returns void language plpgsql as $$
begin if value is distinct from true then raise exception 'Assertion failed: %', message; end if; end $$;
create function pg_temp.expect_error(statement text, expected text) returns void language plpgsql as $$
declare failed boolean := false;
begin
  begin execute statement;
  exception when others then
    if position(expected in sqlerrm) = 0 then raise; end if;
    failed := true;
  end;
  if not failed then raise exception 'Expected failure: %', statement; end if;
end $$;

insert into auth.users(id, email) values
 ('10000000-0000-0000-0000-000000000001', 'aoc-test-admin@example.invalid'),
 ('10000000-0000-0000-0000-000000000002', 'aoc-test-caregiver@example.invalid'),
 ('10000000-0000-0000-0000-000000000003', 'aoc-test-other-caregiver@example.invalid'),
 ('10000000-0000-0000-0000-000000000004', 'aoc-test-family@example.invalid'),
 ('10000000-0000-0000-0000-000000000005', 'aoc-test-other-family@example.invalid');
insert into public.profiles(user_id, email, role)
 select id, email, case right(id::text, 1) when '1' then 'superadmin' when '2' then 'caregiver' when '3' then 'caregiver' else 'family' end
 from auth.users where id::text like '10000000-%';

set local role authenticated;
select set_config('request.jwt.claim.sub', '10000000-0000-0000-0000-000000000001', true);
select public.create_assigned_visit(null, '10000000-0000-0000-0000-000000000002', now(), 60,
 'Front entrance', 'Test', 'Client', '10000000-0000-0000-0000-000000000004');
select set_config('test.assignment', (select id::text from public.caregiver_assignments where notes = 'Front entrance'), true);
select pg_temp.expect_error($q$select public.create_assigned_visit(null, '10000000-0000-0000-0000-000000000004', now(), 60)$q$, 'Select an active caregiver');

select set_config('request.jwt.claim.sub', '10000000-0000-0000-0000-000000000003', true);
select pg_temp.assert_true((select count(*) = 0 from public.caregiver_assignments where id = current_setting('test.assignment')::uuid), 'Other caregiver cannot see assignment');
select pg_temp.assert_true((select count(*) = 0 from public.clients where first_name = 'Test'), 'Other caregiver cannot see client');
select pg_temp.expect_error($q$select public.record_visit(current_setting('test.assignment')::uuid, 'arrive')$q$, 'Visit is not assigned to you');
update public.profiles set role = 'superadmin' where user_id = auth.uid();
select pg_temp.assert_true((select role = 'caregiver' from public.profiles where user_id = auth.uid()), 'Self role escalation denied');
select pg_temp.expect_error($q$select public.create_assigned_visit(null, auth.uid(), now(), 60)$q$, 'Active superadmin access required');

select set_config('request.jwt.claim.sub', '10000000-0000-0000-0000-000000000002', true);
select pg_temp.assert_true((select count(*) = 1 from public.clients where first_name = 'Test'), 'Assigned caregiver sees client without RLS recursion');
select pg_temp.expect_error($q$select public.record_visit(current_setting('test.assignment')::uuid, 'complete', '', 'Notes')$q$, 'Record arrival');
select public.record_visit(current_setting('test.assignment')::uuid, 'arrive');
select pg_temp.expect_error($q$select public.record_visit(current_setting('test.assignment')::uuid, 'arrive')$q$, 'already started');
select public.record_visit(current_setting('test.assignment')::uuid, 'save', 'Meal preparation', 'Draft notes');
select pg_temp.assert_true((select summary = 'Draft notes' and activities = 'Meal preparation' and visit_ended_at is null from public.visit_logs where assignment_id = current_setting('test.assignment')::uuid), 'Draft persisted');
select pg_temp.expect_error($q$select public.record_visit(current_setting('test.assignment')::uuid, 'complete', 'Meal preparation', '   ')$q$, 'Visit notes are required');
select pg_temp.expect_error($q$select public.record_visit(current_setting('test.assignment')::uuid, 'complete', '', E'\t\n')$q$, 'Visit notes are required');
select pg_temp.expect_error($q$update public.visit_logs set summary = 'Bypass' where assignment_id = current_setting('test.assignment')::uuid$q$, 'permission denied');
select pg_temp.expect_error($q$insert into public.visit_logs(assignment_id, caregiver_id) values(current_setting('test.assignment')::uuid, auth.uid())$q$, 'permission denied');
select pg_temp.expect_error($q$delete from public.visit_logs where assignment_id = current_setting('test.assignment')::uuid$q$, 'permission denied');

select set_config('request.jwt.claim.sub', '10000000-0000-0000-0000-000000000004', true);
select pg_temp.assert_true((select count(*) = 1 from public.caregiver_assignments where id = current_setting('test.assignment')::uuid), 'Family sees live assignment');
select pg_temp.assert_true((select count(*) = 0 from public.visit_logs where assignment_id = current_setting('test.assignment')::uuid), 'Draft hidden from family');
select pg_temp.expect_error($q$select public.record_visit(current_setting('test.assignment')::uuid, 'complete', '', 'Family tamper')$q$, 'Active caregiver access required');

select set_config('request.jwt.claim.sub', '10000000-0000-0000-0000-000000000002', true);
select public.record_visit(current_setting('test.assignment')::uuid, 'complete', 'Meal preparation', 'Client ate lunch and was comfortable.');
select pg_temp.assert_true((select status = 'completed' from public.caregiver_assignments where id = current_setting('test.assignment')::uuid), 'Completion updates assignment');
select pg_temp.expect_error($q$select public.record_visit(current_setting('test.assignment')::uuid, 'save', '', 'Overwrite')$q$, 'Record arrival');
select pg_temp.expect_error($q$select public.record_visit(current_setting('test.assignment')::uuid, 'complete', '', 'Duplicate')$q$, 'Record arrival');

select set_config('request.jwt.claim.sub', '10000000-0000-0000-0000-000000000004', true);
select pg_temp.assert_true((select summary = 'Client ate lunch and was comfortable.' and visit_ended_at >= visit_started_at from public.visit_logs where assignment_id = current_setting('test.assignment')::uuid), 'Linked family sees completed log');
select set_config('request.jwt.claim.sub', '10000000-0000-0000-0000-000000000005', true);
select pg_temp.assert_true((select count(*) = 0 from public.visit_logs where assignment_id = current_setting('test.assignment')::uuid), 'Unrelated family cannot see log');
select pg_temp.assert_true((select count(*) = 0 from public.caregiver_assignments where id = current_setting('test.assignment')::uuid), 'Unrelated family cannot see assignment');

reset role;
update public.profiles set status = 'inactive' where user_id = '10000000-0000-0000-0000-000000000002';
set local role authenticated;
select set_config('request.jwt.claim.sub', '10000000-0000-0000-0000-000000000002', true);
select pg_temp.assert_true((select count(*) = 0 from public.caregiver_assignments where id = current_setting('test.assignment')::uuid), 'Inactive caregiver cannot see assignment');
select pg_temp.expect_error($q$select public.record_visit(current_setting('test.assignment')::uuid, 'arrive')$q$, 'Active caregiver access required');
set local role anon;
select pg_temp.expect_error($q$select public.record_visit(current_setting('test.assignment')::uuid, 'arrive')$q$, 'permission denied');
rollback;
