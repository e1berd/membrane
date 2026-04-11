<script setup lang="ts">
import ChannelList from '@/components/ChannelList.vue'
import ChatConversation from '@/components/ChatConversation.vue'
import { useRoute, useRouter } from '@kitbag/router'
import { computed } from 'vue'

const route = useRoute('home')
const router = useRouter()

const chatId = computed(() => route.params?.chatId)
const hasChatId = computed(() => chatId.value !== undefined)

function selectActiveChat(chatId: string) {
  router.push(`/${chatId}`)
}


</script>

<template>
  <ChannelList
    :chat-id="chatId"
    @select="selectActiveChat"
  />
  <ChatConversation :chat-id="chatId" v-if="hasChatId" />
</template>

<style scoped>

</style>
