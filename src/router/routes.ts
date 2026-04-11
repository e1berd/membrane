import { createRoute } from '@kitbag/router'
import { defineAsyncComponent } from 'vue'

export const settingsRoute = createRoute({
  name: 'settings',
  path: '/settings',
  component: defineAsyncComponent(() => import('@/views/SettingsView.vue')),
})

export const homeRoute = createRoute({
  name: 'home',
  path: '/[?chatId]',
  component: defineAsyncComponent(() => import('@/views/HomeView.vue')),
})

export const workspaceRoute = createRoute({
  name: 'workspace',
  path: '/workspace/[workspaceId]/[?chatId]',
  component: defineAsyncComponent(() => import('@/views/ChatsView.vue')),
})

export const signInRoute = createRoute({
  name: 'iam',
  path: '/iam',
  component: defineAsyncComponent(() => import('@/views/IamView.vue')),
})

export const errorRoute = createRoute({
  name: 'error',
  path: '/error',
  component: defineAsyncComponent(() => import('@/views/ErrorView.vue')),
})

export const routes = <const>[signInRoute, errorRoute, settingsRoute, homeRoute, workspaceRoute]
