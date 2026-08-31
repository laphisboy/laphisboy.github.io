import { ChakraProvider, extendTheme } from '@chakra-ui/react'

export const theme = extendTheme({
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false
  },
  semanticTokens: {
    colors: {
      pageBg: { default: '#f7f7f8', _dark: '#0a0a0a' },
      panelBg: { default: '#ffffff', _dark: '#2a2a2a' },
      navBg: { default: '#ffffff', _dark: '#171717' },
      navHover: { default: 'gray.100', _dark: 'gray.700' },
      textMain: { default: '#1a1a1a', _dark: '#f0f0f0' },
      textMuted: { default: 'gray.600', _dark: 'gray.300' },
      borderMain: { default: 'gray.300', _dark: 'whiteAlpha.800' },
      accent: { default: 'teal.600', _dark: 'teal.300' }
    }
  },
  styles: {
    global: {
      body: {
        bg: 'pageBg',
        color: 'textMain'
      }
    }
  },
  colors: {
    gray: {
      50: '#f5f5f5',
      100: '#e5e5e5',
      200: '#d4d4d4',
      300: '#a3a3a3',
      400: '#8a8a8a',
      500: '#737373',
      600: '#525252',
      700: '#404040',
      800: '#262626',
      900: '#171717'
    },
    teal: {
      400: '#64d2c8'
    }
  },
  fonts: {
    heading: "'M PLUS Rounded 1c'",
    body: "'M PLUS Rounded 1c'"
  }
})

export default function Chakra({ children }) {
  return (
    <ChakraProvider theme={theme}>
      {children}
    </ChakraProvider>
  )
}
