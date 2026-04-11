const THEME_PREFERENCE_KEY = 'membrane.theme.preference'
const ACCENT_PREFERENCE_KEY = 'membrane.theme.accent'

export type ThemePreference = 'system' | 'light' | 'dark'
export type AccentColor = 'purple' | 'blue' | 'green' | 'rose' | 'orange'

type ThemeController = {
  change: (theme: string) => void
  name: Readonly<{ value: string }>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  themes: Readonly<{ value: Record<string, { colors: Record<string, any> }> }>
}

type AccentPalette = {
  light: Record<string, string>
  dark: Record<string, string>
}

export const ACCENT_DISPLAY: Record<AccentColor, { label: string; lightColor: string; darkColor: string }> = {
  purple: { label: 'Фиолетовый', lightColor: '#65558F', darkColor: '#D0BCFF' },
  blue:   { label: 'Синий',      lightColor: '#1565C0', darkColor: '#ADC6FF' },
  green:  { label: 'Зелёный',   lightColor: '#006E1C', darkColor: '#7BDB7C' },
  rose:   { label: 'Розовый',   lightColor: '#9E163B', darkColor: '#FFB1C2' },
  orange: { label: 'Оранжевый', lightColor: '#9A4200', darkColor: '#FFB590' },
}

const ACCENT_PALETTES: Record<AccentColor, AccentPalette> = {
  purple: {
    light: {
      primary: '#65558F',
      'primary-container': '#EADDFF',
      'on-primary': '#FFFFFF',
      'on-primary-container': '#21005D',
      secondary: '#625B71',
      'secondary-container': '#E8DEF8',
      'on-secondary': '#FFFFFF',
      'on-secondary-container': '#1D192B',
      tertiary: '#7D5260',
      'tertiary-container': '#FFD8E4',
      'on-tertiary': '#FFFFFF',
      'on-tertiary-container': '#31111D',
      'inverse-primary': '#D0BCFF',
      'selection-bg': '#EADDFF',
      'selection-text': '#21005D',
      background: '#FEF7FF',
      surface: '#FEF7FF',
      'on-background': '#1D1B20',
      'on-surface': '#1D1B20',
      'surface-variant': '#E7E0EC',
      'on-surface-variant': '#49454F',
      'surface-container-lowest': '#FFFFFF',
      'surface-container-low': '#F7F2FA',
      'surface-container': '#F3EDF7',
      'surface-container-high': '#ECE6F0',
      'surface-container-highest': '#E6E0E9',
      outline: '#79747E',
      'outline-variant': '#CAC4D0',
      'inverse-surface': '#322F35',
      'inverse-on-surface': '#F5EFF7',
    },
    dark: {
      primary: '#D0BCFF',
      'primary-container': '#4F378B',
      'on-primary': '#381E72',
      'on-primary-container': '#EADDFF',
      secondary: '#CCC2DC',
      'secondary-container': '#4A4458',
      'on-secondary': '#332D41',
      'on-secondary-container': '#E8DEF8',
      tertiary: '#EFB8C8',
      'tertiary-container': '#633B48',
      'on-tertiary': '#492532',
      'on-tertiary-container': '#FFD8E4',
      'inverse-primary': '#65558F',
      'selection-bg': '#4F378B',
      'selection-text': '#EADDFF',
      background: '#111318',
      surface: '#111318',
      'on-background': '#E6E0E9',
      'on-surface': '#E6E0E9',
      'surface-variant': '#49454F',
      'on-surface-variant': '#CAC4D0',
      'surface-container-lowest': '#0E0D13',
      'surface-container-low': '#1A1720',
      'surface-container': '#1D1B20',
      'surface-container-high': '#2B2930',
      'surface-container-highest': '#36343B',
      outline: '#938F99',
      'outline-variant': '#49454F',
      'inverse-surface': '#E6E0E9',
      'inverse-on-surface': '#322F35',
    },
  },
  blue: {
    light: {
      primary: '#1565C0',
      'primary-container': '#D7E3FF',
      'on-primary': '#FFFFFF',
      'on-primary-container': '#001849',
      secondary: '#565E71',
      'secondary-container': '#DAE2F9',
      'on-secondary': '#FFFFFF',
      'on-secondary-container': '#121C2B',
      tertiary: '#705574',
      'tertiary-container': '#FAD8FF',
      'on-tertiary': '#FFFFFF',
      'on-tertiary-container': '#28002E',
      'inverse-primary': '#ADC6FF',
      'selection-bg': '#D7E3FF',
      'selection-text': '#001849',
      background: '#F8F9FF',
      surface: '#F8F9FF',
      'on-background': '#1A1B21',
      'on-surface': '#1A1B21',
      'surface-variant': '#E1E2EC',
      'on-surface-variant': '#44474E',
      'surface-container-lowest': '#FFFFFF',
      'surface-container-low': '#F3F3FA',
      'surface-container': '#EDEEF5',
      'surface-container-high': '#E7E8EF',
      'surface-container-highest': '#E2E2E9',
      outline: '#74777F',
      'outline-variant': '#C4C6D0',
      'inverse-surface': '#2F3036',
      'inverse-on-surface': '#F1F0F7',
    },
    dark: {
      primary: '#ADC6FF',
      'primary-container': '#0042A1',
      'on-primary': '#002884',
      'on-primary-container': '#D7E3FF',
      secondary: '#BEC6DC',
      'secondary-container': '#3E4759',
      'on-secondary': '#283141',
      'on-secondary-container': '#DAE2F9',
      tertiary: '#E5BAE8',
      'tertiary-container': '#573B5B',
      'on-tertiary': '#3F1C44',
      'on-tertiary-container': '#FAD8FF',
      'inverse-primary': '#1565C0',
      'selection-bg': '#0042A1',
      'selection-text': '#D7E3FF',
      background: '#111319',
      surface: '#111319',
      'on-background': '#E2E2E9',
      'on-surface': '#E2E2E9',
      'surface-variant': '#44474E',
      'on-surface-variant': '#C4C6D0',
      'surface-container-lowest': '#0D0E13',
      'surface-container-low': '#191B20',
      'surface-container': '#1D1F24',
      'surface-container-high': '#282A2F',
      'surface-container-highest': '#33353A',
      outline: '#8E9099',
      'outline-variant': '#44474E',
      'inverse-surface': '#E2E2E9',
      'inverse-on-surface': '#2F3036',
    },
  },
  green: {
    light: {
      primary: '#006E1C',
      'primary-container': '#96F990',
      'on-primary': '#FFFFFF',
      'on-primary-container': '#002204',
      secondary: '#52634E',
      'secondary-container': '#D4EECB',
      'on-secondary': '#FFFFFF',
      'on-secondary-container': '#0F1F0C',
      tertiary: '#38626D',
      'tertiary-container': '#BCEBF7',
      'on-tertiary': '#FFFFFF',
      'on-tertiary-container': '#001F26',
      'inverse-primary': '#7BDB7C',
      'selection-bg': '#96F990',
      'selection-text': '#002204',
      background: '#F6FBF3',
      surface: '#F6FBF3',
      'on-background': '#191C18',
      'on-surface': '#191C18',
      'surface-variant': '#DDE5DA',
      'on-surface-variant': '#424940',
      'surface-container-lowest': '#FFFFFF',
      'surface-container-low': '#F0F5ED',
      'surface-container': '#EAF0E7',
      'surface-container-high': '#E4EAE1',
      'surface-container-highest': '#DEE4DB',
      outline: '#72796F',
      'outline-variant': '#C1C9BD',
      'inverse-surface': '#2D312C',
      'inverse-on-surface': '#F0F5ED',
    },
    dark: {
      primary: '#7BDB7C',
      'primary-container': '#005316',
      'on-primary': '#003909',
      'on-primary-container': '#96F990',
      secondary: '#B9D1B3',
      'secondary-container': '#3B4B38',
      'on-secondary': '#253523',
      'on-secondary-container': '#D4EECB',
      tertiary: '#A1CFD9',
      'tertiary-container': '#1E4A55',
      'on-tertiary': '#00363D',
      'on-tertiary-container': '#BCEBF7',
      'inverse-primary': '#006E1C',
      'selection-bg': '#005316',
      'selection-text': '#96F990',
      background: '#11130F',
      surface: '#11130F',
      'on-background': '#E1E3DE',
      'on-surface': '#E1E3DE',
      'surface-variant': '#424940',
      'on-surface-variant': '#C1C9BD',
      'surface-container-lowest': '#0C0F0B',
      'surface-container-low': '#191C18',
      'surface-container': '#1D201C',
      'surface-container-high': '#272B26',
      'surface-container-highest': '#323531',
      outline: '#8C9389',
      'outline-variant': '#424940',
      'inverse-surface': '#E1E3DE',
      'inverse-on-surface': '#2E312D',
    },
  },
  rose: {
    light: {
      primary: '#9E163B',
      'primary-container': '#FFD9E2',
      'on-primary': '#FFFFFF',
      'on-primary-container': '#400016',
      secondary: '#74565F',
      'secondary-container': '#FFD9E3',
      'on-secondary': '#FFFFFF',
      'on-secondary-container': '#2B1520',
      tertiary: '#7A5731',
      'tertiary-container': '#FFDDB8',
      'on-tertiary': '#FFFFFF',
      'on-tertiary-container': '#2C1600',
      'inverse-primary': '#FFB1C2',
      'selection-bg': '#FFD9E2',
      'selection-text': '#400016',
      background: '#FFF8F7',
      surface: '#FFF8F7',
      'on-background': '#201A1B',
      'on-surface': '#201A1B',
      'surface-variant': '#EDDDE1',
      'on-surface-variant': '#4D3F42',
      'surface-container-lowest': '#FFFFFF',
      'surface-container-low': '#FFF0F2',
      'surface-container': '#FAEAEC',
      'surface-container-high': '#F4E4E6',
      'surface-container-highest': '#EEE0E2',
      outline: '#85737A',
      'outline-variant': '#D5C2C6',
      'inverse-surface': '#362D2E',
      'inverse-on-surface': '#FAEAEC',
    },
    dark: {
      primary: '#FFB1C2',
      'primary-container': '#7D0026',
      'on-primary': '#650022',
      'on-primary-container': '#FFD9E2',
      secondary: '#E3BDCA',
      'secondary-container': '#5B3F48',
      'on-secondary': '#43292E',
      'on-secondary-container': '#FFD9E3',
      tertiary: '#EEBF90',
      'tertiary-container': '#61411A',
      'on-tertiary': '#462900',
      'on-tertiary-container': '#FFDDB8',
      'inverse-primary': '#9E163B',
      'selection-bg': '#7D0026',
      'selection-text': '#FFD9E2',
      background: '#14100F',
      surface: '#14100F',
      'on-background': '#EDE0E1',
      'on-surface': '#EDE0E1',
      'surface-variant': '#4D3F42',
      'on-surface-variant': '#D5C2C6',
      'surface-container-lowest': '#0F0B0B',
      'surface-container-low': '#201A1B',
      'surface-container': '#261E20',
      'surface-container-high': '#302829',
      'surface-container-highest': '#3C3234',
      outline: '#9E8C8F',
      'outline-variant': '#4D3F42',
      'inverse-surface': '#EDE0E1',
      'inverse-on-surface': '#362D2E',
    },
  },
  orange: {
    light: {
      primary: '#9A4200',
      'primary-container': '#FFDBCA',
      'on-primary': '#FFFFFF',
      'on-primary-container': '#340F00',
      secondary: '#7E5740',
      'secondary-container': '#FFDBC9',
      'on-secondary': '#FFFFFF',
      'on-secondary-container': '#30180A',
      tertiary: '#686032',
      'tertiary-container': '#F1E4AA',
      'on-tertiary': '#FFFFFF',
      'on-tertiary-container': '#1F1800',
      'inverse-primary': '#FFB590',
      'selection-bg': '#FFDBCA',
      'selection-text': '#340F00',
      background: '#FFF8F5',
      surface: '#FFF8F5',
      'on-background': '#211712',
      'on-surface': '#211712',
      'surface-variant': '#F4DED4',
      'on-surface-variant': '#514239',
      'surface-container-lowest': '#FFFFFF',
      'surface-container-low': '#FFF1EB',
      'surface-container': '#FAEBE5',
      'surface-container-high': '#F4E5DF',
      'surface-container-highest': '#EEE0DA',
      outline: '#85736A',
      'outline-variant': '#D8C2B8',
      'inverse-surface': '#382E2A',
      'inverse-on-surface': '#FAEBE5',
    },
    dark: {
      primary: '#FFB590',
      'primary-container': '#762F00',
      'on-primary': '#511900',
      'on-primary-container': '#FFDBCA',
      secondary: '#EDBBAA',
      'secondary-container': '#63402B',
      'on-secondary': '#4A2416',
      'on-secondary-container': '#FFDBC9',
      tertiary: '#D4C882',
      'tertiary-container': '#504B1C',
      'on-tertiary': '#34300C',
      'on-tertiary-container': '#F1E4AA',
      'inverse-primary': '#9A4200',
      'selection-bg': '#762F00',
      'selection-text': '#FFDBCA',
      background: '#13100D',
      surface: '#13100D',
      'on-background': '#ECE0D8',
      'on-surface': '#ECE0D8',
      'surface-variant': '#514239',
      'on-surface-variant': '#D8C2B8',
      'surface-container-lowest': '#0E0B09',
      'surface-container-low': '#1E1915',
      'surface-container': '#221D19',
      'surface-container-high': '#2D2720',
      'surface-container-highest': '#38312C',
      outline: '#A08D83',
      'outline-variant': '#514239',
      'inverse-surface': '#ECE0D8',
      'inverse-on-surface': '#382E2A',
    },
  },
}

