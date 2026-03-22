-- Comfort visit inquiries submitted via the Get Started modal
create table if not exists comfort_visit_requests (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  dob date,
  city text not null,
  email text not null,
  phone text not null,
  created_at timestamptz not null default now()
);

comment on table comfort_visit_requests is 'Inbound requests for complimentary comfort visits.';

-- Newsletter subscribers captured via the Join Our Circle section
create table if not exists newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text,
  email text not null,
  created_at timestamptz not null default now(),
  unique (email)
);

comment on table newsletter_subscribers is 'Email subscribers for monthly comfort stories.';

-- Caregiver applications submitted through Become a Caregiver modal
create table if not exists caregiver_applications (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  dob date,
  city text not null,
  email text not null,
  phone text not null,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

comment on table caregiver_applications is 'Prospective caregiver applications pending review.';

-- Indexes for faster lookup
create index if not exists idx_comfort_visit_requests_email on comfort_visit_requests (email);
create index if not exists idx_newsletter_subscribers_email on newsletter_subscribers (email);
create index if not exists idx_caregiver_applications_email on caregiver_applications (email);
