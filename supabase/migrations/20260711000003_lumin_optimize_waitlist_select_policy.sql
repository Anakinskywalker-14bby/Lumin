-- Perf: evaluate auth functions once per query (initplan), not per row
-- (Resolves Supabase performance advisor lint 0003)
drop policy "waitlist_select_own" on public.waitlist;
create policy "waitlist_select_own" on public.waitlist
  for select to authenticated
  using (
    user_id = (select auth.uid())
    or lower(email) = (select lower(coalesce(auth.jwt() ->> 'email', '')))
  );
