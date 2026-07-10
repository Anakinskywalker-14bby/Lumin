-- Lock down trigger functions: not callable via the public RPC surface
-- (Resolves Supabase security advisor lints 0028 / 0029)
revoke execute on function public.handle_new_user() from anon, authenticated, public;
revoke execute on function public.set_updated_at() from anon, authenticated, public;
