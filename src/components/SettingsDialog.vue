<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTheme } from 'vuetify'

const theme = useTheme()
const isDark = ref(theme.global.name.value === 'dark')

function toggleTheme() {
  theme.global.name.value = isDark.value ? 'dark' : 'light'
}

const categories = [
  { id: 'appearance', label: 'Внешний вид', icon: 'mdi-palette-outline' },
]

const activeIndex = ref(0)
const prevIndex = ref(0)
const activeId = computed(() => categories[activeIndex.value].id)

const transitionName = computed(() =>
  activeIndex.value > prevIndex.value ? 'slide-up' : 'slide-down'
)

function selectCategory(index: number) {
  if (index === activeIndex.value) return
  prevIndex.value = activeIndex.value
  activeIndex.value = index
}
</script>

<template>
  <v-dialog max-width="600">
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
      <v-card class="settings-card" height="420">
        <div class="settings-layout">
          <div class="settings-sidebar">
            <div class="settings-sidebar-header px-4 pt-4 pb-3">
              <span class="text-subtitle-2 font-weight-bold">Настройки</span>
            </div>
            <v-list density="compact" nav class="px-2">
              <v-list-item
                v-for="(cat, i) in categories"
                :key="cat.id"
                :prepend-icon="cat.icon"
                :title="cat.label"
                :active="activeIndex === i"
                color="primary"
                rounded="lg"
                @click="selectCategory(i)"
              />
            </v-list>
          </div>

          <v-divider vertical />

          <div class="settings-content">
            <div class="settings-content-header d-flex align-center justify-space-between px-5 pt-4 pb-3">
              <span class="text-subtitle-1 font-weight-medium">{{ categories[activeIndex].label }}</span>
              <v-btn
                icon="mdi-close"
                variant="text"
                size="small"
                color="on-surface-variant"
                @click="isActive.value = false"
              />
            </div>

            <v-divider />

            <div class="settings-content-body">
              <transition :name="transitionName" mode="out-in">
                <div :key="activeId">
                  <template v-if="activeId === 'appearance'">
                    <v-list class="px-2 pt-2">
                      <v-list-item
                        rounded="lg"
                        prepend-icon="mdi-weather-night"
                        @click="isDark = !isDark; toggleTheme()"
                      >
                        <v-list-item-title>Тёмная тема</v-list-item-title>
                        <template #append>
                          <v-switch
                            v-model="isDark"
                            hide-details
                            inset
                            density="compact"
                            tabindex="-1"
                            @click.stop
                            @update:model-value="toggleTheme"
                          />
                        </template>
                      </v-list-item>
                    </v-list>
                  </template>
                </div>
              </transition>
            </div>
          </div>
        </div>
      </v-card>
    </template>
  </v-dialog>
</template>

<style scoped>
.settings-card {
  overflow: hidden;
}

.settings-layout {
  display: flex;
  height: 100%;
}

.settings-sidebar {
  width: 180px;
  flex-shrink: 0;
  background: rgba(var(--v-theme-surface-variant), 0.2);
}

.settings-sidebar-header {
  opacity: 0.6;
}

.settings-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.settings-content-body {
  flex: 1;
  overflow: hidden;
  position: relative;
}

.settings-content-body > div {
  position: absolute;
  inset: 0;
  overflow-y: auto;
}

.slide-up-enter-active,
.slide-up-leave-active,
.slide-down-enter-active,
.slide-down-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(12px);
}
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}

.slide-down-enter-from {
  opacity: 0;
  transform: translateY(-12px);
}
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(12px);
}

:deep(.v-list-item) {
  --v-list-prepend-gap: 8px;
}
</style>
