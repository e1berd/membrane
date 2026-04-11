create or replace function is_chat_member(p_chat_id uuid)
returns boolean as $$
  select exists (
    select 1 from chat_members
    where chat_id = p_chat_id and user_id = (select auth.uid())
  );
$$ language sql security definer
set search_path = pg_catalog, public;

drop policy "Members can view chat members" on chat_members;
drop policy "Members can add users to chat" on chat_members;

create policy "Members can view chat members"
  on chat_members for select
  using (is_chat_member(chat_id));

create policy "Members can add users to chat"
  on chat_members for insert
  with check (is_chat_member(chat_id));
