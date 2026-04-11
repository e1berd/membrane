<script setup lang="ts">
import { useCurrentProfile } from '@/composables/useCurrentProfile'
import { supabase } from '@/lib/supabase'
import type { Chat } from '@/rstore/collections'
import { PostgrestSingleResponse } from '@supabase/supabase-js'
import { onUnmounted, ref, watch } from 'vue'

const props = defineProps<{
  workspaceId?: string
}>()

const emit = defineEmits<{
  select: [channel: string]
}>()

const search = ref('')
const isLoading = ref(true)
const chats = ref<PostgrestSingleResponse<Chat[]>>()

const { profile } = useCurrentProfile()

let limit = 128
function loadChats() {
  return supabase
    .from('chats')
    .select('*, chat_members!inner(user_id)')
    .eq('type', 'direct')
    .eq('chat_members.user_id', profile.value?.id)
    .limit(limit)
}

const channel = supabase
  .channel('chats-inserts')
  .on(
    'postgres_changes',
    { event: 'INSERT', schema: 'public', table: 'chats' },
    async (payload) => {
      const { data } = await supabase
        .from('chat_members')
        .select('user_id')
        .eq('chat_id', payload.new.id)
        .eq('user_id', profile.value?.id)
        .maybeSingle()

      if (data) {
        chats.value?.data?.push(payload.new as Chat)
      }
    },
  )
  .subscribe()

watch(
  profile,
  async (p) => {
    if (!p) return
    chats.value = await loadChats()
    isLoading.value = false
  },
  { immediate: true },
)

onUnmounted(() => {
  supabase.removeChannel(channel)
})

</script>

<template>
  <v-navigation-drawer
    permanent
    :width="260"
    color="surface-container"
    class="channel-drawer"
  >
    <div class="pa-3 pb-1">
      <div class="d-flex align-center justify-space-between mb-3">
        <span class="text-title-medium font-weight-bold">Membrane</span>
        <v-btn
          icon="mdi-square-edit-outline"
          variant="text"
          size="small"
          color="on-surface-variant"
        />
      </div>

      <v-text-field
        v-model="search"
        placeholder="Поиск"
        prepend-inner-icon="mdi-magnify"
        variant="solo-filled"
        density="compact"
        rounded="lg"
        flat
        hide-details
        single-line
        class="search-field"
        bg-color="surface-container-high"
      />
    </div>


    <div
      v-if="isLoading"
      style="height: calc(100% - 124px)"
      class="d-flex align-center justify-center flex-grow-1"
    >
      <v-progress-circular indeterminate size="24" />
    </div>

    <v-alert
      v-if="chats?.error"
      type="error"
      variant="tonal"
      class="ma-2"
    >{{ chats.error.message }}</v-alert>

    <div
      v-if="!isLoading && !chats?.error && !chats?.data?.length"
      class="d-flex align-center justify-center flex-grow-1"
      style="height: calc(100% - 124px)"
    >
      <span class="text-body-2 text-medium-emphasis">Нет диалогов</span>
    </div>

    <v-list density="compact" nav class="px-2">

    </v-list>

  </v-navigation-drawer>
</template>

<style scoped>
.channel-drawer {
  border-right: 1px solid color-mix(in srgb, rgb(var(--v-theme-outline-variant)) 30%, transparent) !important;
  z-index: 1000;
}

.search-field {
  :deep(.v-field) {
    font-size: 0.875rem;
  }

  :deep(.v-field__input) {
    text-wrap: pretty;
  }
}

.section-header {
  min-height: 32px;
}

@supports not (color: color-mix(in srgb, black 50%, transparent)) {
  .channel-drawer {
    border-right: 1px solid rgba(var(--v-theme-outline-variant), 0.3) !important;
  }
}
</style>
