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
          'on-primary': '#FFFFFF',
          'on-secondary': '#FFFFFF',
          'on-background': '#1D1B20',
          'on-surface': '#1D1B20',
        },
      },
      dark: {
        colors: {
          primary: '#D0BCFF',
          secondary: '#CCC2DC',
          tertiary: '#EFB8C8',
          error: '#F2B8B5',
          background: '#141218',
          surface: '#141218',
          'on-primary': '#381E72',
          'on-secondary': '#332D41',
          'on-background': '#E6E0E9',
          'on-surface': '#E6E0E9',
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
  },
})
