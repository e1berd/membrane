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
:root {
  color-scheme: light dark;
}

html,
body {
  block-size: 100%;
  overflow: clip;
}

body {
  margin: 0;
  text-rendering: optimizeLegibility;
}

.main-content {
  block-size: 100dvh;
  min-block-size: 100svh;
}

.os-theme-membrane {
  &.os-scrollbar {
    --os-size: 6px;
    --os-padding-perpendicular: 0;
    --os-padding-axis: 0;
    --os-track-border-radius: 0;
    --os-track-bg: transparent;
    --os-track-bg-hover: transparent;
    --os-track-bg-active: transparent;
    --os-handle-border-radius: 999px;
    --os-handle-bg: color-mix(in srgb, rgb(var(--v-theme-on-surface)) 20%, transparent);
    --os-handle-bg-hover: color-mix(in srgb, rgb(var(--v-theme-on-surface)) 35%, transparent);
    --os-handle-bg-active: color-mix(in srgb, rgb(var(--v-theme-on-surface)) 50%, transparent);
    --os-handle-min-size: 40px;
  }
}

@supports not (color: color-mix(in srgb, black 50%, transparent)) {
  .os-theme-membrane {
    &.os-scrollbar {
      --os-handle-bg: rgba(var(--v-theme-on-surface), 0.2);
      --os-handle-bg-hover: rgba(var(--v-theme-on-surface), 0.35);
      --os-handle-bg-active: rgba(var(--v-theme-on-surface), 0.5);
    }
  }
}
</style>
