import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import vuetify from 'vite-plugin-vuetify'
import { ACCENT_BOOT_BACKGROUNDS, THEME_LOCAL_STORAGE_KEYS } from './src/lib/theme'

const host = process.env.TAURI_DEV_HOST

function themeBootSnippet(): string {
  const keys = JSON.stringify(THEME_LOCAL_STORAGE_KEYS)
  const backgrounds = JSON.stringify(ACCENT_BOOT_BACKGROUNDS)
  return `<script>(function(){var K=${keys},B=${backgrounds};try{var p=localStorage.getItem(K.preference);if(p!=="light"&&p!=="dark"&&p!=="system")p="dark";var a=localStorage.getItem(K.accent);if(!Object.prototype.hasOwnProperty.call(B,a))a="purple";var d=p==="system"?window.matchMedia("(prefers-color-scheme: dark)").matches:p==="dark";var c=B[a][d?"dark":"light"];var r=document.documentElement;r.style.backgroundColor=c;r.style.colorScheme=d?"dark":"light"}catch(e){}})()</script>`
}

export default defineConfig(async () => ({
  plugins: [
    vue(),
    vuetify({ autoImport: true }),
    {
      name: 'membrane-theme-boot',
      transformIndexHtml(html) {
        return html.replace('<!--theme-boot-->', themeBootSnippet())
      },
    },
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  clearScreen: false,
  server: {
    port: 1420,
    strictPort: true,
    host: host || false,
    hmr: host
      ? {
          protocol: 'ws',
          host,
          port: 1421,
        }
      : undefined,
    watch: {
      ignored: ['**/src-tauri/**'],
    },
  },
}))
