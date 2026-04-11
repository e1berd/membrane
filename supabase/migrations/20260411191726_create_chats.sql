create table if not exists chat_types (
  id uuid primary key default gen_random_uuid(),
  name varchar(255) not null,
  description text
);

insert into chat_types (name, description) values
('direct', 'direct chat between two users'),
('group', 'group chat between multiple users'),
('voice', 'voice chat');

create table if not exists chats (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp default now(),
  type uuid references chat_types(id) not null
);

create table if not exists chat_members (
  chat_id uuid references chats(id),
  user_id uuid references public.profiles(id),
  primary key (chat_id, user_id)
);

create table if not exists chat_messages (
  id uuid primary key default gen_random_uuid(),
  chat_id uuid references chat_members(chat_id),
  user_id uuid references chat_members(user_id),
  message_content jsonb,
  created_at timestamp default now(),
  reply_to_chat_message_id uuid references chat_messages(id)
);
