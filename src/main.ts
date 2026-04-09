import { createApp } from "vue"
import App from "./App.vue"
import { supabase } from "./lib/supabase"
import { openIamWindow } from "./lib/windows"
import { getCurrentWindow } from "@tauri-apps/api/window"
import { listen } from "@tauri-apps/api/event"
import { router } from "./router"
import { vuetify } from '@/plugins/vuetify'
import { setupRstore } from '@/rstore'

let currentWindow: ReturnType<typeof getCurrentWindow>

async function initializeApp() {
  currentWindow = getCurrentWindow()
  
  const app = createApp(App)
  app.use(router).use(vuetify)
  await setupRstore(app)
  app.mount("#app")

  if (currentWindow.label === "main") {
    await initAuth()
  }
}

async function initAuth() {
  const { data } = await supabase.auth.getSession()

  if (data.session) {
    await currentWindow.show()
  } else {
    await openIamWindow()
  }

  await listen("auth-success", async () => {
    await currentWindow.show()
    await currentWindow.setFocus()
  })
}

initializeApp().catch(console.error)
