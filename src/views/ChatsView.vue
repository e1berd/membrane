<script setup lang="ts">
import { ref, computed, nextTick, onMounted, watch } from 'vue'
import MessageItem from '@/components/MessageItem.vue'
import type { ReplyInfo } from '@/components/MessageItem.vue'
import MessageEditor from '@/components/MessageEditor.vue'
import MemberList from '@/components/MemberList.vue'

const props = defineProps<{
  channel?: string
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
  replyTo?: ReplyInfo
}

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
    text: 'Я закончил рефакторинг модуля авторизации, всё прошло чисто',
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
  {
    id: '10',
    sender: 'Елена Смирнова',
    avatar: 'Е',
    text: 'Я нашла корень проблемы с WebSocket. Нужно добавить heartbeat с интервалом в 30 секунд и reconnect с экспоненциальным backoff.',
    time: '2026-04-10T10:05:00',
    color: 'error',
  },
  {
    id: '11',
    sender: 'Игорь Волков',
    avatar: 'И',
    text: 'Привет! Подключился к созвону поздно, что я пропустил?',
    time: '2026-04-10T10:15:00',
    color: 'secondary',
  },
  {
    id: '12',
    sender: 'Алексей Иванов',
    avatar: 'А',
    text: 'Игорь, коротко: релиз в пятницу, Елена чинит WebSocket, Маша обновляет дизайн. Остальное в треде.',
    time: '2026-04-10T10:16:00',
    color: 'primary',
  },
  {
    id: '13',
    sender: 'Игорь Волков',
    avatar: 'И',
    text: 'Понял, спасибо! Я тогда возьму оптимизацию запросов к БД, там есть пара N+1',
    time: '2026-04-10T10:18:00',
    color: 'secondary',
  },
  {
    id: '14',
    sender: 'Мария Петрова',
    avatar: 'М',
    text: 'Кстати, я добавила новые иконки в дизайн-систему. Все Material Symbols, как мы договаривались.',
    time: '2026-04-10T10:25:00',
    color: 'tertiary',
  },
  {
    id: '15',
    sender: 'Дмитрий Козлов',
    avatar: 'Д',
    text: 'Класс! А что насчёт анимаций переходов между экранами? Мы их оставляем на следующий спринт?',
    time: '2026-04-10T10:30:00',
    color: 'secondary',
  },
  {
    id: '16',
    sender: 'Алексей Иванов',
    avatar: 'А',
    text: 'Да, анимации — следующий спринт. Сейчас фокус на стабильности.',
    time: '2026-04-10T10:31:00',
    color: 'primary',
  },
])

const messagesContainer = ref<HTMLElement>()

function scrollToBottom() {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
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
}

onMounted(() => {
  scrollToBottom()
})

watch(() => props.channel, () => {
  scrollToBottom()
})
</script>

<template>
  <div class="chat-view d-flex" style="height: 100vh">
    <!-- Main Chat Column -->
    <div class="d-flex flex-column flex-grow-1 min-width-0">
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

      <!-- Messages Area -->
      <div ref="messagesContainer" class="messages-area flex-grow-1 overflow-y-auto py-2">
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
          :reply-to="msg.replyTo"
          @reply="onReply(msg)"
        />
      </div>

      <!-- Message Editor -->
      <MessageEditor
        :channel-name="channelName"
        :reply-to="replyingTo"
        @send="onSend"
        @cancel-reply="cancelReply"
      />
    </div>

    <!-- Members Panel -->
    <v-expand-x-transition>
      <div v-show="showMembers" class="members-panel flex-shrink-0">
        <v-divider vertical />
        <MemberList />
      </div>
    </v-expand-x-transition>
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

.members-panel {
  width: 240px;
  display: flex;
  background-color: rgb(var(--v-theme-surface));
}

.min-width-0 {
  min-width: 0;
}
</style>
