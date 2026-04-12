<script setup lang="ts">
import { ref } from 'vue'
import { supabase } from '@/lib/supabase'
import { getCurrentWindow } from '@tauri-apps/api/window'
import { openIamWindow } from '@/lib/windows'

const loading = ref(false)

async function signOut() {
  loading.value = true
  try {
    await supabase.auth.signOut()
    await openIamWindow()
    await getCurrentWindow().hide()
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="pa-4">
    <v-btn
      color="error"
      variant="tonal"
      block
      prepend-icon="mdi-logout"
      :loading="loading"
      @click="signOut"
    >
      Выйти
    </v-btn>
  </div>
</template>
