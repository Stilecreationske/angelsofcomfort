# Core portal visit flow

Apply `supabase/migrations/20261001170000_core_visit_flow.sql` to the target Supabase project before deploying this frontend. No new secrets or Edge Functions are required. The existing browser client uses the signed-in session and its existing environment configuration.

Before migration, check for multiple historical logs per assignment:

```sql
select assignment_id, count(*) from public.visit_logs
 group by assignment_id having count(*) > 1;
```

Resolve duplicates with the data owner before migrating; the migration intentionally fails rather than deleting records. The completion constraint applies to new writes without rejecting historical incomplete logs.

Use existing active superadmin, caregiver, and family profiles. From the superadmin portal, select a client already linked to an active family, or create a client with an existing family contact. Choose the caregiver, local start time, duration, and location/instructions. The client and assignment are created atomically. Account invitations and broader scheduling administration are outside this change.

The assigned caregiver records arrival, enters activities and visit notes, optionally saves a draft, then clocks out. Clock-out requires nonblank notes in both UI and database. Arrival and clock-out use server timestamps. Completed logs cannot be edited through the caregiver flow. The family sees scheduled/active assignments and only submitted, completed logs. Portals refresh on focus, every 30 seconds, or via Refresh visits.

Security: RLS restricts assignments and clients to their linked users. Log writes go through an authenticated, role-checked, assignment-checked RPC that locks the assignment row. Direct authenticated log writes are revoked. A unique index prevents duplicate logs. Self profile updates are removed to prevent role/status escalation; active superadmins still administer profiles. Inactive profiles cannot enter protected portals or use visit RPCs.

## Verification

- `npm ci`, `npm run build`
- `npx eslint src/components/visits src/hooks/useVisits.ts src/pages/CaregiverDashboard.tsx src/pages/FamilyDashboard.tsx src/pages/SuperadminDashboard.tsx src/components/ProtectedRoute.tsx`
- On a disposable migrated Supabase database: `psql "$TEST_DATABASE_URL" -v ON_ERROR_STOP=1 -f supabase/tests/core_visit_flow.sql`. The test inserts synthetic users and rolls them back. It checks assignment creation, draft persistence, required notes, completion, cross-user isolation, profile escalation, direct write denial, inactive users, and anonymous access.
- With three separate browser sessions, assign a visit as superadmin, arrive/save/clock-out as caregiver, then refresh the family portal. Confirm draft notes are hidden, submitted notes and activities appear, and another caregiver/family cannot access them.

No production migration or deployment is performed by this repository change.

Validation for this change: production build and changed-file ESLint passed. The SQL integration suite passed in an isolated PGlite PostgreSQL instance with Supabase-style auth roles and `auth.uid()`. Full TypeScript checking reports the same five errors on the base revision (Footer modal typing and missing ImportMeta environment declarations); no new TypeScript errors were introduced. Live browser sessions and the hosted Supabase migration remain rollout checks.
