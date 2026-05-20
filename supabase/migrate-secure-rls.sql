-- Run this if you already applied an older schema.sql with permissive RLS.
-- Supabase → SQL Editor → paste and run once.

drop policy if exists "Public can read bookings for availability" on public.bookings;
drop policy if exists "Public can insert bookings" on public.bookings;
drop policy if exists "Anon read availability" on public.bookings;
drop policy if exists "Anon insert valid bookings" on public.bookings;

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
