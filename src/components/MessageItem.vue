<script setup lang="ts">
import { defineAsyncComponent, ref, computed } from 'vue'
import { format } from 'date-fns'

const UserProfileDialog = defineAsyncComponent(() => import('@/components/UserProfileDialog.vue'))

export interface ReplyInfo {
  id: string
  sender: string
  text: string
}

const props = defineProps<{
  userId?: string
  sender: string
  avatar: string
  avatarUrl?: string | null
  overlayUrl?: string | null
  bio?: string | null
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

function copyMessageContent() {
  navigator.clipboard.writeText(props.text)
}
</script>

<template>
  <li
    class="message-item px-4 py-1"
    :class="{ 'pt-3': showHeader }"
    @contextmenu="onContextMenu"
  >
    <div v-if="replyTo" class="d-flex align-center gap-2 reply-reference ml-12 mb-1">
      <v-icon icon="mdi-reply" size="14" color="on-surface-variant" class="reply-icon" />
      <span class="text-caption font-weight-bold text-on-surface-variant">{{ replyTo.sender }}</span>
      <span class="text-caption text-on-surface-variant reply-text-preview">{{ replyPreviewText }}</span>
    </div>

    <div class="d-flex gap-3">
      <UserProfileDialog
        v-if="showHeader"
        :user="{ userId, name: sender, avatar, avatar_url: avatarUrl, overlay_url: overlayUrl, bio, color: color || 'primary' }"
      >
        <template #activator="{ props: profileProps }">
          <v-avatar
            v-bind="profileProps"
            size="36"
            :color="color || 'primary'"
            class="mt-1 avatar-slot clickable-avatar"
          >
            <v-img v-if="avatarUrl" :src="avatarUrl" :alt="avatar" />
            <span v-else class="text-body-2 font-weight-medium">{{ avatar }}</span>
          </v-avatar>
        </template>
      </UserProfileDialog>
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
            @click="copyMessageContent"
          />
          <v-list-item
            prepend-icon="mdi-pin-outline"
            title="Закрепить"
            @click="showContextMenu = false"
          />
        </v-list>
      </v-card>
    </v-menu>
  </li>
</template>

<style scoped>
.message-item {
  transition: background-color 0.15s ease;

  .avatar-slot {
    inline-size: 36px;
    min-inline-size: 36px;
  }

  .clickable-avatar {
    cursor: pointer;
  }

  .hover-time {
    opacity: 0;
    font-size: 10px;
    line-height: 1;
    white-space: nowrap;
    transition: opacity 0.15s ease;
  }

  .message-text {
    line-height: 1.5;
    white-space: pre-wrap;
    word-break: break-word;
    text-wrap: pretty;
  }

  .reply-reference {
    cursor: pointer;
    padding: 2px 8px;
    border-radius: 4px;
    border-left: 2px solid color-mix(in srgb, rgb(var(--v-theme-primary)) 60%, transparent);
  }

  .reply-text-preview {
    max-inline-size: 400px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
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
    min-inline-size: 0;
  }
}

@media (hover: hover) {
  .message-item {
    &:hover {
      background-color: color-mix(in srgb, rgb(var(--v-theme-on-surface)) 4%, transparent);

      .hover-time {
        opacity: 1;
      }
    }

    .reply-reference:hover {
      background-color: color-mix(in srgb, rgb(var(--v-theme-on-surface)) 4%, transparent);
    }
  }
}

@supports not (color: color-mix(in srgb, black 50%, transparent)) {
  .message-item {
    .reply-reference {
      border-left-color: rgba(var(--v-theme-primary), 0.6);
    }
  }

  @media (hover: hover) {
    .message-item {
      &:hover {
        background-color: rgba(var(--v-theme-on-surface), 0.04);
      }

      .reply-reference:hover {
        background-color: rgba(var(--v-theme-on-surface), 0.04);
      }
    }
  }
}

@media (prefers-reduced-motion: reduce) {
  .message-item,
  .message-item .hover-time {
    transition-duration: 0.01ms;
  }
}
</style>
