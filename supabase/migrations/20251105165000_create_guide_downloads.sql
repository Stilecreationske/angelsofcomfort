-- Leads captured when visitors request the downloadable guide
create table if not exists guide_downloads (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  email text not null,
  created_at timestamptz not null default now()
);

comment on table guide_downloads is 'Leads captured before granting access to the downloadable guide.';

create index if not exists idx_guide_downloads_email on guide_downloads (email);
