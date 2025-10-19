import { Box, Flex, HStack, IconButton, useDisclosure, Stack } from '@chakra-ui/react'
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons'
import { motion } from 'framer-motion'
import Link from 'next/link'

const MotionBox = motion(Box)

const NavLink = ({ children, href }) => (
  <Link href={href}>
    <Box
      px={2}
      py={1}
      rounded={'md'}
      cursor="pointer"
      _hover={{
        textDecoration: 'none',
        bg: 'gray.700',
      }}
    >
      {children}
    </Box>
  </Link>
)

const Navbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <MotionBox
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      bg="gray.900"
      px={4}
      position="fixed"
      top={0}
      width="100%"
      zIndex={1000}
    >
      <Box maxW="container.md" mx="auto">
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <IconButton
            size={'md'}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={'Open Menu'}
            display={{ md: 'none' }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems={'center'}>
                <Box fontWeight="bold">Young Sun Choi</Box>
            <HStack
              as={'nav'}
              spacing={4}
              display={{ base: 'none', md: 'flex' }}
            >
              <NavLink href="/">Home</NavLink>
              <NavLink href="/research">Publications</NavLink>
            </HStack>
          </HStack>
        </Flex>

        {isOpen && (
          <Box pb={4} display={{ md: 'none' }}>
            <Stack as={'nav'} spacing={4}>
              <NavLink href="/">Home</NavLink>
              <NavLink href="/research">Publications</NavLink>
            </Stack>
          </Box>
        )}
      </Box>
    </MotionBox>
  )
}

export default Navbar
