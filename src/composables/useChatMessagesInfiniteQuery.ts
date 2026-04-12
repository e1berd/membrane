import { computed, type MaybeRefOrGetter, toValue } from 'vue'
import { useInfiniteQuery } from '@tanstack/vue-query'
import { supabase } from '@/lib/supabase'
import { messageContentToHtml } from '@/lib/messageContentToHtml'
import type { ReplyInfo } from '@/components/MessageItem.vue'

const PAGE_SIZE = 40

export interface ChatMessage {
  id: string
  userId: string
  sender: string
  avatar: string
  avatar_url?: string | null
  overlay_url?: string | null
  bio?: string | null
  text: string
  time: string
  color: string
  replyTo?: ReplyInfo
}

type ProfileRow = {
  id: string
  username: string
  avatar_url: string | null
  overlay_url: string | null
  bio: string | null
  profile_color: string | null
}

type MessageRow = {
  id: string
  user_id: string
  message_content: unknown
  created_at: string | null
  reply_to_chat_message_id: string | null
}

function profileInitial(p: ProfileRow): string {
  return p.username.charAt(0).toUpperCase()
}

async function fetchChatMessagesPage(chatId: string, offset: number): Promise<ChatMessage[]> {
  const { data: rows, error } = await supabase
    .from('chat_messages')
    .select('id, user_id, message_content, created_at, reply_to_chat_message_id')
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

/**
 * Loads chat messages from Supabase, newest page first; `messages` is chronological (oldest → newest).
 */
export function useChatMessagesInfiniteQuery(chatId: MaybeRefOrGetter<string | null | undefined>) {
  const chatIdComputed = computed(() => {
    const id = toValue(chatId)
    if (id == null || id === '' || id === 'new') return null
    return id
  })

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
