<script setup lang="ts">
import { ref } from 'vue'
import { supabase } from '@/lib/supabase'
import { emit } from '@tauri-apps/api/event'
import { getCurrentWindow } from '@tauri-apps/api/window'

const loading = ref(false)
const errorMessage = ref('Не удалось подключиться к серверу')

async function retry() {
  loading.value = true
  errorMessage.value = ''

  try {
    const { error } = await supabase.from('profiles').select('id').limit(1)
    if (error) throw error

    await emit('health-ok')
    await getCurrentWindow().close()
  } catch (e: any) {
    errorMessage.value = e?.message || 'Сервер по-прежнему недоступен'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <v-app>
    <v-main class="d-flex align-center justify-center">
      <v-card width="360" class="pa-6 text-center">
        <v-icon size="64" color="error" class="mb-4">
          mdi-server-off
        </v-icon>

        <v-card-title class="text-h6 mb-2">
          Ошибка подключения
        </v-card-title>

        <v-card-text class="mb-4">
          {{ errorMessage }}
        </v-card-text>

        <v-btn
          color="primary"
          block
          size="large"
          :loading="loading"
          @click="retry"
        >
          Повторить
        </v-btn>
      </v-card>
    </v-main>
  </v-app>
</template>
