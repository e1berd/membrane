<script setup lang="ts">
import ChatConversation from '@/components/ChatConversation.vue'
import { useRoute } from '@kitbag/router'
import { computed } from 'vue'


const route = useRoute('home')
const chatId = computed(() => route.params?.chatId)
const hasChatId = computed(() => chatId.value !== undefined)

</script>

<template>
  <ChatConversation :chat-id="chatId" v-if="hasChatId" />
</template>

<style scoped>

</style>
