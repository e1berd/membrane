<script setup lang="ts">
import { ref } from 'vue'
import AppSidebar from '@/components/AppSidebar.vue'

const showMenu = ref(false)

const menuItems = [
  { icon: 'mdi-cog', title: 'Настройки', action: 'settings' },
]

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
        />
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>
