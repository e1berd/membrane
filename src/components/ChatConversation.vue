<script setup lang="ts">
import { ref, computed, nextTick, watch, useTemplateRef, defineAsyncComponent } from 'vue'
import { OverlayScrollbarsComponent } from 'overlayscrollbars-vue'
import type { OverlayScrollbarsComponentRef } from 'overlayscrollbars-vue'
import 'overlayscrollbars/overlayscrollbars.css'
import type { ReplyInfo } from '@/components/MessageItem.vue'
import { useCurrentProfile } from '@/composables/useCurrentProfile'

const MemberList = defineAsyncComponent(() => import('@/components/MemberList.vue'))
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

interface ChatMessage {
  id: string
  userId?: string
  sender: string
  avatar: string
  avatar_url?: string | null
  overlay_url?: string | null
  bio?: string | null
  text: string
  time: string
  color: string
  replyTo?: ReplyInfo
}

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

const osRef = useTemplateRef<OverlayScrollbarsComponentRef>('osRef')
const osReady = ref(false)

async function scrollToBottom() {
  await nextTick()
  await nextTick()
  const viewport = osRef.value?.osInstance()?.elements().viewport
  if (viewport) viewport.scrollTop = viewport.scrollHeight
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
  const p = currentProfile.value
  messages.value.push({
    id: String(Date.now()),
    userId: p?.id,
    sender: p?.username ?? 'Вы',
    avatar: p ? p.username.charAt(0).toUpperCase() : 'U',
    avatar_url: p?.avatar_url ?? null,
    overlay_url: p?.overlay_url ?? null,
    bio: p?.bio ?? null,
    text: html,
    time: new Date().toISOString(),
    color: p?.profile_color ?? 'primary',
    replyTo: replyingTo.value ?? undefined,
  })
  replyingTo.value = null
  scrollToBottom()
}

watch(() => messages.value.length, () => {
  scrollToBottom()
})

watch(() => props.chatId, () => {
  scrollToBottom()
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

      <OverlayScrollbarsComponent
        ref="osRef"
        class="messages-area flex-grow-1 py-2"
        :options="{ scrollbars: { autoHide: 'scroll', theme: 'os-theme-membrane' } }"
        @os-initialized="osReady = true"
      >
        <ChatMessagesList
          :messages="messages"
          :should-show-header="shouldShowHeader"
          @reply="onReply"
          @scroll-to="scrollToMessage"
          @vue:mounted="scrollToBottom"
        />
      </OverlayScrollbarsComponent>

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

  .messages-area {
    overflow: hidden;
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
