import { computed, watch, type MaybeRefOrGetter, toValue } from 'vue'
import { useInfiniteQuery, useQueryClient, type InfiniteData } from '@tanstack/vue-query'
import type { RealtimeChannel } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { messageContentToHtml } from '@/lib/messageContentToHtml'
import type { ReplyInfo } from '@/types'
import type { Tables } from '@/lib/database.types'

const PAGE_SIZE = 40

export type ChatMessage = Pick<Tables<'chat_messages'>, 'id' | 'is_read'> &
  Pick<Tables<'profiles'>, 'avatar_url' | 'overlay_url' | 'bio'> & {
    userId: string
    sender: string
    avatar: string
    text: string
    time: string
    color: string
    replyTo?: ReplyInfo
  }

type ProfileRow = Pick<Tables<'profiles'>, 'id' | 'username' | 'avatar_url' | 'overlay_url' | 'bio' | 'profile_color'>

type MessageRow = Pick<
  Tables<'chat_messages'>,
  'id' | 'user_id' | 'created_at' | 'reply_to_chat_message_id' | 'is_read'
> & {
  message_content: unknown
}

function profileInitial(p: ProfileRow): string {
  return p.username.charAt(0).toUpperCase()
}

async function fetchChatMessagesPage(chatId: string, offset: number): Promise<ChatMessage[]> {
  const { data: rows, error } = await supabase
    .from('chat_messages')
    .select('id, user_id, message_content, is_read, created_at, reply_to_chat_message_id')
    .eq('chat_id', chatId)
    .order('created_at', { ascending: false })
    .order('id', { ascending: false })
    .range(offset, offset + PAGE_SIZE - 1)

  if (error) throw error
  if (!rows?.length) return []

  const typedRows = rows as MessageRow[]
  const replyIds = [...new Set(typedRows.map((r) => r.reply_to_chat_message_id).filter(Boolean))] as string[]

  let replyById: Record<string, MessageRow> = {}
  if (replyIds.length) {
    const { data: replyRows, error: replyErr } = await supabase
      .from('chat_messages')
      .select('id, user_id, message_content, created_at, reply_to_chat_message_id')
      .in('id', replyIds)
    if (replyErr) throw replyErr
    replyById = Object.fromEntries((replyRows as MessageRow[] | null)?.map((r) => [r.id, r]) ?? [])
  }

  const userIds = new Set<string>()
  for (const r of typedRows) userIds.add(r.user_id)
  for (const r of Object.values(replyById)) userIds.add(r.user_id)

  const { data: profiles, error: profErr } = await supabase
    .from('profiles')
    .select('id, username, avatar_url, overlay_url, profile_color, bio')
    .in('id', [...userIds])

  if (profErr) throw profErr
  const profileMap = Object.fromEntries((profiles as ProfileRow[] | null)?.map((p) => [p.id, p]) ?? [])

  function rowToChatMessage(row: MessageRow, replyTo?: ReplyInfo): ChatMessage {
    const p = profileMap[row.user_id]
    const username = p?.username ?? '…'
    return {
      id: row.id,
      userId: row.user_id,
      sender: username,
      avatar: p ? profileInitial(p) : '?',
      avatar_url: p?.avatar_url ?? null,
      overlay_url: p?.overlay_url ?? null,
      bio: p?.bio ?? null,
      text: messageContentToHtml(row.message_content),
      time: row.created_at ?? new Date().toISOString(),
      color: p?.profile_color ?? 'primary',
      is_read: row.is_read,
      replyTo,
    }
  }

  return typedRows.map((row) => {
    let replyTo: ReplyInfo | undefined
    const rid = row.reply_to_chat_message_id
    if (rid) {
      const replyRow = replyById[rid]
      if (replyRow) {
        const rp = profileMap[replyRow.user_id]
        replyTo = {
          id: replyRow.id,
          sender: rp?.username ?? '…',
          text: messageContentToHtml(replyRow.message_content),
        }
      }
    }
    return rowToChatMessage(row, replyTo)
  })
}

