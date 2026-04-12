<script setup lang="ts">
import MessageItem from '@/components/MessageItem.vue'
import type { ReplyInfo } from '@/components/MessageItem.vue'
import type { Tables } from '@/lib/database.types'
import { onBeforeMount, ref } from 'vue'

type ChatMessage = Pick<Tables<'chat_messages'>, 'id'> &
  Pick<Tables<'profiles'>, 'avatar_url' | 'overlay_url' | 'bio'> & {
    userId: string
    sender: string
    avatar: string
    text: string
    time: string
    color: string
    replyTo?: ReplyInfo
  }

defineProps<{
  messages: ChatMessage[]
  shouldShowHeader: (index: number) => boolean
}>()

const emit = defineEmits<{
  reply: [msg: ChatMessage]
  scrollTo: [id: string]
}>()


const canAnimate = ref(false)

onBeforeMount(() => {
  canAnimate.value = true
})
</script>

<template>
  <div class="d-flex align-center px-4 my-3">
    <v-divider />
    <v-chip size="small" variant="outlined" color="outline" class="mx-3 flex-shrink-0">
      Сегодня
    </v-chip>
    <v-divider />
  </div>

  <TransitionGroup
    mode="out-in"
    tag="ul"
    :name="canAnimate ? 'message' : undefined"
  >
    <MessageItem
      v-for="(msg, index) in messages"
      :id="`msg-${msg.id}`"
      :key="msg.id"
      :user-id="msg.userId"
      :sender="msg.sender"
      :avatar="msg.avatar"
      :avatar-url="msg.avatar_url"
      :overlay-url="msg.overlay_url"
      :bio="msg.bio"
      :text="msg.text"
      :time="msg.time"
      :color="msg.color"
      :show-header="shouldShowHeader(index)"
      :reply-to="msg.replyTo"
      @reply="emit('reply', msg)"
      @scroll-to="emit('scrollTo', $event)"
    />
  </TransitionGroup>
</template>

<style scoped>
.message-enter-active {
  interpolate-size: allow-keywords;
  overflow: hidden;
}

.message-enter-from {
  opacity: 0;
}

.message-enter-to {
  opacity: 1;
}
</style>
