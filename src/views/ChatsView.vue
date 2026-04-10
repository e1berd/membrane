<script setup lang="ts">
import { ref, computed } from 'vue'
import MessageItem from '@/components/MessageItem.vue'
import MessageInput from '@/components/MessageInput.vue'

const props = defineProps<{
  channel?: string
}>()

const channelName = computed(() => {
  const map: Record<string, string> = {
    general: 'general',
    random: 'random',
    dev: 'разработка',
    design: 'дизайн',
    announcements: 'объявления',
  }
  return map[props.channel || 'general'] || props.channel || 'general'
})

const channelDescription = computed(() => {
  const map: Record<string, string> = {
    general: 'Общий канал для всей команды',
    random: 'Неформальное общение',
    dev: 'Обсуждение разработки',
    design: 'Вопросы дизайна',
    announcements: 'Важные объявления',
  }
  return map[props.channel || 'general'] || ''
})

interface ChatMessage {
  id: string
  sender: string
  avatar: string
  text: string
  time: string
  color: string
}

const messages = ref<ChatMessage[]>([
  {
    id: '1',
    sender: 'Алексей Иванов',
    avatar: 'А',
    text: 'Привет всем! Как дела с новым релизом?',
    time: '2026-04-10T09:30:00',
    color: 'primary',
  },
  {
    id: '2',
    sender: 'Алексей Иванов',
    avatar: 'А',
    text: 'Я закончил рефакторинг модуля авторизации',
    time: '2026-04-10T09:30:30',
    color: 'primary',
  },
  {
    id: '3',
    sender: 'Мария Петрова',
    avatar: 'М',
    text: 'Отлично! Я как раз тестирую новый дизайн. Скоро покажу макеты.',
    time: '2026-04-10T09:32:00',
    color: 'tertiary',
  },
  {
    id: '4',
    sender: 'Дмитрий Козлов',
    avatar: 'Д',
    text: 'Кто-нибудь смотрел тикет #342? Там баг с уведомлениями на мобильных устройствах.',
    time: '2026-04-10T09:35:00',
    color: 'secondary',
  },
  {
    id: '5',
    sender: 'Елена Смирнова',
    avatar: 'Е',
    text: 'Да, я взяла его в работу. Проблема в WebSocket-соединении — оно не переподключается после выхода из спящего режима.',
    time: '2026-04-10T09:37:00',
    color: 'error',
  },
  {
    id: '6',
    sender: 'Алексей Иванов',
    avatar: 'А',
    text: 'Супер, спасибо! К пятнице нужно закрыть все критичные баги перед деплоем.',
    time: '2026-04-10T09:38:00',
    color: 'primary',
  },
  {
    id: '7',
    sender: 'Мария Петрова',
    avatar: 'М',
    text: 'Посмотрите, пожалуйста, макеты в Figma. Я обновила компоненты для тёмной темы 🎨',
    time: '2026-04-10T09:42:00',
    color: 'tertiary',
  },
  {
    id: '8',
    sender: 'Дмитрий Козлов',
    avatar: 'Д',
    text: 'Выглядит круто! Особенно карточки чатов',
    time: '2026-04-10T09:44:00',
    color: 'secondary',
  },
  {
    id: '9',
    sender: 'Дмитрий Козлов',
    avatar: 'Д',
    text: 'Только кнопку отправки можно сделать чуть крупнее на мобильных',
    time: '2026-04-10T09:44:20',
    color: 'secondary',
  },
])

function shouldShowHeader(index: number): boolean {
  if (index === 0) return true
  const prev = messages.value[index - 1]
  const curr = messages.value[index]
  if (prev.sender !== curr.sender) return true
  const prevTime = new Date(prev.time).getTime()
  const currTime = new Date(curr.time).getTime()
  return currTime - prevTime > 5 * 60 * 1000
}

function onSend(text: string) {
  messages.value.push({
    id: String(Date.now()),
    sender: 'Вы',
    avatar: 'U',
    text,
    time: new Date().toISOString(),
    color: 'primary',
  })
}
</script>

<template>
  <div class="chat-view d-flex flex-column" style="height: 100vh">
    <!-- Channel Header -->
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
        <span class="text-body-2 text-on-surface-variant">{{ channelDescription }}</span>
      </template>

      <v-spacer />

      <v-btn icon="mdi-bookmark-outline" variant="text" size="small" />
      <v-btn icon="mdi-account-multiple-outline" variant="text" size="small" />
      <v-btn icon="mdi-magnify" variant="text" size="small" class="mr-2" />
    </v-toolbar>

    <v-divider />

    <!-- Messages Area -->
    <div class="messages-area flex-grow-1 overflow-y-auto py-2">
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
        :key="msg.id"
        :sender="msg.sender"
        :avatar="msg.avatar"
        :text="msg.text"
        :time="msg.time"
        :color="msg.color"
        :show-header="shouldShowHeader(index)"
      />
    </div>

    <!-- Message Input -->
    <MessageInput :channel-name="channelName" @send="onSend" />
  </div>
</template>

<style scoped>
.chat-header {
  border-bottom: none;
}

.messages-area {
  scrollbar-width: thin;
  scrollbar-color: rgba(var(--v-theme-on-surface), 0.2) transparent;
}

.messages-area::-webkit-scrollbar {
  width: 6px;
}

.messages-area::-webkit-scrollbar-track {
  background: transparent;
}

.messages-area::-webkit-scrollbar-thumb {
  background-color: rgba(var(--v-theme-on-surface), 0.2);
  border-radius: 3px;
}
</style>
