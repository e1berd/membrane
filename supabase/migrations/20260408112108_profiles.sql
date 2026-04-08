create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username varchar(255) unique not null,
  avatar_url text default null,
  bio varchar(255) default null,
  updated_at timestamp with time zone default null,
  created_at timestamp with time zone default now() not null
);

alter table public.profiles enable row level security;
create policy "Public prifles are viewable by everyone"
  on public.profiles for select
  using (true);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert their own profile"
on public.profiles for insert
with check (auth.uid() = id);

create or replace function public.handle_new_user()
returns trigger as $$
declare
base_username text;
final_username text;
counter int := 0;
begin
base_username := split_part(new.email, '@', 1);
final_username := base_username;

while exists (
    select 1 from public.profiles where username = final_username
) loop
    counter := counter + 1;
    final_username := base_username || counter;
end loop;

insert into public.profiles (id, username)
values (new.id, final_username);

return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
