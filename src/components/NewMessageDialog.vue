<script setup lang="ts">
import { supabase } from '@/lib/supabase'
import type { Profile } from '@/rstore/collections'
import { vAutoAnimate } from '@formkit/auto-animate/vue'
import { useRouter } from '@kitbag/router'
import { ref, watch } from 'vue'

const router = useRouter()
const dialog = ref(false)
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
      .select('*')
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

function selectUser(profile: Profile) {
  dialog.value = false
  router.push(`/${profile.id}`)
}

function getInitial(username: string) {
  return username.charAt(0).toUpperCase()
}

</script>

<template>
  <v-dialog v-model="dialog" max-width="440">
    <template #activator="{ props: activatorProps }">
      <slot name="activator" :props="activatorProps" />
    </template>

    <v-card rounded="xl" class="dialog-card">
      <div class="dialog-header">
        <v-icon icon="mdi-message-plus-outline" size="16" color="on-surface-variant" />
        <span class="text-caption font-weight-medium text-on-surface-variant">Новое сообщение</span>
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
            flat
            rounded="0"
            autofocus
            hide-details
            :loading="loading"
            class="search-field"
          />


          <v-expand-y-transition>
            <div v-if="query.trim()" class="results-float">
                <v-divider />
                <v-list v-auto-animate density="comfortable" class="results-list pa-2">
                <v-list-item
                    v-for="profile in results"
                    :key="profile.id"
                    rounded="lg"
                    class="result-item"
                    min-height="56"
                    @click="selectUser(profile)"
                >
                    <template #prepend>
                    <v-avatar size="40" :color="profile.profile_color ?? 'primary'" class="mr-1">
                        <v-img v-if="profile.avatar_url" :src="profile.avatar_url" />
                        <span v-else class="text-body-1 font-weight-medium">{{ getInitial(profile.username) }}</span>
                    </v-avatar>
                    </template>

                    <v-list-item-title class="text-body-2 font-weight-medium">
                    {{ profile.username }}
                    </v-list-item-title>
                    <v-list-item-subtitle v-if="profile.bio" class="text-caption mt-0">
                    {{ profile.bio }}
                    </v-list-item-subtitle>

                    <template #append>
                    <v-icon icon="mdi-arrow-right" size="16" color="on-surface-variant" class="result-arrow" />
                    </template>
                </v-list-item>

                <div v-if="!loading && results.length === 0" class="empty-state">
                    <v-icon icon="mdi-account-search-outline" size="32" color="on-surface-variant" class="mb-2" />
                    <span class="text-caption text-on-surface-variant">Пользователи не найдены</span>
                </div>
                </v-list>
            </div>
          </v-expand-y-transition>
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
  box-shadow: 0 8px 24px color-mix(in srgb, rgb(var(--v-theme-shadow)) 12%, transparent);
}

.results-list {
  max-block-size: 300px;
  overflow-y: auto;
}

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

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 16px;
}

@supports not (color: color-mix(in srgb, black 50%, transparent)) {
  .results-float {
    box-shadow: 0 8px 24px rgba(var(--v-theme-shadow), 0.12);
  }
}
</style>