async function fetchMessageById(messageId: string): Promise<ChatMessage | null> {
  const { data: rows, error } = await supabase
    .from('chat_messages')
    .select('id, user_id, message_content, is_read, created_at, reply_to_chat_message_id')
    .eq('id', messageId)
    .limit(1)

  if (error || !rows?.length) return null

  const row = rows[0] as MessageRow

  let replyTo: ReplyInfo | undefined
  if (row.reply_to_chat_message_id) {
    const { data: replyRows } = await supabase
      .from('chat_messages')
      .select('id, user_id, message_content, created_at, reply_to_chat_message_id')
      .eq('id', row.reply_to_chat_message_id)
      .limit(1)

    const replyRow = (replyRows as MessageRow[] | null)?.[0]
    if (replyRow) {
      const { data: replyProfiles } = await supabase
        .from('profiles')
        .select('id, username, avatar_url, overlay_url, profile_color, bio')
        .eq('id', replyRow.user_id)
        .limit(1)
      const rp = (replyProfiles as ProfileRow[] | null)?.[0]
      replyTo = {
        id: replyRow.id,
        sender: rp?.username ?? '…',
        text: messageContentToHtml(replyRow.message_content),
      }
    }
  }

  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, username, avatar_url, overlay_url, profile_color, bio')
    .eq('id', row.user_id)
    .limit(1)

  const p = (profiles as ProfileRow[] | null)?.[0]
  const username = p?.username ?? '…'

  return {
    id: row.id,
    userId: row.user_id,
    sender: username,
    avatar: p ? profileInitial(p) : '?',
    avatar_url: p?.avatar_url ?? null,
    overlay_url: p?.overlay_url ?? null,
    bio: p?.bio ?? null,
    text: messageContentToHtml(row.message_content),
    time: row.created_at ?? new Date().toISOString(),
    color: p?.profile_color ?? 'primary',
    is_read: row.is_read,
    replyTo,
  }
}

/**
 * Loads chat messages from Supabase, newest page first; `messages` is chronological (oldest → newest).
 */
export function useDirectMessageInfiniteQuery(chatId: MaybeRefOrGetter<string | null | undefined>) {
  const chatIdComputed = computed(() => {
    const id = toValue(chatId)
    if (id == null || id === '' || id === 'new') return null
    return id
  })

  const queryClient = useQueryClient()

  const query = useInfiniteQuery({
    queryKey: ['chatMessages', chatIdComputed],
    queryFn: async ({ pageParam }) => {
      const cid = chatIdComputed.value
      if (!cid) return []
      return fetchChatMessagesPage(cid, pageParam as number)
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === PAGE_SIZE ? allPages.reduce((sum, p) => sum + p.length, 0) : undefined,
    enabled: () => chatIdComputed.value != null,
  })

  let channel: RealtimeChannel | null = null

  function teardown() {
    if (channel) {
      supabase.removeChannel(channel)
      channel = null
    }
  }

  watch(
    chatIdComputed,
    (cid) => {
      teardown()
      if (!cid) return

      channel = supabase
        .channel(`dm-messages:${cid}:${Math.random().toString(36).slice(2, 9)}`)
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'chat_messages', filter: `chat_id=eq.${cid}` },
          async (payload) => {
            const newMsg = await fetchMessageById((payload.new as { id: string }).id)
            if (!newMsg) return

            queryClient.setQueryData<InfiniteData<ChatMessage[]>>(['chatMessages', cid], (old) => {
              if (!old) return old
              const [firstPage, ...rest] = old.pages
              return {
                ...old,
                pages: [[newMsg, ...(firstPage ?? [])], ...rest],
              }
            })
          },
        )
        .on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'chat_messages', filter: `chat_id=eq.${cid}` },
          (payload) => {
            const updated = payload.new as { id: string; is_read: boolean }

            queryClient.setQueryData<InfiniteData<ChatMessage[]>>(['chatMessages', cid], (old) => {
              if (!old) return old
              return {
                ...old,
                pages: old.pages.map((page) =>
                  page.map((msg) => (msg.id === updated.id ? { ...msg, is_read: updated.is_read } : msg)),
                ),
              }
            })
          },
        )
        .subscribe()
    },
    { immediate: true },
  )

  const messages = computed(() => {
    const pages = query.data.value?.pages ?? []
    return pages.flat().slice().reverse()
  })

  return {
    ...query,
    messages,
    pageSize: PAGE_SIZE,
  }
}
