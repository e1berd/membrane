<script setup lang="ts">
import AppSidebar from '@/components/AppSidebar.vue'
import ChannelList from '@/components/ChannelList.vue'
import { ref } from 'vue'

const currentChannel = ref('general')

function onChannelSelect(channel: string) {
  currentChannel.value = channel
}
</script>

<template>
  <v-app>
    <AppSidebar />

    <ChannelList
      :selected="currentChannel"
      @select="onChannelSelect"
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
  /*margin-left: 328px !important;*/
  height: 100vh;
}
</style>
