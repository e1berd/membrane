<script setup lang="ts">
import { ref, computed, defineAsyncComponent } from 'vue'
import { supabase } from '@/lib/supabase'
import { openIamWindow } from '@/lib/windows'
import { getCurrentWindow } from '@tauri-apps/api/window'
import { useCurrentProfile } from '@/composables/useCurrentProfile'

const SettingsDialog = defineAsyncComponent(() => import('@/components/SettingsDialog.vue'))

export interface UserProfileInfo {
  userId?: string
  name: string
  avatar: string
  color: string
  avatar_url?: string | null
  overlay_url?: string | null
  bio?: string | null
  status?: 'online' | 'idle' | 'dnd' | 'offline'
  customStatus?: string
  role?: string
  email?: string
}

const props = defineProps<{
  user: UserProfileInfo
}>()

const { profile: currentProfile } = useCurrentProfile()
const isCurrentUser = computed(() =>
  !!props.user.userId && props.user.userId === currentProfile.value?.id
)

const dialog = ref(false)
const loggingOut = ref(false)

async function handleLogout() {
  loggingOut.value = true
  try {
    await supabase.auth.signOut()
    const { reset } = useCurrentProfile()
    reset()
    const mainWindow = getCurrentWindow()
    await mainWindow.hide()
    await openIamWindow()
  } finally {
    loggingOut.value = false
    dialog.value = false
  }
}

const statusLabel: Record<string, string> = {
  online: 'В сети',
  idle: 'Неактивен',
  dnd: 'Не беспокоить',
  offline: 'Не в сети',
}

const statusColor: Record<string, string> = {
  online: '#43a047',
  idle: '#fb8c00',
  dnd: '#e53935',
  offline: '#757575',
}
</script>

<template>
  <v-dialog v-model="dialog" max-width="400">
    <template #activator="{ props: activatorProps }">
      <slot name="activator" :props="activatorProps" />
    </template>

    <v-card rounded="xl" class="profile-card">
      <div
        class="profile-banner"
        :style="props.user.overlay_url
          ? { backgroundImage: `url(${props.user.overlay_url})`, backgroundSize: 'cover', backgroundPosition: 'center' }
          : undefined"
      />

      <div class="profile-avatar-wrapper">
        <v-avatar size="84" :color="props.user.color">
          <v-img v-if="props.user.avatar_url" :src="props.user.avatar_url" />
          <span v-else class="text-h5 font-weight-medium">{{ props.user.avatar }}</span>
        </v-avatar>
      </div>

      <v-card-text class="px-4 pt-2 pb-4">
        <div class="text-h6 font-weight-bold">{{ props.user.name }}</div>

        <div v-if="props.user.email" class="text-body-2 text-on-surface-variant mt-1">
          {{ props.user.email }}
        </div>

        <div class="d-flex align-center flex-wrap gap-2 mt-2">
          <div v-if="props.user.status" class="d-flex align-center gap-1">
            <v-icon
              icon="mdi-circle"
              :color="statusColor[props.user.status]"
              size="10"
            />
            <span class="text-body-2 text-on-surface-variant">{{ statusLabel[props.user.status] }}</span>
          </div>
          <v-chip
            v-if="props.user.role"
            size="small"
            variant="tonal"
            color="primary"
          >
            {{ props.user.role }}
          </v-chip>
        </div>

        <div v-if="props.user.customStatus" class="d-flex align-center gap-1 mt-2">
          <v-icon icon="mdi-emoticon-outline" size="14" color="on-surface-variant" />
          <span class="text-body-2 text-on-surface-variant">{{ props.user.customStatus }}</span>
        </div>
      </v-card-text>

      <template v-if="props.user.bio">
        <v-divider />
        <div class="px-4 py-3">
          <div class="section-label text-on-surface-variant mb-2">О себе</div>
          <div class="bio-container pa-3 text-body-2">{{ props.user.bio }}</div>
        </div>
      </template>

      <v-divider />

      <v-card-actions class="pa-3 d-flex flex-column gap-2">
        <template v-if="isCurrentUser">
          <SettingsDialog default-tab="profile" class="w-100">
            <template #activator="{ props: settingsProps }">
              <v-btn
                v-bind="settingsProps"
                block
                variant="tonal"
                color="primary"
                prepend-icon="mdi-account-edit-outline"
              >
                Настроить профиль
              </v-btn>
            </template>
          </SettingsDialog>
          <v-btn
            block
            variant="text"
            color="error"
            prepend-icon="mdi-logout"
            :loading="loggingOut"
            @click="handleLogout"
          >
            Выйти
          </v-btn>
        </template>
        <template v-else>
          <v-btn
            block
            variant="tonal"
            color="primary"
            prepend-icon="mdi-message-outline"
          >
            Написать
          </v-btn>
        </template>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.profile-card {
  overflow: hidden;

  .profile-banner {
    block-size: 96px;
    background: linear-gradient(
      135deg,
      rgb(var(--v-theme-primary)),
      color-mix(in srgb, rgb(var(--v-theme-primary)) 60%, rgb(var(--v-theme-secondary)))
    );
  }

  .profile-avatar-wrapper {
    display: flex;
    justify-content: flex-start;
    padding-inline-start: 16px;
    margin-block-start: -42px;

    .v-avatar {
      border: 4px solid rgb(var(--v-theme-surface));
    }
  }

  .section-label {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .bio-container {
    background: rgb(var(--v-theme-surface-container));
    border-radius: 12px;
    line-height: 1.6;
  }

  .gap-1 { gap: 4px; }
  .gap-2 { gap: 8px; }
  .w-100 { inline-size: 100%; }
}

@supports not (color: color-mix(in srgb, black 50%, transparent)) {
  .profile-card {
    .profile-banner {
      background: linear-gradient(135deg, rgb(var(--v-theme-primary)), rgb(var(--v-theme-secondary)));
    }
  }
}
</style>
