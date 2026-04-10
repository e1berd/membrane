<script setup lang="ts">
import { ref } from 'vue'
import { supabase } from '@/lib/supabase'
import { openIamWindow } from '@/lib/windows'
import { getCurrentWindow } from '@tauri-apps/api/window'
import { useCurrentProfile } from '@/composables/useCurrentProfile'

export interface UserProfileInfo {
  name: string
  avatar: string
  color: string
  status?: 'online' | 'idle' | 'dnd' | 'offline'
  customStatus?: string
  role?: string
  email?: string
}

const props = defineProps<{
  user: UserProfileInfo
  isCurrentUser?: boolean
}>()

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
  <v-dialog v-model="dialog" max-width="340">
    <template #activator="{ props: activatorProps }">
      <slot name="activator" :props="activatorProps" />
    </template>

    <v-card rounded="xl" class="profile-card">
      <div class="profile-banner" />

      <div class="profile-avatar-wrapper">
        <v-avatar size="72" :color="props.user.color">
          <span class="text-h5 font-weight-medium">{{ props.user.avatar }}</span>
        </v-avatar>
      </div>

      <v-card-text class="text-center pt-2 pb-4">
        <div class="text-h6 font-weight-bold mb-1">{{ props.user.name }}</div>

        <div v-if="props.user.email" class="text-body-2 text-on-surface-variant mb-2">
          {{ props.user.email }}
        </div>

        <div v-if="props.user.status" class="d-flex align-center justify-center gap-1 mb-2">
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
          class="mb-2"
        >
          {{ props.user.role }}
        </v-chip>

        <div v-if="props.user.customStatus" class="text-body-2 text-on-surface-variant">
          {{ props.user.customStatus }}
        </div>
      </v-card-text>

      <v-divider />

      <v-card-actions class="pa-3">
        <template v-if="isCurrentUser">
          <v-btn
            block
            variant="tonal"
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
    block-size: 60px;
    background: linear-gradient(
      135deg,
      rgb(var(--v-theme-primary)),
      color-mix(in srgb, rgb(var(--v-theme-primary)) 60%, rgb(var(--v-theme-secondary)))
    );
  }

  .profile-avatar-wrapper {
    display: flex;
    justify-content: center;
    margin-block-start: -36px;

    .v-avatar {
      border: 4px solid rgb(var(--v-theme-surface));
    }
  }

  .gap-1 {
    gap: 4px;
  }
}

@supports not (color: color-mix(in srgb, black 50%, transparent)) {
  .profile-card {
    .profile-banner {
      background: linear-gradient(135deg, rgb(var(--v-theme-primary)), rgb(var(--v-theme-secondary)));
    }
  }
}
</style>
