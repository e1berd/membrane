<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  sender: string
  avatar: string
  text: string
  time: string
  color?: string
  showHeader?: boolean
}>()

const formattedTime = computed(() => {
  const date = new Date(props.time)
  return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
})
</script>

<template>
  <div class="message-item px-4 py-1" :class="{ 'pt-3': showHeader }">
    <div class="d-flex gap-3">
      <v-avatar
        v-if="showHeader"
        size="36"
        :color="color || 'primary'"
        class="mt-1 avatar-slot"
      >
        <span class="text-body-2 font-weight-medium">{{ avatar }}</span>
      </v-avatar>
      <div v-else class="avatar-slot" />

      <div class="flex-grow-1 min-width-0">
        <div v-if="showHeader" class="d-flex align-center gap-2 mb-1">
          <span class="text-body-2 font-weight-bold">{{ sender }}</span>
          <span class="text-caption text-on-surface-variant">{{ formattedTime }}</span>
        </div>
        <div class="text-body-2 message-text" v-html="text" />
      </div>
    </div>
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

.message-text {
  white-space: pre-wrap;
  word-break: break-word;
  line-height: 1.5;
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
