<script setup lang="ts">
import type { Tables } from '@/lib/database.types'
import { useLink } from '@kitbag/router'

const props = defineProps<{
  chatId: string
  peer: Pick<Tables<'profiles'>, 'id' | 'username' | 'avatar_url' | 'profile_color'>
}>()

const { href, push } = useLink('direct', () => ({
  profileId: props.peer.id,
  directId: props.chatId,
}))

function initial(username: string) {
  return username.charAt(0).toUpperCase()
}
</script>

<template>
  <v-list-item
    rounded="lg"
    class="chat-sidebar-item"
    min-height="52"
    :to="href"
    @click.prevent="push()"
    @keydown.enter.prevent="push()"
  >
    <template #prepend>
      <v-avatar
        size="36"
        :color="peer.profile_color ?? 'primary'"
        class="mr-1"
      >
        <v-img v-if="peer.avatar_url" :src="peer.avatar_url" />
        <span v-else class="text-body-2 font-weight-medium">{{ initial(peer.username) }}</span>
      </v-avatar>
    </template>

    <v-list-item-title class="text-body-2 font-weight-medium text-truncate">
      {{ peer.username }}
    </v-list-item-title>
  </v-list-item>
</template>

<style scoped>
.chat-sidebar-item {
  transition: background 0.12s ease;
}
</style>
