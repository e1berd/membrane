<script setup lang="ts">
import { ref } from 'vue'
import { supabase } from '@/lib/supabase'
import { emit } from '@tauri-apps/api/event'
import { getCurrentWindow } from '@tauri-apps/api/window'

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function handleSignIn() {
  loading.value = true
  error.value = ''

  const { error: authError } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  })

  if (authError) {
    error.value = authError.message
    loading.value = false
    return
  }

  await emit('auth-success')
  await getCurrentWindow().close()
}
</script>

<template>
  <div class="signin-container">
    <h1>Membrane</h1>

    <input
      v-model="email"
      type="email"
      placeholder="Email"
      @keyup.enter="handleSignIn"
    />

    <input
      v-model="password"
      type="password"
      placeholder="Пароль"
      @keyup.enter="handleSignIn"
    />

    <p v-if="error" class="error">{{ error }}</p>

    <button :disabled="loading" @click="handleSignIn">
      {{ loading ? 'Вход...' : 'Войти' }}
    </button>
  </div>
</template>

<style scoped>
.signin-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  gap: 12px;
  padding: 24px;
}

input {
  width: 100%;
  max-width: 300px;
  padding: 10px 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 14px;
}

button {
  width: 100%;
  max-width: 300px;
  padding: 10px;
  border: none;
  border-radius: 6px;
  background: #7c3aed;
  color: white;
  font-size: 14px;
  cursor: pointer;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error {
  color: #ef4444;
  font-size: 13px;
  margin: 0;
}
</style>
