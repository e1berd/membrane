<script setup lang="ts">
import ChatList from '@/components/ChatList.vue'
import { useCurrentProfile } from '@/composables/useCurrentProfile'
import { supabase } from '@/lib/supabase'
import { useInfiniteQuery, useQueryClient } from '@tanstack/vue-query'
import type { RealtimeChannel } from '@supabase/supabase-js'
import { computed, onMounted, onUnmounted, ref } from 'vue'

const props = defineProps<{
  workspaceId?: string
}>()

const emit = defineEmits<{
  select: [channel: string]
}>()

const PAGE_SIZE = 20

const search = ref('')
const { profile } = useCurrentProfile()

const profileId = computed(() => profile.value?.id)

const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
  queryKey: ['chats', profileId],
  queryFn: async ({ pageParam }) => {
    const from = pageParam * PAGE_SIZE
    const to = from + PAGE_SIZE - 1
    const { data, error } = await supabase
      .from('chats')
      .select('*, chat_members!inner(user_id)')
      .eq('type', 'direct')
      .eq('chat_members.user_id', profileId.value!)
      .range(from, to)
    if (error) throw error
    return data
  },
  initialPageParam: 0,
  getNextPageParam: (lastPage, allPages) =>
    lastPage.length === PAGE_SIZE ? allPages.length : undefined,
  enabled: () => !!profileId.value,
})

const chats = computed(() => data.value?.pages.flat() ?? [])

const queryClient = useQueryClient()

let channel: RealtimeChannel | null = null

onMounted(() => {
  channel = supabase
    .channel('chats-inserts')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'chats' },
      async (payload) => {
        const { data } = await supabase
          .from('chat_members')
          .select('user_id')
          .eq('chat_id', payload.new.id)
          .eq('user_id', profile.value?.id ?? '')
          .maybeSingle()

        if (data) {
          queryClient.invalidateQueries({ queryKey: ['chats'] })
        }
      },
    )
    .subscribe()
})

onUnmounted(() => {
  if (channel) supabase.removeChannel(channel)
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
      v-if="error"
      type="error"
      variant="tonal"
      class="ma-2"
    >
      {{ (error as Error).message }}
    </v-alert>

    <div
      v-if="!isLoading && !error && !chats.length"
      class="d-flex align-center justify-center flex-grow-1"
      style="height: calc(100% - 124px)"
    >
      <span class="text-body-2 text-medium-emphasis">Нет диалогов</span>
    </div>

    <ChatList
      v-else
      :chats="chats"
      :has-next-page="hasNextPage"
      :is-fetching-next-page="isFetchingNextPage"
      @load-more="fetchNextPage"
    />

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
