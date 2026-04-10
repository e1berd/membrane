<script setup lang="ts">
import { defineAsyncComponent, ref } from 'vue'

const SettingsDialog = defineAsyncComponent(() => import('@/components/SettingsDialog.vue'))

const activeDestination = ref('home')

const workspaces = [
  { name: 'Membrane', icon: 'mdi-alpha-m-box' },
]
</script>

<template>
  <v-navigation-drawer
    rail
    permanent
    color="surface"
    class="workspace-rail"
    :width="68"
  >
    <div class="rail-content">
      <div class="rail-group">
        <v-tooltip text="Home" location="end">
          <template #activator="{ props }">
            <v-btn
              v-bind="props"
              icon="mdi-home"
              class="rail-btn"
              :color="activeDestination === 'home' ? 'primary' : 'on-surface-variant'"
              :variant="activeDestination === 'home' ? 'tonal' : 'text'"
              rounded="lg"
              @click="activeDestination = 'home'"
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
      <div class="d-flex flex-column align-center pb-3 gap-2">
        <SettingsDialog />

        <v-avatar size="36" color="primary">
          <span class="text-body-2 font-weight-medium">U</span>
        </v-avatar>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<style scoped>
.workspace-rail {
  border-right: 1px solid rgba(var(--v-theme-outline-variant), 0.3) !important;
  z-index: 1001;
}

.rail-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 0;
  gap: 8px;
}

.rail-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.rail-divider {
  width: 40px;
}

.rail-btn {
  width: 44px;
  height: 44px;
  min-width: 44px;
}
</style>
