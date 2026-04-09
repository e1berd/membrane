// src/router/routes.ts
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

export const routes = [mainRoute, signInRoute] as const
