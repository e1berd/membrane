<script setup lang="ts">
import { ref, computed, nextTick, watch, useTemplateRef, defineAsyncComponent, toRef } from 'vue'
import type { ReplyInfo } from '@/components/MessageItem.vue'
import { supabase } from '@/lib/supabase'
import type { Json } from '@/lib/database.types'
import { useCurrentProfile } from '@/composables/useCurrentProfile'
import { useChatMessagesInfiniteQuery, type ChatMessage } from '@/composables/useChatMessagesInfiniteQuery'
import { useQuery, useQueryClient } from '@tanstack/vue-query'
import type { JSONContent } from '@tiptap/vue-3'
import { useRouter } from '@kitbag/router'
import { differenceInMinutes } from 'date-fns'

const ChatScrollArea = defineAsyncComponent(() => import('@/components/ChatScrollArea.vue'))
const ChatMessagesList = defineAsyncComponent(() => import('@/components/ChatMessagesList.vue'))
const MessageEditor = defineAsyncComponent(() => import('@/components/MessageEditor.vue'))
const UserProfileDialog = defineAsyncComponent(() => import('@/components/UserProfileDialog.vue'))

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

const scrollAreaRef = useTemplateRef<InstanceType<typeof ChatScrollArea>>('scrollAreaRef')

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
  return differenceInMinutes(
    new Date(curr.time),
    new Date(prev.time),
  ) > 5
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
}

function onLoadMore() {
  if (!isFetchingNextPage.value && hasNextPage.value) fetchNextPage()
}

watch(dmChatId, () => {
  scrollAreaRef.value?.reset()
})
</script>

<template>
  <div
    class="dm-view d-flex flex-column"
    style="height: 100dvh"
    :key="props.chatId + props.profileId"
  >
    <v-toolbar
      density="comfortable"
      color="surface"
      class="dm-header flex-shrink-0"
    >
      <UserProfileDialog
        v-if="profile"
        :user="{
          userId: profile.id,
          name: profile.username,
          avatar: profileInitial,
          avatar_url: profile.avatar_url,
          overlay_url: profile.overlay_url,
          color: profile.profile_color ?? 'primary',
          bio: profile.bio,
        }"
      >
        <template #activator="{ props: profileProps }">
          <div v-bind="profileProps" class="d-flex align-center ml-4 mr-2 cursor-pointer">
            <v-avatar
              size="28"
              :color="profile.profile_color ?? 'primary'"
              class="mr-2"
            >
              <v-img v-if="profile.avatar_url" :src="profile.avatar_url" />
              <span v-else class="text-caption font-weight-medium">{{ profileInitial }}</span>
            </v-avatar>
            <span class="text-body-1 font-weight-bold">{{ profile.username }}</span>
          </div>
        </template>
      </UserProfileDialog>
      <v-avatar v-else size="28" color="primary" class="ml-4 mr-2">
        <span class="text-caption font-weight-medium">?</span>
      </v-avatar>

      <v-toolbar-title v-if="!profile" class="text-body-1 font-weight-bold">
        ...
      </v-toolbar-title>

      <v-spacer />

      <v-btn icon="mdi-phone-outline" variant="text" size="small" />
      <v-btn icon="mdi-magnify" variant="text" size="small" class="mr-2" />
    </v-toolbar>

    <v-divider />

    <ChatScrollArea
      ref="scrollAreaRef"
      class="flex-grow-1"
      @load-more="onLoadMore"
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
          Пока нет сообщений - напишите первым
        </div>
      </template>
    </ChatScrollArea>

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

  .cursor-pointer {
    cursor: pointer;
  }

  .new-chat-welcome {
    height: 100%;
    min-height: 200px;
    padding: 48px 24px;
  }
}
</style>
