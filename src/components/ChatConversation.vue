<script setup lang="ts">
import { ref, computed, nextTick, watch, useTemplateRef, defineAsyncComponent } from 'vue'
import type { ReplyInfo } from '@/types'
import { useCurrentProfile } from '@/composables/useCurrentProfile'
import type { Json } from '@/lib/database.types'
import type { ChatMessage } from '@/composables/useChatMessagesInfiniteQuery'
import { messageContentToHtml } from '@/lib/messageContentToHtml'

const MemberList = defineAsyncComponent(() => import('@/components/MemberList.vue'))
const ChatScrollArea = defineAsyncComponent(() => import('@/components/ChatScrollArea.vue'))
const ChatMessagesList = defineAsyncComponent(() => import('@/components/ChatMessagesList.vue'))
const MessageEditor = defineAsyncComponent(() => import('@/components/MessageEditor.vue'))

const props = defineProps<{
  chatId?: string
}>()

const showMembers = ref(true)

const channelName = computed(() => {
  const map: Record<string, string> = {
    general: 'general',
    random: 'random',
    dev: 'разработка',
    design: 'дизайн',
    announcements: 'объявления',
  }
  return map[props.chatId || 'general'] || props.chatId || 'general'
})

const channelDescription = computed(() => {
  const map: Record<string, string> = {
    general: 'Общий канал для всей команды',
    random: 'Неформальное общение',
    dev: 'Обсуждение разработки',
    design: 'Вопросы дизайна',
    announcements: 'Важные объявления',
  }
  return map[props.chatId || 'general'] || ''
})


const { profile: currentProfile } = useCurrentProfile()
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

const messages = ref<ChatMessage[]>([])

const scrollAreaRef = useTemplateRef<InstanceType<typeof ChatScrollArea>>('scrollAreaRef')

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

function onSend(contentJson: Json) {
  const p = currentProfile.value
  messages.value.push({
    id: String(Date.now()),
    userId: p?.id ?? '',
    sender: p?.username ?? 'Вы',
    avatar: p ? p.username.charAt(0).toUpperCase() : 'U',
    avatar_url: p?.avatar_url ?? null,
    overlay_url: p?.overlay_url ?? null,
    bio: p?.bio ?? null,
    text: messageContentToHtml(contentJson),
    time: new Date().toISOString(),
    color: p?.profile_color ?? 'primary',
    replyTo: replyingTo.value ?? undefined,
    is_read: false,
  })
  replyingTo.value = null
}

watch(() => props.chatId, () => {
  scrollAreaRef.value?.reset()
})
</script>

<template>
  <div class="chat-view d-flex" style="height: 100vh">
    <div class="d-flex flex-column flex-grow-1 min-width-0">
      <v-toolbar
        density="comfortable"
        color="surface"
        class="chat-header flex-shrink-0"
      >
        <v-icon icon="mdi-pound" size="20" class="ml-4 mr-1" color="on-surface-variant" />
        <v-toolbar-title class="text-body-1 font-weight-bold">
          {{ channelName }}
        </v-toolbar-title>

        <template v-if="channelDescription">
          <v-divider vertical class="mx-3 my-3" />
          <span class="text-body-2 text-on-surface-variant text-truncate">{{ channelDescription }}</span>
        </template>

        <v-spacer />

        <v-btn icon="mdi-bookmark-outline" variant="text" size="small" />
        <v-btn
          icon="mdi-account-multiple-outline"
          variant="text"
          size="small"
          :color="showMembers ? 'primary' : undefined"
          @click="showMembers = !showMembers"
        />
        <v-btn icon="mdi-magnify" variant="text" size="small" class="mr-2" />
      </v-toolbar>

      <v-divider />

      <ChatScrollArea
        ref="scrollAreaRef"
        class="flex-grow-1"
      >
        <ChatMessagesList
          :messages="messages"
          :should-show-header="shouldShowHeader"
          @reply="onReply"
          @scrollTo="scrollToMessage"
        />
      </ChatScrollArea>

      <MessageEditor
        :channel-name="channelName"
        :reply-to="replyingTo"
        @send="onSend"
        @cancel-reply="cancelReply"
      />
    </div>

    <v-expand-x-transition>
      <div v-if="showMembers" class="members-panel flex-shrink-0">
        <v-divider vertical />
        <MemberList />
      </div>
    </v-expand-x-transition>
  </div>
</template>

<style scoped>
.chat-view {
  .chat-header {
    border-bottom: none;
  }

  .members-panel {
    inline-size: 240px;
    display: flex;
    background-color: rgb(var(--v-theme-surface));
  }

  .min-width-0 {
    min-inline-size: 0;
  }
}

@media (width <= 980px) {
  .chat-view {
    .members-panel {
      inline-size: 220px;
    }
  }
}
</style>
