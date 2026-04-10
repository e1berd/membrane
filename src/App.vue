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
</style>
