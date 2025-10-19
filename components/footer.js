import { Box, Text, Link } from '@chakra-ui/react'

const Footer = () => {
  return (
    <Box
      bg="#2a2a2a"
      color="gray.400"
      py={8}
      mt={16}
      textAlign="center"
    >
      <Text fontSize="sm">
        This website is built based on the{' '}
        <Link href="https://www.changwoon.info/" isExternal color="gray.300">
          Changwoon Choi's
        </Link>
        {' '}and{' '}
        <Link href="https://www.craftz.dog/" isExternal color="gray.300">
          Takuya Matsuyama's
        </Link>
        {' '}website
      </Text>
    </Box>
  )
}

export default Footer
