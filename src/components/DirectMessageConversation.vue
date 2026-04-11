<script setup lang="ts">
import { ref, computed, nextTick, onMounted, watch, useTemplateRef, defineAsyncComponent } from 'vue'
import { OverlayScrollbarsComponent } from 'overlayscrollbars-vue'
import type { OverlayScrollbarsComponentRef } from 'overlayscrollbars-vue'
import 'overlayscrollbars/overlayscrollbars.css'
import type { ReplyInfo } from '@/components/MessageItem.vue'
import { supabase } from '@/lib/supabase'
import type { Profile } from '@/rstore/collections'

const ChatMessagesList = defineAsyncComponent(() => import('@/components/ChatMessagesList.vue'))
const MessageEditor = defineAsyncComponent(() => import('@/components/MessageEditor.vue'))

const props = defineProps<{
  profileId: string
  chatId: string
}>()

const profile = ref<Profile | null>(null)
const loadingProfile = ref(true)

async function loadProfile() {
  loadingProfile.value = true
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', props.profileId)
    .single()
  if (data) {
    profile.value = data as Profile
  }
  loadingProfile.value = false
}

const isNewChat = computed(() => !props.chatId || props.chatId === 'new')

const profileInitial = computed(() => {
  if (!profile.value) return '?'
  return profile.value.username.charAt(0).toUpperCase()
})

interface ChatMessage {
  id: string
  sender: string
  avatar: string
  text: string
  time: string
  color: string
  replyTo?: ReplyInfo
}

const replyingTo = ref<ReplyInfo | null>(null)
const messages = ref<ChatMessage[]>([])

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
  if (index === 0) return true
  const prev = messages.value[index - 1]
  const curr = messages.value[index]
  if (prev.sender !== curr.sender) return true
  const prevTime = new Date(prev.time).getTime()
  const currTime = new Date(curr.time).getTime()
  return currTime - prevTime > 5 * 60 * 1000
}

function onSend(html: string) {
  messages.value.push({
    id: String(Date.now()),
    sender: 'Вы',
    avatar: 'U',
    text: html,
    time: new Date().toISOString(),
    color: 'primary',
    replyTo: replyingTo.value ?? undefined,
  })
  replyingTo.value = null
  scrollToBottom()

  // TODO: when backend is ready, create chat and replace route from 'new' to actual chat UUID
}

onMounted(() => {
  loadProfile()
  scrollToBottom()
})

watch(() => props.profileId, () => {
  loadProfile()
  messages.value = []
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
      <template v-if="isNewChat && messages.length === 0">
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

      <template v-else-if="messages.length > 0">
        <ChatMessagesList
          :messages="messages"
          :should-show-header="shouldShowHeader"
          @reply="onReply"
          @scroll-to="scrollToMessage"
        />
      </template>
    </OverlayScrollbarsComponent>

    <MessageEditor
      :channel-name="profile?.username ?? '...'"
      :reply-to="replyingTo"
      @send="onSend"
      @cancel-reply="cancelReply"
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
