<script setup lang="ts">
import { ref, computed, defineAsyncComponent } from 'vue'
import { OverlayScrollbarsComponent } from 'overlayscrollbars-vue'
import 'overlayscrollbars/overlayscrollbars.css'

const ProfilePage = defineAsyncComponent(() => import('@/components/settings/SettingsProfilePage.vue'))
const AppearancePage = defineAsyncComponent(() => import('@/components/settings/SettingsAppearancePage.vue'))

const props = defineProps<{
  defaultTab?: string
}>()

const categories = [
  { id: 'appearance', label: 'Внешний вид', icon: 'mdi-palette-outline', component: AppearancePage },
  { id: 'profile', label: 'Профиль', icon: 'mdi-account-outline', component: ProfilePage },
]

const activeIndex = ref(
  props.defaultTab ? Math.max(0, categories.findIndex(c => c.id === props.defaultTab)) : 0
)
const prevIndex = ref(0)
const currentComponent = computed(() => categories[activeIndex.value].component)

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
      <slot :props="props" name="activator" />
    </template>

    <template #default="{ isActive }">
      <v-card class="settings-card" height="540">
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

            <OverlayScrollbarsComponent
              class="settings-body"
              :options="{ scrollbars: { autoHide: 'scroll', theme: 'os-theme-membrane' } }"
              defer
            >
              <transition :name="transitionName" mode="out-in">
                <component :is="currentComponent" />
              </transition>
            </OverlayScrollbarsComponent>
          </div>
        </div>
      </v-card>
    </template>
  </v-dialog>
</template>

<style scoped>
.settings-card {
  overflow: hidden;

  .settings-layout {
    display: flex;
    block-size: 100%;
  }

  .settings-sidebar {
    inline-size: 180px;
    flex-shrink: 0;
    background: color-mix(in srgb, rgb(var(--v-theme-surface-variant)) 20%, transparent);
  }

  .settings-sidebar-header {
    opacity: 0.6;
  }

  .settings-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-inline-size: 0;
  }

  .settings-body {
    flex: 1;
    overflow: hidden;
  }

  :deep(.v-list-item) {
    --v-list-prepend-gap: 8px;
  }
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

@supports not (color: color-mix(in srgb, black 50%, transparent)) {
  .settings-card {
    .settings-sidebar {
      background: rgba(var(--v-theme-surface-variant), 0.2);
    }
  }
}

@media (prefers-reduced-motion: reduce) {
  .slide-up-enter-active,
  .slide-up-leave-active,
  .slide-down-enter-active,
  .slide-down-leave-active {
    transition-duration: 0.01ms;
  }
}
</style>
