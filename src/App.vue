<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import AppSidebar from '@/components/AppSidebar.vue'
import { supabase } from '@/lib/supabase'
import type { Subscription } from '@supabase/supabase-js'

const hasSession = ref(false)
let authListener: Subscription

onMounted(async () => {
  const { data } = await supabase.auth.getSession()
  hasSession.value = !!data.session

  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
    hasSession.value = !!session
  })
  authListener = subscription
})

onUnmounted(() => {
  authListener?.unsubscribe()
})
</script>

<template>
  <v-app>
    <AppSidebar v-if="hasSession" />

    <v-main class="main-content">
      <router-view />
    </v-main>
  </v-app>
</template>

<style>
:root {
  color-scheme: light dark;
}

::selection {
  background-color: color-mix(in srgb, rgb(var(--v-theme-selection-bg)) 100%, transparent);
  color: rgb(var(--v-theme-selection-text));
}

::-moz-selection {
  background-color: color-mix(in srgb, rgb(var(--v-theme-selection-bg)) 100%, transparent);
  color: rgb(var(--v-theme-selection-text));
}

@supports not (color: color-mix(in srgb, black 50%, transparent)) {
  ::selection {
    background-color: rgba(var(--v-theme-selection-bg), 0.40);
  }
  ::-moz-selection {
    background-color: rgba(var(--v-theme-selection-bg), 0.40);
  }
}

/* Single GPU compositing layer for overlays — prevents WebKitGTK flicker on fast cursor movement */
.v-overlay {
  will-change: transform;
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
