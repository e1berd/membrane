<script setup lang="ts">
import { ref, computed, nextTick, onMounted, onUnmounted, watch, useTemplateRef, defineAsyncComponent, toRef } from 'vue'
import { OverlayScrollbarsComponent } from 'overlayscrollbars-vue'
import type { OverlayScrollbarsComponentRef } from 'overlayscrollbars-vue'
import 'overlayscrollbars/overlayscrollbars.css'
import type { ReplyInfo } from '@/components/MessageItem.vue'
import { supabase } from '@/lib/supabase'
import type { Json } from '@/lib/database.types'
import { useCurrentProfile } from '@/composables/useCurrentProfile'
import { useChatMessagesInfiniteQuery, type ChatMessage } from '@/composables/useChatMessagesInfiniteQuery'
import { useQuery, useQueryClient } from '@tanstack/vue-query'
import type { JSONContent } from '@tiptap/vue-3'
import { useRouter } from '@kitbag/router'


const ChatMessagesList = defineAsyncComponent(() => import('@/components/ChatMessagesList.vue'))
const MessageEditor = defineAsyncComponent(() => import('@/components/MessageEditor.vue'))

const props = defineProps<{
  profileId: string
  chatId: string
}>()

const profileIdRef = toRef(() => props.profileId)
const router = useRouter()
const queryClient = useQueryClient()
const { profile: currentUserProfile } = useCurrentProfile()

const dmChatId = computed(() => {
  const id = props.chatId
  if (!id || id === 'new') return null
  return id
})

const {
  messages,
  isLoading: messagesLoading,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
} = useChatMessagesInfiniteQuery(dmChatId)

const { data: profile } = useQuery({
  queryKey: ['profile', profileIdRef],
  queryFn: async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', props.profileId)
      .single()
    if (error) throw error
    return data
  },
})

const isNewChat = computed(() => !props.chatId || props.chatId === 'new')

const profileInitial = computed(() => {
  if (!profile.value) return '?'
  return profile.value.username.charAt(0).toUpperCase()
})

const replyingTo = ref<ReplyInfo | null>(null)

function onReply(msg: ChatMessage) {
  replyingTo.value = {
    id: msg.id,
    sender: msg.sender,
    text: msg.text,
  }
}

function cancelReply() {
  replyingTo.value = null
}

const osRef = useTemplateRef<OverlayScrollbarsComponentRef>('osRef')

function getViewport(): HTMLElement | undefined {
  return osRef.value?.osInstance()?.elements().viewport
}

function scrollToBottom() {
  nextTick(() => {
    const viewport = getViewport()
    if (viewport) {
      viewport.scrollTop = viewport.scrollHeight
    }
  })
}

function scrollToMessage(id: string) {
  nextTick(() => {
    const el = document.getElementById(`msg-${id}`)
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  })
}

function shouldShowHeader(index: number): boolean {
  const list = messages.value
  if (index === 0) return true
  const prev = list[index - 1]
  const curr = list[index]
  if (prev.sender !== curr.sender) return true
  const prevTime = new Date(prev.time).getTime()
  const currTime = new Date(curr.time).getTime()
  return currTime - prevTime > 5 * 60 * 1000
}

async function getChatId(): Promise<string> {
  if (props.chatId === 'new') {
    const { data: chatId, error } = await supabase.rpc('create_chat', {
      chat_type: 'direct',
      member_ids: [props.profileId],
    })
    if (error) throw error
    await router.push(`/profile/${props.profileId}/direct/${chatId}`)
    await queryClient.invalidateQueries({ queryKey: ['chats'] })
    return chatId
  }
  return props.chatId
}

async function sendMessage(jsonContent: JSONContent) {
  const sender = currentUserProfile.value
  if (!sender) throw new Error('Нужна авторизация, чтобы отправить сообщение')

  const chatId = await getChatId()
  const { error } = await supabase.from('chat_messages').insert({
    chat_id: chatId,
    user_id: sender.id,
    message_content: jsonContent as Json,
    reply_to_chat_message_id: replyingTo.value?.id ?? null,
  })
  if (error) throw error
  replyingTo.value = null
  await queryClient.invalidateQueries({ queryKey: ['chatMessages', chatId] })
  await nextTick()
  scrollToBottom()
}

const initialScrollDoneForChat = ref<string | null>(null)

watch(dmChatId, (id) => {
  if (!id) initialScrollDoneForChat.value = null
})

