<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  channelName: string
}>()

const emit = defineEmits<{
  send: [text: string]
}>()

const message = ref('')

function handleSend() {
  const text = message.value.trim()
  if (!text) return
  emit('send', text)
  message.value = ''
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    handleSend()
  }
}
</script>

<template>
  <div class="message-input-wrapper px-4 pb-4">
    <v-card
      variant="outlined"
      rounded="xl"
      class="message-input-card"
      color="outline-variant"
    >
      <div class="d-flex align-end pa-2">
        <v-btn
          icon="mdi-plus"
          variant="text"
          size="small"
          color="on-surface-variant"
        />

        <v-textarea
          v-model="message"
          :placeholder="`Написать в #${channelName}...`"
          variant="plain"
          density="compact"
          rows="1"
          max-rows="6"
          auto-grow
          hide-details
          class="flex-grow-1 mx-1 message-textarea"
          @keydown="onKeydown"
        />

        <div class="d-flex align-center gap-1">
          <v-btn
            icon="mdi-emoticon-happy-outline"
            variant="text"
            size="small"
            color="on-surface-variant"
          />
          <v-btn
            icon="mdi-at"
            variant="text"
            size="small"
            color="on-surface-variant"
          />
          <v-btn
            icon="mdi-send"
            variant="tonal"
            size="small"
            color="primary"
            :disabled="!message.trim()"
            @click="handleSend"
          />
        </div>
      </div>
    </v-card>
  </div>
</template>

<style scoped>
.message-input-wrapper {
  flex-shrink: 0;
}

.message-textarea :deep(.v-field__input) {
  font-size: 0.875rem;
  padding-top: 8px;
  padding-bottom: 8px;
  min-height: 36px;
}

.message-textarea :deep(.v-field) {
  padding: 0;
}

.gap-1 {
  gap: 4px;
}
</style>
