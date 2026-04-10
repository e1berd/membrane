<script setup lang="ts">
import { ref } from 'vue'
import { useTheme } from 'vuetify'

const theme = useTheme()
const isDark = ref(theme.global.name.value === 'dark')

function toggleTheme() {
  theme.global.name.value = isDark.value ? 'dark' : 'light'
}
</script>

<template>
  <v-dialog max-width="480">
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

    <template #default="{ isActive }">
      <v-card>
        <v-card-title class="d-flex align-center justify-space-between pa-5 pb-4">
          <span class="text-h6">Настройки</span>
          <v-btn
            icon="mdi-close"
            variant="text"
            size="small"
            color="on-surface-variant"
            @click="isActive.value = false"
          />
        </v-card-title>

        <v-divider />

        <v-card-text class="pa-0">
          <div class="settings-section">
            <div class="settings-section-header px-5 pt-4 pb-2">
              <span class="text-overline text-medium-emphasis">Внешний вид</span>
            </div>

            <v-list class="px-2 pb-3">
              <v-list-item rounded="lg">
                <template #prepend>
                  <v-icon icon="mdi-weather-night" class="mr-3" color="on-surface-variant" />
                </template>
                <v-list-item-title>Тёмная тема</v-list-item-title>
                <template #append>
                  <v-switch
                    v-model="isDark"
                    hide-details
                    inset
                    density="compact"
                    @update:model-value="toggleTheme"
                  />
                </template>
              </v-list-item>
            </v-list>
          </div>
        </v-card-text>
      </v-card>
    </template>
  </v-dialog>
</template>

<style scoped>
.settings-section-header {
  letter-spacing: 0.08em;
}
</style>
