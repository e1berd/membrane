<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, useTemplateRef, watch } from 'vue'
import ChatSidebarItem from '@/components/ChatSidebarItem.vue'
import { vAutoAnimate } from '@formkit/auto-animate/vue'

export type DirectChatRow = {
  id: string
  created_at: string | null
  type: string
  chat_members: {
    user_id: string
    profiles: {
      id: string
      username: string
      avatar_url: string | null
      profile_color: string | null
    } | null
  }[] | null
}

const props = defineProps<{
  chats: DirectChatRow[]
  currentUserId: string
  hasNextPage?: boolean
  isFetchingNextPage?: boolean
}>()

const emit = defineEmits<{
  loadMore: []
}>()

const sentinel = useTemplateRef('sentinel')
let observer: IntersectionObserver | null = null

async function setupObserver() {
  observer?.disconnect()
  observer = null
  await nextTick()
  if (!sentinel.value) return
  observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting && props.hasNextPage && !props.isFetchingNextPage) {
      emit('loadMore')
    }
  })
  observer.observe(sentinel.value)
}

onMounted(() => {
  void setupObserver()
})

watch(
  () => [props.hasNextPage, props.isFetchingNextPage, props.chats.length] as const,
  () => {
    void setupObserver()
  },
)

onUnmounted(() => {
  observer?.disconnect()
})

type PeerProfile = NonNullable<NonNullable<DirectChatRow['chat_members']>[number]['profiles']>

const rows = computed((): { chat: DirectChatRow; peer: PeerProfile }[] => {
  const uid = props.currentUserId
  const out: { chat: DirectChatRow; peer: PeerProfile }[] = []
  for (const chat of props.chats) {
    const members = chat.chat_members ?? []
    const peerMember = members.find((m) => m.user_id !== uid)
    const peer = peerMember?.profiles
    if (peer) out.push({ chat, peer })
  }
  return out
})
</script>

<template>
  <div>
    <v-list
      density="compact"
      nav
      class="px-2"
      v-auto-animate
    >
      <ChatSidebarItem
        v-for="{ chat, peer } in rows"
        :key="chat.id"
        :chat-id="chat.id"
        :peer="peer"
      />

    </v-list>

    <div
      v-if="hasNextPage"
      ref="sentinel"
      class="load-sentinel"
      aria-hidden="true"
    />

    <div v-if="isFetchingNextPage" class="d-flex justify-center pa-2">
      <v-progress-circular indeterminate size="20" />
    </div>
  </div>
</template>

<style scoped>
.load-sentinel {
  block-size: 1px;
}
</style>
