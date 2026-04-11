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
