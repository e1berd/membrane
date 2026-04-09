import { WebviewWindow } from "@tauri-apps/api/webviewWindow"
import { getCurrentWindow } from "@tauri-apps/api/window"

export async function openIamWindow() {
  const iam = new WebviewWindow("iam", {
    url: "/iam",
    title: "Membrane — Вход",
    width: 420,
    height: 520,
    resizable: false,
    center: true,
  })

  iam.once("tauri://error", (e) => {
    console.error("Ошибка создания окна логина:", e)
  })
}

export async function openMainWindow() {
  const main = getCurrentWindow()
  await main.show()
  await main.setFocus()
}

export async function openErrorWindow() {
  const error = new WebviewWindow('error', {
    url: '/error',
    title: 'Membrane — Ошибка',
    width: 400,
    height: 350,
    resizable: false,
    center: true,
  })

  error.once('tauri://error', (e) => {
    console.error('Ошибка создания окна:', e)
  })
}
