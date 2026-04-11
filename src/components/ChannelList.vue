<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  workspaceId?: string
}>()

const emit = defineEmits<{
  select: [channel: string]
}>()

const search = ref('')

</script>

<template>
  <v-navigation-drawer
    permanent
    :width="260"
    color="surface-container"
    class="channel-drawer"
  >
    <div class="pa-3 pb-1">
      <div class="d-flex align-center justify-space-between mb-3">
        <span class="text-title-medium font-weight-bold">Membrane</span>
        <v-btn
          icon="mdi-square-edit-outline"
          variant="text"
          size="small"
          color="on-surface-variant"
        />
      </div>

      <v-text-field
        v-model="search"
        placeholder="Поиск"
        prepend-inner-icon="mdi-magnify"
        variant="solo-filled"
        density="compact"
        rounded="lg"
        flat
        hide-details
        single-line
        class="search-field"
        bg-color="surface-container-high"
      />
    </div>

  </v-navigation-drawer>
</template>

<style scoped>
.channel-drawer {
  border-right: 1px solid color-mix(in srgb, rgb(var(--v-theme-outline-variant)) 30%, transparent) !important;
  z-index: 1000;
}

.search-field {
  :deep(.v-field) {
    font-size: 0.875rem;
  }

  :deep(.v-field__input) {
    text-wrap: pretty;
  }
}

.section-header {
  min-height: 32px;
}

@supports not (color: color-mix(in srgb, black 50%, transparent)) {
  .channel-drawer {
    border-right: 1px solid rgba(var(--v-theme-outline-variant), 0.3) !important;
  }
}
</style>