watch(
  () => [dmChatId.value, messagesLoading.value, messages.value.length] as const,
  async ([cid, loading, n]) => {
    if (!cid || loading || n === 0) return
    if (initialScrollDoneForChat.value === cid) return
    initialScrollDoneForChat.value = cid
    await nextTick()
    scrollToBottom()
  },
)

function onMessagesScroll() {
  const viewport = getViewport()
  if (!viewport || isFetchingNextPage.value || !hasNextPage.value) return
  if (viewport.scrollTop < 100) fetchNextPage()
}

let scrollViewport: HTMLElement | undefined

watch(
  () => [dmChatId.value, messagesLoading.value] as const,
  async () => {
    await nextTick()
    if (scrollViewport) {
      scrollViewport.removeEventListener('scroll', onMessagesScroll)
      scrollViewport = undefined
    }
    const viewport = getViewport()
    if (!viewport || isNewChat.value) return
    scrollViewport = viewport
    viewport.addEventListener('scroll', onMessagesScroll, { passive: true })
  },
  { immediate: true },
)

onMounted(() => {
  scrollToBottom()
})

onUnmounted(() => {
  scrollViewport?.removeEventListener('scroll', onMessagesScroll)
})
</script>

<template>
  <div
    class="dm-view d-flex flex-column"
    style="height: 100dvh"
  >
    <v-toolbar
      density="comfortable"
      color="surface"
      class="dm-header flex-shrink-0"
    >
      <v-avatar
        size="28"
        :color="profile?.profile_color ?? 'primary'"
        class="ml-4 mr-2"
      >
        <v-img v-if="profile?.avatar_url" :src="profile.avatar_url" />
        <span v-else class="text-caption font-weight-medium">{{ profileInitial }}</span>
      </v-avatar>

      <v-toolbar-title class="text-body-1 font-weight-bold">
        {{ profile?.username ?? '...' }}
      </v-toolbar-title>

      <v-spacer />

      <v-btn icon="mdi-phone-outline" variant="text" size="small" />
      <v-btn icon="mdi-magnify" variant="text" size="small" class="mr-2" />
    </v-toolbar>

    <v-divider />

    <OverlayScrollbarsComponent
      ref="osRef"
      class="messages-area flex-grow-1 py-2"
      :options="{ scrollbars: { autoHide: 'scroll', theme: 'os-theme-membrane' } }"
      defer
    >
      <template v-if="isNewChat">
        <div class="new-chat-welcome d-flex flex-column align-center justify-center">
          <v-avatar
            size="64"
            :color="profile?.profile_color ?? 'primary'"
            class="mb-4"
          >
            <v-img v-if="profile?.avatar_url" :src="profile.avatar_url" />
            <span v-else class="text-h5 font-weight-medium">{{ profileInitial }}</span>
          </v-avatar>
          <div class="text-h6 font-weight-bold mb-1">{{ profile?.username ?? '...' }}</div>
          <div v-if="profile?.bio" class="text-body-2 text-on-surface-variant mb-4">{{ profile.bio }}</div>
          <div class="text-body-2 text-on-surface-variant">
            Напишите пользователю {{ profile?.username ?? '...' }} первым
          </div>
        </div>
      </template>

      <template v-else-if="!isNewChat && messagesLoading && messages.length === 0">
        <div class="d-flex align-center justify-center py-16">
          <v-progress-circular indeterminate color="primary" size="40" />
        </div>
      </template>

      <template v-else-if="messages.length > 0">
        <div v-if="isFetchingNextPage" class="d-flex justify-center py-2">
          <v-progress-circular indeterminate color="primary" size="24" />
        </div>
        <ChatMessagesList
          :messages="messages"
          :should-show-header="shouldShowHeader"
          @reply="onReply"
          @scroll-to="scrollToMessage"
        />
      </template>

      <template v-else-if="!isNewChat">
        <div class="d-flex flex-column align-center justify-center py-16 text-body-2 text-on-surface-variant">
          Пока нет сообщений — напишите первым
        </div>
      </template>
    </OverlayScrollbarsComponent>

    <MessageEditor
      :channel-name="profile?.username ?? '...'"
      :reply-to="replyingTo"
      @send="sendMessage"
      @cancel-reply="cancelReply"
      autofocus
    />
  </div>
</template>

<style scoped>
.dm-view {
  .dm-header {
    border-bottom: none;
  }

  .messages-area {
    overflow: hidden;
  }

  .new-chat-welcome {
    height: 100%;
    min-height: 200px;
    padding: 48px 24px;
  }
}
</style>
