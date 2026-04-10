<script setup lang="ts">
import { defineAsyncComponent, ref, computed, onMounted } from 'vue'
import { useCurrentProfile } from '@/composables/useCurrentProfile'
import { useRouter } from '@kitbag/router'

const SettingsDialog = defineAsyncComponent(() => import('@/components/SettingsDialog.vue'))
const UserProfileDialog = defineAsyncComponent(() => import('@/components/UserProfileDialog.vue'))

const router = useRouter()
const activeDestination = ref('home')
const workspaces = [
  { name: 'Membrane', icon: 'mdi-alpha-m-box' },
]

const { profile, load } = useCurrentProfile()

onMounted(() => load())

const avatarInitial = computed(() =>
  profile.value?.username ? profile.value.username.charAt(0).toUpperCase() : '?'
)

const userForDialog = computed(() => ({
  userId: profile.value?.id,
  name: profile.value?.username ?? '',
  avatar: avatarInitial.value,
  color: profile.value?.profile_color ?? 'primary',
  avatar_url: profile.value?.avatar_url ?? null,
  overlay_url: profile.value?.overlay_url ?? null,
  bio: profile.value?.bio ?? null,
  email: '',
}))
</script>

<template>
  <v-navigation-drawer
    rail
    permanent
    color="surface-container"
    class="workspace-rail"
    :width="68"
  >
    <div class="rail-content">
      <div class="rail-group">
        <v-tooltip text="Главная" location="end">
          <template #activator="{ props }">
            <v-btn
              v-bind="props"
              icon="mdi-home"
              class="rail-btn"
              :color="activeDestination === 'home' ? 'primary' : 'on-surface-variant'"
              :variant="activeDestination === 'home' ? 'tonal' : 'text'"
              rounded="lg"
              @click="activeDestination = 'home', router.push('/')"
            />
          </template>
        </v-tooltip>
      </div>

      <v-divider class="rail-divider" />

      <div class="rail-group">
        <v-tooltip
          v-for="(ws, i) in workspaces"
          :key="i"
          :text="ws.name"
          location="end"
        >
          <template #activator="{ props }">
            <v-btn
              v-bind="props"
              :icon="ws.icon"
              class="rail-btn"
              :color="activeDestination === `ws-${i}` ? 'primary' : 'on-surface-variant'"
              :variant="activeDestination === `ws-${i}` ? 'tonal' : 'text'"
              rounded="lg"
              @click="activeDestination = `ws-${i}`"
            />
          </template>
        </v-tooltip>
      </div>

      <v-divider class="rail-divider" />

      <div class="rail-group">
        <v-tooltip text="Добавить пространство" location="end">
        <template #activator="{ props }">
          <v-btn
            v-bind="props"
            icon="mdi-plus"
            class="rail-btn"
            color="on-surface-variant"
            variant="text"
            rounded="lg"
          />
        </template>
      </v-tooltip>
      </div>
    </div>

    <template #append>
      <div class="rail-append">
        <SettingsDialog>
          <template #activator="{ props }">
            <v-tooltip text="Настройки" location="end">
              <template #activator="{ props: tooltipProps }">
                <v-btn
                  v-bind="{ ...tooltipProps, ...props }"
                  icon="mdi-cog-outline"
                  variant="text"
                  size="small"
                  color="on-surface-variant"
                />
              </template>
            </v-tooltip>
          </template>
        </SettingsDialog>

        <UserProfileDialog :user="userForDialog">
          <template #activator="{ props: profileProps }">
            <v-avatar
              v-bind="profileProps"
              size="36"
              :color="profile?.profile_color ?? 'primary'"
              class="cursor-pointer"
            >
              <v-img v-if="profile?.avatar_url" :src="profile.avatar_url" />
              <span v-else class="text-body-2 font-weight-medium">{{ avatarInitial }}</span>
            </v-avatar>
          </template>
        </UserProfileDialog>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<style scoped>
.workspace-rail {
  border-right: 1px solid color-mix(in srgb, rgb(var(--v-theme-outline-variant)) 30%, transparent) !important;
  z-index: 1001;

  .rail-content,
  .rail-group,
  .rail-append {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }

  .rail-content {
    padding: 12px 0;
  }

  .rail-divider {
    inline-size: 40px;
  }

  .rail-btn {
    inline-size: 44px;
    block-size: 44px;
    min-inline-size: 44px;
  }

  .rail-append {
    padding-bottom: 12px;
  }

  .cursor-pointer {
    cursor: pointer;
  }
}

@supports not (color: color-mix(in srgb, black 50%, transparent)) {
  .workspace-rail {
    border-right: 1px solid rgba(var(--v-theme-outline-variant), 0.3) !important;
  }
}
</style>
