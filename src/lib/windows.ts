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

export async function openChatWindow(chatId: string, title: string) {
  const chat = new WebviewWindow(`chat-${chatId}`, {
    url: `/chat/${chatId}`,
    title,
    width: 600,
    height: 700,
    minWidth: 400,
    minHeight: 500,
  })
}
