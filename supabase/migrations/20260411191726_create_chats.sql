create type chat_type as enum ('direct', 'group', 'voice');

create table if not exists chats (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  type chat_type not null
);

create table if not exists chat_members (
  chat_id uuid references chats(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  joined_at timestamptz default now(),
  primary key (chat_id, user_id)
);

create table if not exists chat_messages (
  id uuid primary key default gen_random_uuid(),
  chat_id uuid not null,
  user_id uuid not null,
  message_content jsonb,
  created_at timestamptz default now(),
  reply_to_chat_message_id uuid references chat_messages(id) on delete set null,
  foreign key (chat_id, user_id) references chat_members(chat_id, user_id)
);

create or replace function create_chat(chat_type chat_type, member_ids uuid[])
returns uuid as $$
declare
  new_chat_id uuid;
  member_id uuid;
begin
  insert into chats (type) values (chat_type) returning id into new_chat_id;

  foreach member_id in array member_ids loop
    insert into chat_members (chat_id, user_id) values (new_chat_id, member_id);
  end loop;

  insert into chat_members (chat_id, user_id)
  values (new_chat_id, auth.uid())
  on conflict do nothing;

  return new_chat_id;
end;
$$ language plpgsql security definer
set search_path = pg_catalog, public;


alter table chats enable row level security;
alter table chat_members enable row level security;
alter table chat_messages enable row level security;

create policy "Members can view their chats"
  on chats for select
  using (
    exists (
      select 1 from chat_members
      where chat_members.chat_id = id
        and chat_members.user_id = (select auth.uid())
    )
  );

create policy "Authenticated users can create chats"
  on chats for insert
  with check ((select auth.uid()) is not null);

create policy "Members can view chat members"
  on chat_members for select
  using (
    exists (
      select 1 from chat_members cm
      where cm.chat_id = chat_members.chat_id
        and cm.user_id = (select auth.uid())
    )
  );

create policy "Members can add users to chat"
  on chat_members for insert
  with check (
    exists (
      select 1 from chat_members cm
      where cm.chat_id = chat_id
        and cm.user_id = (select auth.uid())
    )
  );

create policy "Users can leave chats"
  on chat_members for delete
  using ((select auth.uid()) = user_id);

create policy "Members can view chat messages"
  on chat_messages for select
  using (
    exists (
      select 1 from chat_members
      where chat_members.chat_id = chat_messages.chat_id
        and chat_members.user_id = (select auth.uid())
    )
  );

create policy "Members can send messages"
  on chat_messages for insert
  with check (
    (select auth.uid()) = user_id
    and exists (
      select 1 from chat_members
      where chat_members.chat_id = chat_id
        and chat_members.user_id = (select auth.uid())
    )
  );

create policy "Users can delete own messages"
  on chat_messages for delete
  using ((select auth.uid()) = user_id);
