<script setup lang="ts">
import MessageItem from '@/components/MessageItem.vue'
import type { ReplyInfo } from '@/components/MessageItem.vue'

interface ChatMessage {
  id: string
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
</script>

<template>
  <!-- Date Divider -->
  <div class="d-flex align-center px-4 my-3">
    <v-divider />
    <v-chip size="small" variant="outlined" color="outline" class="mx-3 flex-shrink-0">
      Сегодня
    </v-chip>
    <v-divider />
  </div>

  <MessageItem
    v-for="(msg, index) in messages"
    :id="`msg-${msg.id}`"
    :key="msg.id"
    :sender="msg.sender"
    :avatar="msg.avatar"
    :text="msg.text"
    :time="msg.time"
    :color="msg.color"
    :show-header="shouldShowHeader(index)"
    :reply-to="msg.replyTo"
    @reply="emit('reply', msg)"
    @scroll-to="emit('scrollTo', $event)"
  />
</template>
