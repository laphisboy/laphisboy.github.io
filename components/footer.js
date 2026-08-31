import { Box, Text, Link } from '@chakra-ui/react'

const Footer = () => {
  return (
    <Box
      bg="panelBg"
      color="textMuted"
      py={4}
      mt={16}
      textAlign="center"
    >
      <Text fontSize="sm">
        This website is built based on the{' '}
        <Link href="https://www.changwoon.info/" isExternal color="accent">
          Changwoon Choi's
        </Link>
        {' '}and{' '}
        <Link href="https://www.craftz.dog/" isExternal color="accent">
          Takuya Matsuyama's
        </Link>
        {' '}website
      </Text>
    </Box>
  )
}

export default Footer
