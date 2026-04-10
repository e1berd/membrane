const THEME_PREFERENCE_KEY = 'membrane.theme.preference'

export type ThemePreference = 'system' | 'light' | 'dark'

type ThemeController = {
  global: {
    name: {
      value: string
    }
  }
}

function isThemePreference(value: string | null): value is ThemePreference {
  return value === 'system' || value === 'light' || value === 'dark'
}

function getSystemTheme(): 'light' | 'dark' {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function applyTheme(theme: ThemeController, preference: ThemePreference): void {
  theme.global.name.value = preference === 'system' ? getSystemTheme() : preference
}

export function getThemePreference(): ThemePreference {
  const storedValue = window.localStorage.getItem(THEME_PREFERENCE_KEY)
  return isThemePreference(storedValue) ? storedValue : 'dark'
}

export function setThemePreference(theme: ThemeController, preference: ThemePreference): void {
  window.localStorage.setItem(THEME_PREFERENCE_KEY, preference)
  applyTheme(theme, preference)
}

export function initializeTheme(theme: ThemeController): void {
  applyTheme(theme, getThemePreference())

  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  const handleSystemThemeChange = () => {
    if (getThemePreference() === 'system') {
      applyTheme(theme, 'system')
    }
  }

  if (typeof mediaQuery.addEventListener === 'function') {
    mediaQuery.addEventListener('change', handleSystemThemeChange)
    return
  }

  mediaQuery.addListener(handleSystemThemeChange)
}
