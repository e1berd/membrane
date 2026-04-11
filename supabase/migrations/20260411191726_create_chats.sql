create table if not exists chats (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp default now()
);

create table if not exists chat_members (
  chat_id uuid references chats(id),
  user_id uuid references public.profiles(id),
  primary key (chat_id, user_id)
);

create table if not exists chat_messages (
  user_id uuid references chat_members(user_id),
  chat_id uuid references chat_members(chat_id),
  message_content jsonb,
  created_at timestamp default now(),
  primary key (chat_id, user_id)
);
