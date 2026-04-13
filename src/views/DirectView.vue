<script setup lang="ts">
import DirectMessageConversation from '@/components/DirectMessageConversation.vue'
import { useRoute } from '@kitbag/router'
import { computed } from 'vue'

const route = useRoute('direct')

const profileId = computed(() => route.params.profileId)
const directId = computed(() => route.params.directId)

</script>

<template>
  <DirectMessageConversation
    :profileId="profileId"
    :chatId="directId"
  />
</template>

<style scoped>

</style>
