<script setup lang="ts">
import { ref, computed } from 'vue'
import { format } from 'date-fns'

export interface ReplyInfo {
  id: string
  sender: string
  text: string
}

const props = defineProps<{
  sender: string
  avatar: string
  text: string
  time: string
  color?: string
  showHeader?: boolean
  replyTo?: ReplyInfo
}>()

const emit = defineEmits<{
  reply: []
}>()

const showContextMenu = ref(false)
const contextMenuX = ref(0)
const contextMenuY = ref(0)

const formattedTime = computed(() => {
  return format(new Date(props.time), 'HH:mm')
})

const replyPreviewText = computed(() => {
  if (!props.replyTo) return ''
  const div = document.createElement('div')
  div.innerHTML = props.replyTo.text
  const plain = div.textContent || ''
  return plain.length > 100 ? plain.slice(0, 100) + '…' : plain
})

function onContextMenu(e: MouseEvent) {
  e.preventDefault()
  contextMenuX.value = e.clientX
  contextMenuY.value = e.clientY
  showContextMenu.value = true
}

function onReply() {
  showContextMenu.value = false
  emit('reply')
}
</script>

<template>
  <div
    class="message-item px-4 py-1"
    :class="{ 'pt-3': showHeader }"
    @contextmenu="onContextMenu"
  >
    <!-- Reply reference -->
    <div v-if="replyTo" class="d-flex align-center gap-2 reply-reference ml-12 mb-1">
      <v-icon icon="mdi-reply" size="14" color="on-surface-variant" class="reply-icon" />
      <span class="text-caption font-weight-bold text-on-surface-variant">{{ replyTo.sender }}</span>
      <span class="text-caption text-on-surface-variant reply-text-preview">{{ replyPreviewText }}</span>
    </div>

    <div class="d-flex gap-3">
      <v-avatar
        v-if="showHeader"
        size="36"
        :color="color || 'primary'"
        class="mt-1 avatar-slot"
      >
        <span class="text-body-2 font-weight-medium">{{ avatar }}</span>
      </v-avatar>
      <div v-else class="avatar-slot d-flex align-center justify-center">
        <span class="hover-time text-caption text-on-surface-variant">{{ formattedTime }}</span>
      </div>

      <div class="flex-grow-1 min-width-0">
        <div v-if="showHeader" class="d-flex align-center gap-2 mb-1">
          <span class="text-body-2 font-weight-bold">{{ sender }}</span>
          <span class="text-caption text-on-surface-variant">{{ formattedTime }}</span>
        </div>
        <div class="text-body-2 message-text" v-html="text" />
      </div>
    </div>

    <v-menu
      v-model="showContextMenu"
      :target="[contextMenuX, contextMenuY]"
      location="end top"
      origin="start top"
      min-width="180"
      scrim="transparent"
    >
      <v-card rounded="lg" elevation="8" color="surface-container">
        <v-list density="compact" bg-color="transparent" class="py-1">
          <v-list-item
            prepend-icon="mdi-reply"
            title="Ответить"
            @click="onReply"
          />
          <v-list-item
            prepend-icon="mdi-content-copy"
            title="Копировать текст"
            @click="showContextMenu = false"
          />
          <v-list-item
            prepend-icon="mdi-pin-outline"
            title="Закрепить"
            @click="showContextMenu = false"
          />
        </v-list>
      </v-card>
    </v-menu>
  </div>
</template>

<style scoped>
.message-item {
  transition: background-color 0.15s;
}

.message-item:hover {
  background-color: rgba(var(--v-theme-on-surface), 0.04);
}

.avatar-slot {
  width: 36px;
  min-width: 36px;
}

.hover-time {
  opacity: 0;
  font-size: 10px;
  line-height: 1;
  white-space: nowrap;
  transition: opacity 0.15s;
}

.message-item:hover .hover-time {
  opacity: 1;
}

.message-text {
  white-space: pre-wrap;
  word-break: break-word;
  line-height: 1.5;
}

.reply-reference {
  cursor: pointer;
  padding: 2px 8px;
  border-radius: 4px;
  border-left: 2px solid rgba(var(--v-theme-primary), 0.6);
}

.reply-reference:hover {
  background-color: rgba(var(--v-theme-on-surface), 0.04);
}

.reply-text-preview {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 400px;
}

.reply-icon {
  transform: scaleX(-1);
}

.gap-2 {
  gap: 8px;
}

.gap-3 {
  gap: 12px;
}

.min-width-0 {
  min-width: 0;
}
</style>
