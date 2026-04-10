alter table public.profiles
  add column if not exists profile_color varchar(7) default null,
  add column if not exists overlay_url text default null;
