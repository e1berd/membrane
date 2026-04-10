import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'

export const vuetify = createVuetify({
  theme: {
    defaultTheme: 'dark',
    themes: {
      light: {
        colors: {
          primary: '#65558F',
          secondary: '#625B71',
          tertiary: '#7D5260',
          error: '#B3261E',
          background: '#FEF7FF',
          surface: '#FEF7FF',
          'surface-variant': '#E7E0EC',
          'surface-container': '#F3EDF7',
          'surface-container-low': '#F7F2FA',
          'surface-container-high': '#ECE6F0',
          'surface-container-highest': '#E6E0E9',
          'on-primary': '#FFFFFF',
          'on-secondary': '#FFFFFF',
          'on-background': '#1D1B20',
          'on-surface': '#1D1B20',
          'on-surface-variant': '#49454F',
          outline: '#79747E',
          'outline-variant': '#CAC4D0',
          'inverse-surface': '#322F35',
          'inverse-on-surface': '#F5EFF7',
        },
      },
      dark: {
        colors: {
          primary: '#D0BCFF',
          secondary: '#CCC2DC',
          tertiary: '#EFB8C8',
          error: '#F2B8B5',
          background: '#111318',
          surface: '#111318',
          'surface-variant': '#49454F',
          'surface-container': '#1D1B20',
          'surface-container-low': '#1A1720',
          'surface-container-high': '#2B2930',
          'surface-container-highest': '#36343B',
          'on-primary': '#381E72',
          'on-secondary': '#332D41',
          'on-background': '#E6E0E9',
          'on-surface': '#E6E0E9',
          'on-surface-variant': '#CAC4D0',
          outline: '#938F99',
          'outline-variant': '#49454F',
          'inverse-surface': '#E6E0E9',
          'inverse-on-surface': '#322F35',
        },
      },
    },
  },
  defaults: {
    VBtn: {
      rounded: 'xl',
    },
    VTextField: {
      variant: 'outlined',
    },
    VCard: {
      rounded: 'lg',
    },
    VList: {
      bgColor: 'transparent',
    },
    VNavigationDrawer: {
      color: 'surface-container',
    },
  },
})
