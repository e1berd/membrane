<script setup lang="ts">
import { ref, computed } from 'vue'
import { supabase } from '@/lib/supabase'

interface ProfileForm {
  username: string
  avatar_url: string
  overlay_url: string
  profile_color: string
  bio: string
}

const profile = ref<ProfileForm>({
  username: '',
  avatar_url: '',
  overlay_url: '',
  profile_color: '#5c6bc0',
  bio: '',
})

const loading = ref(false)
const saving = ref(false)
const error = ref<string | null>(null)
const success = ref(false)

const profileColors = [
  '#5c6bc0', '#1976d2', '#0288d1', '#00897b',
  '#388e3c', '#7b1fa2', '#e91e63', '#f57c00',
  '#d32f2f', '#546e7a', '#795548', '#607d8b',
]

const avatarInitial = computed(() =>
  profile.value.username ? profile.value.username.charAt(0).toUpperCase() : '?'
)

async function loadProfile() {
  loading.value = true
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    if (data) {
      profile.value = {
        username: data.username ?? '',
        avatar_url: data.avatar_url ?? '',
        overlay_url: (data as any).overlay_url ?? '',
        profile_color: (data as any).profile_color ?? '#5c6bc0',
        bio: data.bio ?? '',
      }
    }
  } finally {
    loading.value = false
  }
}

async function saveProfile() {
  saving.value = true
  error.value = null
  success.value = false
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { error: err } = await supabase.from('profiles').update({
      username: profile.value.username,
      avatar_url: profile.value.avatar_url || null,
      overlay_url: profile.value.overlay_url || null,
      profile_color: profile.value.profile_color || null,
      bio: profile.value.bio || null,
      updated_at: new Date().toISOString(),
    }).eq('id', user.id)
    if (err) {
      error.value = err.message
    } else {
      success.value = true
      setTimeout(() => { success.value = false }, 2000)
    }
  } finally {
    saving.value = false
  }
}

loadProfile()
</script>

<template>
  <div>
  <div v-if="loading" class="d-flex justify-center align-center pa-8">
    <v-progress-circular indeterminate color="primary" size="28" />
  </div>

  <template v-else>
    <div class="profile-preview mx-4 mt-3 mb-3 rounded-xl overflow-hidden">
      <div
        class="profile-preview-banner"
        :style="profile.overlay_url
          ? { backgroundImage: `url(${profile.overlay_url})`, backgroundSize: 'cover', backgroundPosition: 'center' }
          : { backgroundColor: profile.profile_color }"
      />
      <div class="profile-preview-body px-3 py-2 d-flex align-center" style="gap: 8px">
        <v-avatar size="40" class="preview-avatar" :style="{ backgroundColor: profile.profile_color }">
          <v-img v-if="profile.avatar_url" :src="profile.avatar_url" />
          <span v-else class="text-body-1 font-weight-medium text-white">{{ avatarInitial }}</span>
        </v-avatar>
        <div>
          <div class="text-body-2 font-weight-bold">{{ profile.username || 'имя_пользователя' }}</div>
          <div v-if="profile.bio" class="text-caption text-on-surface-variant">{{ profile.bio }}</div>
        </div>
      </div>
    </div>

    <div class="px-4">
      <v-text-field
        v-model="profile.username"
        label="Имя пользователя"
        density="compact"
        variant="outlined"
        class="mb-2"
      />

      <v-text-field
        v-model="profile.bio"
        label="О себе"
        density="compact"
        variant="outlined"
        placeholder="Расскажите о себе..."
        class="mb-3"
      />

      <div class="text-caption text-on-surface-variant mb-2">Цвет профиля</div>
      <div class="color-swatches mb-3">
        <button
          v-for="color in profileColors"
          :key="color"
          type="button"
          class="color-swatch"
          :class="{ active: profile.profile_color === color }"
          :style="{ backgroundColor: color }"
          @click="profile.profile_color = color"
        />
      </div>

      <v-text-field
        v-model="profile.avatar_url"
        label="Ссылка на аватарку"
        density="compact"
        variant="outlined"
        placeholder="https://..."
        class="mb-2"
      />

      <v-text-field
        v-model="profile.overlay_url"
        label="Фон профиля (overlay)"
        density="compact"
        variant="outlined"
        placeholder="https://..."
      />
    </div>

    <div class="page-footer px-4 py-3">
      <v-alert
        v-if="error"
        type="error"
        density="compact"
        variant="tonal"
        class="mb-2"
        :text="error"
      />
      <v-btn
        color="primary"
        variant="tonal"
        block
        :loading="saving"
        :prepend-icon="success ? 'mdi-check' : undefined"
        @click="saveProfile"
      >
        {{ success ? 'Сохранено' : 'Сохранить' }}
      </v-btn>
    </div>
  </template>
  </div>
</template>

<style scoped>
.profile-preview {
  border: 1px solid color-mix(in srgb, rgb(var(--v-theme-outline-variant)) 40%, transparent);

  .profile-preview-banner {
    block-size: 48px;
  }

  .preview-avatar {
    border: 3px solid rgb(var(--v-theme-surface));
    margin-block-start: -20px;
    flex-shrink: 0;
  }
}

.color-swatches {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;

  .color-swatch {
    inline-size: 24px;
    block-size: 24px;
    border-radius: 50%;
    border: 2px solid transparent;
    cursor: pointer;
    transition: transform 0.12s ease, border-color 0.12s ease;
    padding: 0;

    &:hover {
      transform: scale(1.15);
    }

    &.active {
      border-color: rgb(var(--v-theme-on-surface));
      transform: scale(1.1);
    }
  }
}

.page-footer {
  position: sticky;
  bottom: 0;
  background: rgb(var(--v-theme-surface));
  border-top: 1px solid color-mix(in srgb, rgb(var(--v-theme-outline-variant)) 30%, transparent);
}

@supports not (color: color-mix(in srgb, black 50%, transparent)) {
  .profile-preview {
    border: 1px solid rgba(var(--v-theme-outline-variant), 0.4);
  }

  .page-footer {
    border-top: 1px solid rgba(var(--v-theme-outline-variant), 0.3);
  }
}
</style>
