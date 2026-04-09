import { createRoute } from "@kitbag/router"
import { defineAsyncComponent } from "vue"

export const mainRoute = createRoute({
  name: "main",
  path: "/",
  component: defineAsyncComponent(() => import("../views/MainView.vue")),
})

export const signInRoute = createRoute({
  name: "iam",
  path: "/iam",
  component: defineAsyncComponent(() => import("../views/IamView.vue")),
})

export const errorRoute = createRoute({
  name: 'error',
  path: '/error',
  component: defineAsyncComponent(() => import('@/views/ErrorView.vue')),
})

export const routes = <const>[mainRoute, signInRoute, errorRoute]
