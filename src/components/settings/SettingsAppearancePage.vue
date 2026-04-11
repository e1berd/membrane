<script setup lang="ts">
import { ref } from 'vue'
import { useTheme } from 'vuetify'
import {
  getThemePreference,
  setThemePreference,
  getAccentPreference,
  setAccentPreference,
  ACCENT_DISPLAY,
  type ThemePreference,
  type AccentColor,
} from '@/lib/theme'

const theme = useTheme()
const themePreference = ref<ThemePreference>(getThemePreference())
const accentColor = ref<AccentColor>(getAccentPreference())

function updateThemePreference(value: ThemePreference | null): void {
  if (value == null) return
  themePreference.value = value
  setThemePreference(theme, value)
}

function updateAccentColor(accent: AccentColor): void {
  accentColor.value = accent
  setAccentPreference(theme, accent)
}

const accentKeys = Object.keys(ACCENT_DISPLAY) as AccentColor[]
</script>

<template>
  <v-list class="px-2 pt-2">
    <v-list-item rounded="lg" prepend-icon="mdi-theme-light-dark">
      <v-list-item-title>Тема приложения</v-list-item-title>
      <v-list-item-subtitle>Выберите режим оформления</v-list-item-subtitle>
    </v-list-item>
    <div class="px-4 pt-2 pb-4">
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

    <v-divider class="mx-4" />

    <v-list-item rounded="lg" prepend-icon="mdi-palette-outline" class="mt-2">
      <v-list-item-title>Акцентный цвет</v-list-item-title>
      <v-list-item-subtitle>Основной цвет интерфейса</v-list-item-subtitle>
    </v-list-item>
    <div class="px-4 pt-2 pb-2 d-flex flex-wrap" style="gap: 12px">
      <button
        v-for="key in accentKeys"
        :key="key"
        type="button"
        class="accent-swatch"
        :class="{ active: accentColor === key }"
        :style="{
          background: `linear-gradient(135deg, ${ACCENT_DISPLAY[key].lightColor} 50%, ${ACCENT_DISPLAY[key].darkColor} 50%)`,
        }"
        :aria-label="ACCENT_DISPLAY[key].label"
        @click="updateAccentColor(key)"
      />
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

.accent-swatch {
  inline-size: 32px;
  block-size: 32px;
  border-radius: 50%;
  border: 2.5px solid transparent;
  cursor: pointer;
  padding: 0;
  transition: transform 0.12s ease, border-color 0.12s ease;
  outline: none;

  &:hover {
    transform: scale(1.15);
  }

  &.active {
    border-color: rgb(var(--v-theme-on-surface));
    transform: scale(1.1);
  }
}

@media (prefers-reduced-motion: reduce) {
  .accent-swatch {
    transition-duration: 0.01ms;
  }
}
</style>
