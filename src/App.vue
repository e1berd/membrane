<script setup lang="ts">
import AppSidebar from '@/components/AppSidebar.vue'
import ChannelList from '@/components/ChannelList.vue'
import { ref } from 'vue'

const currentChannel = ref('general')

function selectChannel(channel: string) {
  currentChannel.value = channel
}
</script>

<template>
  <v-app>
    <AppSidebar />

    <ChannelList
      :selected="currentChannel"
      @select="selectChannel"
    />

    <v-main class="main-content">
      <router-view :channel="currentChannel" />
    </v-main>
  </v-app>
</template>

<style>
html, body {
  overflow: hidden;
  height: 100%;
}

.main-content {
  height: 100dvh;
}

.os-theme-membrane.os-scrollbar {
  --os-size: 6px;
  --os-padding-perpendicular: 0px;
  --os-padding-axis: 0px;
  --os-track-border-radius: 0;
  --os-track-bg: transparent;
  --os-track-bg-hover: transparent;
  --os-track-bg-active: transparent;
  --os-handle-border-radius: 3px;
  --os-handle-bg: rgba(var(--v-theme-on-surface), 0.2);
  --os-handle-bg-hover: rgba(var(--v-theme-on-surface), 0.35);
  --os-handle-bg-active: rgba(var(--v-theme-on-surface), 0.5);
  --os-handle-min-size: 40px;
}
</style>
