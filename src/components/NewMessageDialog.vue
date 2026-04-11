<script setup lang="ts">
import { supabase } from '@/lib/supabase'
import type { Profile } from '@/rstore/collections'
import { vAutoAnimate } from '@formkit/auto-animate/vue'
import { defineAsyncComponent, ref, useTemplateRef, watch } from 'vue'

const NewMessageProfileResultItem = defineAsyncComponent(() => import('@/components/NewMessageProfileResultItem.vue'))
const NewMessageSearchEmptyState = defineAsyncComponent(() => import('@/components/NewMessageSearchEmptyState.vue'))

const dialog = ref(false)
const searchInput = useTemplateRef<{ focus: () => void }>('searchInput')
const query = ref('')
const results = ref<Profile[]>([])
const loading = ref(false)

let searchTimeout: ReturnType<typeof setTimeout> | null = null

watch(query, (val) => {
  if (searchTimeout) clearTimeout(searchTimeout)
  if (!val.trim()) {
    results.value = []
    return
  }
  loading.value = true
  searchTimeout = setTimeout(async () => {
    const { data } = await supabase
      .from('profiles')
      .select(
        `id,
        username,bio,avatar_url,
        profile_color,updated_at,
        created_at,overlay_url
      `,
      )
      .ilike('username', `%${val.trim()}%`)
      .limit(10)
    results.value = (data ?? []) as Profile[]
    loading.value = false
  }, 300)
})

watch(dialog, (val) => {
  if (!val) {
    query.value = ''
    results.value = []
  }
})

</script>

<template>
  <v-dialog
    v-model="dialog"
    max-width="440"
    @after-enter="searchInput?.focus()"
  >
    <template #activator="{ props: activatorProps }">
      <slot name="activator" :props="activatorProps" />
    </template>

    <v-card rounded="xl" class="dialog-card">
      <div class="dialog-header">
        <v-icon
          icon="mdi-message-plus-outline"
          size="16"
          color="on-surface-variant"
        />
        <span class="text-caption font-weight-medium text-on-surface-variant"
          >Новое сообщение</span
        >
        <v-spacer />
        <v-btn
          icon="mdi-close"
          variant="text"
          size="x-small"
          color="on-surface-variant"
          rounded="lg"
          @click="dialog = false"
        />
      </div>

      <v-divider />

      <div class="search-area">
        <div class="search-wrapper">
          <v-text-field
            v-model="query"
            placeholder="Найти пользователя..."
            prepend-inner-icon="mdi-magnify"
            variant="solo"
            ref="searchInput"
            flat
            rounded="0"
            hide-details
            :loading="loading"
            class="search-field"
          />

          <v-expand-transition>
            <div v-if="query.trim()" class="results-float">
              <v-divider />
              <v-list
                v-auto-animate
                density="comfortable"
                class="results-list pa-2"
              >
                <NewMessageProfileResultItem
                  v-for="profile in results"
                  :key="profile.id"
                  :profile="profile"
                />

                <NewMessageSearchEmptyState
                  v-if="!loading && results.length === 0"
                />
              </v-list>
            </div>
          </v-expand-transition>
        </div>
      </div>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.dialog-card {
  overflow: visible;
}

.dialog-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px 10px 16px;
}

.search-area {
  position: relative;
}

.search-field :deep(.v-field__input) {
  padding-block: 14px;
  font-size: 0.9375rem;
}

.search-wrapper {
  position: relative;
}

.results-float {
  position: absolute;
  inset-inline: 0;
  top: 100%;
  z-index: 10;
  background: rgb(var(--v-theme-surface));
  border-radius: 0 0 16px 16px;
  overflow: hidden;
  box-shadow: 0 8px 24px
    color-mix(in srgb, rgb(var(--v-theme-shadow)) 12%, transparent);
}

.results-list {
  max-block-size: 300px;
  overflow-y: auto;
}

@supports not (color: color-mix(in srgb, black 50%, transparent)) {
  .results-float {
    box-shadow: 0 8px 24px rgba(var(--v-theme-shadow), 0.12);
  }
}
</style>
