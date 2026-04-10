<script setup lang="ts">
import { ref } from 'vue'

const activeWorkspace = ref(0)

const workspaces = [
  { name: 'Membrane', icon: 'mdi-alpha-m-box', color: 'primary' },
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
    <div class="d-flex flex-column align-center pt-3 gap-2">
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
            :color="activeWorkspace === i ? 'primary' : 'surface-variant'"
            :variant="activeWorkspace === i ? 'tonal' : 'text'"
            rounded="lg"
            @click="activeWorkspace = i"
          />
        </template>
      </v-tooltip>

      <v-divider class="my-1" style="width: 36px" />

      <v-tooltip text="Добавить пространство" location="end">
        <template #activator="{ props }">
          <v-btn
            v-bind="props"
            icon="mdi-plus"
            variant="outlined"
            size="small"
            rounded="lg"
            color="on-surface-variant"
          />
        </template>
      </v-tooltip>
    </div>

    <template #append>
      <div class="d-flex flex-column align-center pb-3 gap-2">
        <v-tooltip text="Настройки" location="end">
          <template #activator="{ props }">
            <v-btn
              v-bind="props"
              icon="mdi-cog-outline"
              variant="text"
              size="small"
              color="on-surface-variant"
            />
          </template>
        </v-tooltip>

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

.gap-2 {
  gap: 8px;
}
</style>
