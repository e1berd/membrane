<script setup lang="ts">
import { ref } from 'vue'
import { useTheme } from 'vuetify'
import { getThemePreference, setThemePreference, type ThemePreference } from '@/lib/theme'

const theme = useTheme()
const themePreference = ref<ThemePreference>(getThemePreference())

function updateThemePreference(value: ThemePreference | null): void {
  if (value == null) return
  themePreference.value = value
  setThemePreference(theme, value)
}
</script>

<template>
  <v-list class="px-2 pt-2">
    <v-list-item rounded="lg" prepend-icon="mdi-theme-light-dark">
      <v-list-item-title>Тема приложения</v-list-item-title>
      <v-list-item-subtitle>Выберите режим оформления</v-list-item-subtitle>
    </v-list-item>
    <div class="px-4 pt-2">
      <v-btn-toggle
        :model-value="themePreference"
        color="primary"
        density="comfortable"
        mandatory
        @update:model-value="updateThemePreference"
      >
        <v-btn value="system">Системная</v-btn>
        <v-btn value="light">Светлая</v-btn>
        <v-btn value="dark">Тёмная</v-btn>
      </v-btn-toggle>
    </div>
  </v-list>
</template>

<style scoped>
:deep(.v-btn-group) {
  inline-size: 100%;

  .v-btn {
    flex: 1;
  }
}
</style>
