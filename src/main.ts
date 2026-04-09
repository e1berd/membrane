import { createApp } from "vue"
import App from "./App.vue"
import { supabase } from "./lib/supabase"
import { openSignInWindow } from "./lib/windows"
import { getCurrentWindow } from "@tauri-apps/api/window"
import { listen } from "@tauri-apps/api/event"
import { router } from "./router"

const app = createApp(App)
app.use(router)
app.mount("#app")

const currentWindow = getCurrentWindow()
if (currentWindow.label === "main") {
  initAuth()
}

async function initAuth() {
  const { data } = await supabase.auth.getSession()

  if (data.session) {
    await currentWindow.show()
  } else {
    await openSignInWindow()
  }

  await listen("auth-success", async () => {
    await currentWindow.show()
    await currentWindow.setFocus()
  })
}
