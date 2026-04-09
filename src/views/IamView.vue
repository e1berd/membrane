<script setup lang="ts">
import { ref } from 'vue'
import { z } from 'zod'
import { supabase } from '@/lib/supabase'
import { emit } from '@tauri-apps/api/event'
import { getCurrentWindow } from '@tauri-apps/api/window'

const tab = ref('signin')

const signInSchema = z.object({
  email: z.email({ message: 'Некорректный email' }),
  password: z.string().min(6, { message: 'Минимум 6 символов' }),
})

const signUpSchema = z.object({
  email: z.email({ message: 'Некорректный email' }),
  password: z.string().min(6, { message: 'Минимум 6 символов' }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Пароли не совпадают',
  path: ['confirmPassword'],
})

const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const errors = ref<Record<string, string>>({})
const serverError = ref('')
const serverSuccess = ref('')
const loading = ref(false)
const showPassword = ref(false)

function resetState() {
  errors.value = {}
  serverError.value = ''
  serverSuccess.value = ''
  loading.value = false
}

function validate(schema: z.ZodType, data: Record<string, string>) {
  const result = schema.safeParse(data)

  if (!result.success) {
    errors.value = {}
    for (const issue of result.error.issues) {
      const field = issue.path[0] as string
      if (!errors.value[field]) {
        errors.value[field] = issue.message
      }
    }
    return false
  }

  errors.value = {}
  return true
}

async function handleSignIn() {
  resetState()

  if (!validate(signInSchema, {
    email: email.value,
    password: password.value,
  })) return

  loading.value = true

  const { error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  })

  if (error) {
    serverError.value = error.message
    loading.value = false
    return
  }

  await emit('auth-success')
  await getCurrentWindow().close()
}

async function handleSignUp() {
  resetState()

  if (!validate(signUpSchema, {
    email: email.value,
    password: password.value,
    confirmPassword: confirmPassword.value,
  })) return

  loading.value = true

  const { error } = await supabase.auth.signUp({
    email: email.value,
    password: password.value,
  })

  if (error) {
    serverError.value = error.message
    loading.value = false
    return
  }

  serverSuccess.value = 'Аккаунт создан. Проверьте почту для подтверждения.'
  loading.value = false

  await emit('auth-success')
  await getCurrentWindow().close()
}

function onTabChange() {
  errors.value = {}
  serverError.value = ''
  serverSuccess.value = ''
}
</script>

<template>
  <v-app>
    <v-main class="d-flex align-center justify-center">
      <v-card width="400" class="pa-6">
        <v-card-title class="text-h5 text-center mb-2">
          Membrane
        </v-card-title>

        <v-tabs v-model="tab" grow class="mb-4" @update:model-value="onTabChange">
          <v-tab value="signin">Вход</v-tab>
          <v-tab value="signup">Регистрация</v-tab>
        </v-tabs>

        <v-tabs-window v-model="tab">
          <v-tabs-window-item value="signin">
            <v-form @submit.prevent="handleSignIn">
              <v-text-field
                v-model="email"
                label="Email"
                type="email"
                prepend-inner-icon="mdi-email-outline"
                :error-messages="errors.email"
                class="mb-2"
              />

              <v-text-field
                v-model="password"
                label="Пароль"
                :type="showPassword ? 'text' : 'password'"
                prepend-inner-icon="mdi-lock-outline"
                :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                :error-messages="errors.password"
                class="mb-2"
                @click:append-inner="showPassword = !showPassword"
              />

              <v-alert
                v-if="serverError"
                type="error"
                variant="tonal"
                density="compact"
                class="mb-4"
              >
                {{ serverError }}
              </v-alert>

              <v-btn
                type="submit"
                color="primary"
                block
                size="large"
                :loading="loading"
              >
                Войти
              </v-btn>
            </v-form>
          </v-tabs-window-item>

          <v-tabs-window-item value="signup">
            <v-form @submit.prevent="handleSignUp">
              <v-text-field
                v-model="email"
                label="Email"
                type="email"
                prepend-inner-icon="mdi-email-outline"
                :error-messages="errors.email"
                class="mb-2"
              />

              <v-text-field
                v-model="password"
                label="Пароль"
                :type="showPassword ? 'text' : 'password'"
                prepend-inner-icon="mdi-lock-outline"
                :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                :error-messages="errors.password"
                class="mb-2"
                @click:append-inner="showPassword = !showPassword"
              />

              <v-text-field
                v-model="confirmPassword"
                label="Подтвердите пароль"
                :type="showPassword ? 'text' : 'password'"
                prepend-inner-icon="mdi-lock-check-outline"
                :error-messages="errors.confirmPassword"
                class="mb-2"
              />

              <v-alert
                v-if="serverError"
                type="error"
                variant="tonal"
                density="compact"
                class="mb-4"
              >
                {{ serverError }}
              </v-alert>

              <v-alert
                v-if="serverSuccess"
                type="success"
                variant="tonal"
                density="compact"
                class="mb-4"
              >
                {{ serverSuccess }}
              </v-alert>

              <v-btn
                type="submit"
                color="primary"
                block
                size="large"
                :loading="loading"
              >
                Зарегистрироваться
              </v-btn>
            </v-form>
          </v-tabs-window-item>
        </v-tabs-window>
      </v-card>
    </v-main>
  </v-app>
</template>
