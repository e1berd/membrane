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
  <v-dialog v-model="dialog" max-width="460">
    <template #activator="{ props: activatorProps }">
      <slot name="activator" :props="activatorProps" />
    </template>

    <v-card rounded="xl" class="dialog-card">
      <v-card-title class="px-4 pt-4 pb-2 text-body-1 font-weight-bold">
        Новое сообщение
      </v-card-title>

      <v-card-text class="px-4 pt-0 pb-3">
        <div class="search-wrapper">
          <v-text-field
            v-model="query"
            placeholder="Найти пользователя..."
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            density="compact"
            rounded="lg"
            autofocus
            hide-details
            :loading="loading"
          />

          <div v-if="query.trim()" class="results-float">
            <v-card rounded="lg" elevation="4" class="results-card">
              <v-list v-auto-animate density="compact" class="py-1">
                <v-list-item
                  v-for="profile in results"
                  :key="profile.id"
                  rounded="lg"
                  class="mx-1 my-1"
                  @click="selectUser(profile)"
                >
                  <template #prepend>
                    <v-avatar size="36" :color="profile.profile_color ?? 'primary'">
                      <v-img v-if="profile.avatar_url" :src="profile.avatar_url" />
                      <span v-else class="text-body-2 font-weight-medium">{{ getInitial(profile.username) }}</span>
                    </v-avatar>
                  </template>

                  <v-list-item-title class="text-body-2 font-weight-medium">
                    {{ profile.username }}
                  </v-list-item-title>
                  <v-list-item-subtitle v-if="profile.bio" class="text-caption">
                    {{ profile.bio }}
                  </v-list-item-subtitle>
                </v-list-item>

                <v-list-item v-if="!loading && results.length === 0" disabled>
                  <v-list-item-title class="text-caption text-on-surface-variant text-center">
                    Пользователи не найдены
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-card>
          </div>
        </div>
      </v-card-text>

      <v-card-actions class="px-4 pb-3 pt-0">
        <v-spacer />
        <v-btn variant="text" @click="dialog = false">Отмена</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.dialog-card {
  overflow: visible;
}

.search-wrapper {
  position: relative;
}

.results-float {
  position: absolute;
  inset-inline: 0;
  top: calc(100% + 6px);
  z-index: 10;
}

.results-card {
  max-block-size: 320px;
  overflow-y: auto;
}
</style>
