<script setup lang="ts">
import { ref, computed, useTemplateRef } from 'vue'
import { supabase } from '@/lib/supabase'
import { useCurrentProfile } from '@/composables/useCurrentProfile'

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
const uploadingAvatar = ref(false)
const uploadingOverlay = ref(false)
const uploadError = ref<string | null>(null)

const avatarInput = useTemplateRef<HTMLInputElement>('avatarInput')
const overlayInput = useTemplateRef<HTMLInputElement>('overlayInput')

const { patch } = useCurrentProfile()

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
    const { data } = await supabase
      .from('profiles')
      .select('username,avatar_url,overlay_url,profile_color,bio')
      .eq('id', user.id)
      .single()
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

async function uploadMedia(file: File, slot: 'avatar' | 'overlay'): Promise<string> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Не авторизован')

  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
  const path = `${user.id}/${slot}.${ext}`

  const { error: err } = await supabase.storage
    .from('profile-media')
    .upload(path, file, { upsert: true, contentType: file.type })

  if (err) throw err

  const { data: { publicUrl } } = supabase.storage
    .from('profile-media')
    .getPublicUrl(path)

  return `${publicUrl}?t=${Date.now()}`
}

async function persistField(field: 'avatar_url' | 'overlay_url', value: string) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return
  await supabase.from('profiles').update({ [field]: value, updated_at: new Date().toISOString() }).eq('id', user.id)
  patch({ [field]: value })
}

async function onAvatarChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  uploadingAvatar.value = true
  uploadError.value = null
  try {
    const url = await uploadMedia(file, 'avatar')
    profile.value.avatar_url = url
    await persistField('avatar_url', url)
  } catch (err: any) {
    uploadError.value = err.message
  } finally {
    uploadingAvatar.value = false
    if (avatarInput.value) avatarInput.value.value = ''
  }
}

async function onOverlayChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  uploadingOverlay.value = true
  uploadError.value = null
  try {
    const url = await uploadMedia(file, 'overlay')
    profile.value.overlay_url = url
    await persistField('overlay_url', url)
  } catch (err: any) {
    uploadError.value = err.message
  } finally {
    uploadingOverlay.value = false
    if (overlayInput.value) overlayInput.value.value = ''
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
      patch({
        username: profile.value.username,
        profile_color: profile.value.profile_color || null,
        bio: profile.value.bio || null,
      })
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
  <div class="page-root">
  <div v-if="loading" class="d-flex justify-center align-center pa-8">
    <v-progress-circular indeterminate color="primary" size="28" />
  </div>

  <form v-else @submit.prevent="saveProfile">
      <input
        ref="avatarInput"
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        style="display: none"
        @change="onAvatarChange"
      />
      <input
        ref="overlayInput"
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        style="display: none"
        @change="onOverlayChange"
      />

      <div class="profile-preview mx-4 mt-3 mb-3 rounded-xl overflow-hidden">
        <div
          class="profile-preview-banner"
          :class="{ uploading: uploadingOverlay }"
          :style="profile.overlay_url
            ? { backgroundImage: `url(${profile.overlay_url})`, backgroundSize: 'cover', backgroundPosition: 'center' }
            : { backgroundColor: profile.profile_color }"
          @click="overlayInput?.click()"
        >
          <div class="banner-overlay">
            <v-progress-circular v-if="uploadingOverlay" indeterminate color="white" size="20" width="2" />
            <v-icon v-else color="white" size="20">mdi-image-edit-outline</v-icon>
          </div>
        </div>

        <div class="profile-preview-body px-3 py-2 d-flex align-center" style="gap: 8px">
          <div
            class="avatar-wrapper"
            :class="{ uploading: uploadingAvatar }"
            @click="avatarInput?.click()"
          >
            <v-avatar size="64" class="preview-avatar" :style="{ backgroundColor: profile.profile_color }">
              <v-img v-if="profile.avatar_url" :src="profile.avatar_url" />
              <span v-else class="avatar-initial">{{ avatarInitial }}</span>
            </v-avatar>
            <div class="avatar-overlay">
              <v-progress-circular v-if="uploadingAvatar" indeterminate color="white" size="14" width="2" />
              <v-icon v-else color="white" size="14">mdi-camera</v-icon>
            </div>
          </div>

          <div>
            <div class="text-body-2 font-weight-bold">{{ profile.username || 'имя_пользователя' }}</div>
            <div v-if="profile.bio" class="text-caption text-on-surface-variant">{{ profile.bio }}</div>
          </div>
        </div>
      </div>

      <div class="px-4">
        <v-alert
          v-if="uploadError"
          type="error"
          density="compact"
          variant="tonal"
          class="mb-3"
          :text="uploadError"
          closable
          @click:close="uploadError = null"
        />

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
          type="submit"
        >
          {{ success ? 'Сохранено' : 'Сохранить' }}
        </v-btn>
      </div>
  </form>
  </div>
</template>

<style scoped>
.page-root {
  display: contents;
}

.profile-preview {
  border: 1px solid color-mix(in srgb, rgb(var(--v-theme-outline-variant)) 40%, transparent);

  .profile-preview-banner {
    block-size: 64px;
    cursor: pointer;
    position: relative;

    .banner-overlay {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0, 0, 0, 0.35);
      opacity: 0;
      transition: opacity 0.15s ease;
    }

    &:hover .banner-overlay,
    &.uploading .banner-overlay {
      opacity: 1;
    }
  }
}

.avatar-wrapper {
  position: relative;
  margin-block-start: -36px;
  flex-shrink: 0;
  cursor: pointer;
  border-radius: 50%;

  .preview-avatar {
    border: 3px solid rgb(var(--v-theme-surface));
    display: block;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .avatar-initial {
    font-size: 1.5rem;
    font-weight: 500;
    color: white;
    line-height: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .avatar-overlay {
    position: absolute;
    inset: 3px;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.15s ease;
  }

  &:hover .avatar-overlay,
  &.uploading .avatar-overlay {
    opacity: 1;
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

@media (prefers-reduced-motion: reduce) {
  .profile-preview-banner .banner-overlay,
  .avatar-wrapper .avatar-overlay,
  .color-swatch {
    transition-duration: 0.01ms;
  }
}
</style>
