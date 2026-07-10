-- Lumin: initial schema — profiles, waitlist, RLS, triggers
-- (Applied to project hazjyonpqungkgchqgro via Supabase MCP on 2026-07-11)
create extension if not exists pgcrypto;

-- ============ ENUMS ============
create type public.waitlist_status as enum ('pending', 'active_waitlist', 'cancelled');

-- ============ PROFILES ============
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  avatar_url text,
  -- profile metrics
  skin_profile jsonb not null default '{}'::jsonb,
  glow_score integer not null default 0 check (glow_score between 0 and 100),
  streak_days integer not null default 0 check (streak_days >= 0),
  scans_completed integer not null default 0 check (scans_completed >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============ WAITLIST ============
create table public.waitlist (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  email text not null,
  status public.waitlist_status not null default 'pending',
  position bigint generated always as identity,
  configuration jsonb not null default '{}'::jsonb,
  stripe_session_id text unique,
  stripe_payment_intent_id text,
  amount_paid_cents integer,
  confirmed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index waitlist_email_unique_idx on public.waitlist (lower(email));
create index waitlist_status_idx on public.waitlist (status);
create index waitlist_user_id_idx on public.waitlist (user_id);

-- ============ updated_at trigger ============
create or replace function public.set_updated_at()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();
create trigger waitlist_set_updated_at before update on public.waitlist
  for each row execute function public.set_updated_at();

-- ============ auto-create profile on signup ============
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    coalesce(new.raw_user_meta_data ->> 'avatar_url', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============ ROW LEVEL SECURITY ============
alter table public.profiles enable row level security;
alter table public.waitlist enable row level security;

-- Profiles: owner-only read/write. No public access.
create policy "profiles_select_own" on public.profiles
  for select to authenticated using ((select auth.uid()) = id);
create policy "profiles_insert_own" on public.profiles
  for insert to authenticated with check ((select auth.uid()) = id);
create policy "profiles_update_own" on public.profiles
  for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);
-- No delete policy: clients cannot delete profiles.

-- Waitlist: owner-only read. Inserts/updates happen ONLY via server (service role bypasses RLS).
create policy "waitlist_select_own" on public.waitlist
  for select to authenticated
  using (
    user_id = (select auth.uid())
    or lower(email) = lower(coalesce((select auth.jwt() ->> 'email'), ''))
  );
-- No insert/update/delete policies for anon/authenticated:
-- all mutations flow through server-side route handlers using the service role.
