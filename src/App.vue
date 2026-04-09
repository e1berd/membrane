<script setup lang="ts">
import { ref } from 'vue'
import AppSidebar from '@/components/AppSidebar.vue'

const sidebarRef = ref<InstanceType<typeof AppSidebar> | null>(null)
const showMenu = ref(false)

const menuItems = [
  { icon: 'mdi-cog', title: 'Настройки', action: 'settings' },
]

function handleMenuItem(action: string) {
  if (action === 'settings' && sidebarRef.value) {
    sidebarRef.value.showSettingsDialog.value = true
  }
  showMenu.value = false
}
</script>

<template>
  <v-app>
    <AppSidebar ref="sidebarRef" />

    <v-navigation-drawer
      v-model="showMenu"
      location="right"
      temporary
      width="300"
    >
      <v-list density="compact" nav>
        <v-list-subheader>Меню</v-list-subheader>

        <v-list-item
          v-for="item in menuItems"
          :key="item.icon"
          :prepend-icon="item.icon"
          :title="item.title"
          @click="handleMenuItem(item.action)"
        />
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>
