-- Run in Supabase → SQL Editor (new projects)
-- https://supabase.com/dashboard → Project → SQL

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  service_id text not null,
  service_name text not null,
  duration_minutes integer not null check (duration_minutes > 0),
  price numeric(10, 2) not null check (price >= 0),
  client_name text not null,
  client_email text not null,
  client_phone text not null,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  created_at timestamptz not null default now(),
  constraint bookings_ends_after_start check (ends_at > starts_at)
);

create index if not exists bookings_starts_at_idx on public.bookings (starts_at);

alter table public.bookings enable row level security;

-- Drop legacy permissive policies (safe if this is a fresh install)
drop policy if exists "Public can read bookings for availability" on public.bookings;
drop policy if exists "Public can insert bookings" on public.bookings;
drop policy if exists "Anon read availability" on public.bookings;
drop policy if exists "Anon insert valid bookings" on public.bookings;

-- Column-level access: anon can read slot times only (not client PII)
revoke all on table public.bookings from anon, authenticated;
grant select (id, starts_at, ends_at) on public.bookings to anon, authenticated;
grant insert on public.bookings to anon, authenticated;

create policy "Anon read availability"
  on public.bookings
  for select
  to anon, authenticated
  using (true);

create policy "Anon insert valid bookings"
  on public.bookings
  for insert
  to anon, authenticated
  with check (
    char_length(trim(client_name)) between 1 and 120
    and char_length(trim(client_email)) between 5 and 254
    and client_email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$'
    and char_length(trim(client_phone)) between 7 and 30
    and duration_minutes between 15 and 180
    and price >= 0
    and price <= 500
    and ends_at > starts_at
    and starts_at >= (now() - interval '12 hours')
    and starts_at <= (now() + interval '29 days')
  );

-- No update/delete policies → denied by default
-- Optional: email on new booking via Database Webhook → Edge Function / Resend
