alter function public.health_check()
set search_path = pg_catalog, public;

alter function public.handle_new_user()
set search_path = pg_catalog, public;

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
  on public.profiles
  for update
  using ((select auth.uid()) = id);

drop policy if exists "Users can insert their own profile" on public.profiles;
create policy "Users can insert their own profile"
  on public.profiles
  for insert
  with check ((select auth.uid()) = id);
