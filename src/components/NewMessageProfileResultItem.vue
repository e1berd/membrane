<script setup lang="ts">
import type { Tables } from '@/lib/database.types'
import { supabase } from '@/lib/supabase'
import { useLink, useRouter } from '@kitbag/router'
import { onMounted, ref } from 'vue'

const props = defineProps<{
  profile: Tables<'profiles'>
}>()

const emit = defineEmits<{
  select: []
}>()

function getInitial(username: string) {
  return username.charAt(0).toUpperCase()
}

const chatId = ref<Tables<'chats'>['id']>()
const router = useRouter()
const newDirectLink = useLink('direct', { directId: 'new', profileId: props.profile.id })


function getDirect() {
  return supabase
    .from('chats')
    .select('id, chat_members!inner(user_id)')
    .eq('type', 'direct')
    .eq('chat_members.user_id', props.profile.id)
    .maybeSingle()
}

async function gotoDirect() {
  if (chatId.value) {
    await router.push('direct', { directId: chatId.value, profileId: props.profile.id })
  } else {
    await newDirectLink.push()
  }
  emit('select')
}

onMounted(async () => {
  const { data: chat } = await getDirect()
  chatId.value = chat?.id
})

</script>

<template>
  <v-list-item
    rounded="lg"
    class="result-item"
    min-height="56"
    @click.prevent="gotoDirect()"
    @keydown.enter.prevent="gotoDirect()"
  >
    <template #prepend>
      <v-avatar
        size="40"
        :color="profile.profile_color ?? 'primary'"
        class="mr-1"
      >
        <v-img v-if="profile.avatar_url" :src="profile.avatar_url" />
        <span v-else class="text-body-1 font-weight-medium">
          {{ getInitial(profile.username) }}
        </span>
      </v-avatar>
    </template>

    <v-list-item-title class="text-body-2 font-weight-medium">
      {{ profile.username }}
    </v-list-item-title>
    <v-list-item-subtitle v-if="profile.bio" class="text-caption mt-0">
      {{ profile.bio }}
    </v-list-item-subtitle>

    <template #append>
      <v-icon
        icon="mdi-arrow-right"
        size="16"
        color="on-surface-variant"
        class="result-arrow"
      />
    </template>
  </v-list-item>
</template>

<style scoped>
.result-item {
  transition: background 0.12s ease;
}

.result-arrow {
  opacity: 0;
  transition: opacity 0.12s ease;
}

.result-item:hover .result-arrow {
  opacity: 1;
}
</style>