function isThemePreference(value: string | null): value is ThemePreference {
  return value === 'system' || value === 'light' || value === 'dark'
}

function isAccentColor(value: string | null): value is AccentColor {
  return value === 'purple' || value === 'blue' || value === 'green' || value === 'rose' || value === 'orange'
}

function getSystemTheme(): 'light' | 'dark' {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function applyAccentColors(theme: ThemeController, accent: AccentColor): void {
  const palette = ACCENT_PALETTES[accent]
  Object.assign(theme.themes.value.light.colors, palette.light)
  Object.assign(theme.themes.value.dark.colors, palette.dark)
}

function applyTheme(theme: ThemeController, preference: ThemePreference): void {
  const themeName = preference === 'system' ? getSystemTheme() : preference
  applyAccentColors(theme, getAccentPreference())
  theme.change(themeName)
}

export function getThemePreference(): ThemePreference {
  const storedValue = window.localStorage.getItem(THEME_PREFERENCE_KEY)
  return isThemePreference(storedValue) ? storedValue : 'dark'
}

export function setThemePreference(theme: ThemeController, preference: ThemePreference): void {
  window.localStorage.setItem(THEME_PREFERENCE_KEY, preference)
  applyTheme(theme, preference)
}

export function getAccentPreference(): AccentColor {
  const storedValue = window.localStorage.getItem(ACCENT_PREFERENCE_KEY)
  return isAccentColor(storedValue) ? storedValue : 'purple'
}

export function setAccentPreference(theme: ThemeController, accent: AccentColor): void {
  window.localStorage.setItem(ACCENT_PREFERENCE_KEY, accent)
  applyAccentColors(theme, accent)
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
