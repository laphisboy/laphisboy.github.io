import { Box, Flex, IconButton, useColorMode } from '@chakra-ui/react'
import { SunIcon, MoonIcon } from '@chakra-ui/icons'
import { motion } from 'framer-motion'
import Link from 'next/link'

const MotionBox = motion(Box)

const Navbar = () => {
  const { colorMode, toggleColorMode } = useColorMode()

  return (
    <MotionBox
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      bg="navBg"
      px={4}
      position="fixed"
      top={0}
      width="100%"
      zIndex={1000}
    >
      <Box maxW="container.md" mx="auto">
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <Link href="/">
            <Box fontWeight="bold" cursor="pointer">Young Sun Choi</Box>
          </Link>

          <IconButton
            size={'md'}
            variant="ghost"
            icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
            aria-label={`Switch to ${colorMode === 'light' ? 'night' : 'day'} mode`}
            onClick={toggleColorMode}
          />
        </Flex>
      </Box>
    </MotionBox>
  )
}

export default Navbar
