import { ChakraProvider, extendTheme } from '@chakra-ui/react'

const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: '#2a2a2a', // brighter background
        color: '#f0f0f0' // brighter text
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
  },
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false
  }
})

export default function Chakra({ children }) {
  return (
    <ChakraProvider theme={theme}>
      {children}
    </ChakraProvider>
  )
}
