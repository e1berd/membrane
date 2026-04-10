import { createApp } from 'vue'
import App from './App.vue'
import { supabase } from './lib/supabase'
import { openIamWindow, openErrorWindow } from './lib/windows'
import { getCurrentWindow } from '@tauri-apps/api/window'
import { listen } from '@tauri-apps/api/event'
import { router } from './router'
import { vuetify } from '@/plugins/vuetify'
import { setupRstore } from '@/rstore'

let currentWindow: ReturnType<typeof getCurrentWindow>

async function healthCheck(): Promise<boolean> {
  try {
    const { error } = await supabase.rpc('health_check')
    return !error
  } catch {
    return false
  }
}

async function initializeApp() {
  currentWindow = getCurrentWindow()

  const app = createApp(App)
  app.use(router).use(vuetify)
  await setupRstore(app)
  app.mount('#app')

  if (currentWindow.label === 'main') {
    const healthy = await healthCheck()

    if (!healthy) {
      await openErrorWindow()
      await listen('health-ok', () => initIam())
      return
    }
    await initIam()
  }
}

async function initIam() {
  const { data } = await supabase.auth.getSession()

  if (data.session) {
    await currentWindow.show()
  } else {
    await openIamWindow()
  }

  await listen('auth-success', async () => {
    await router.push('/')
    await currentWindow.show()
    await currentWindow.setFocus()
  })
}

initializeApp().catch(console.error)
