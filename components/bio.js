import { Box, Text } from '@chakra-ui/react'

export const BioSection = ({ children }) => (
  <Box mb={3}>
    {children}
  </Box>
)

export const BioYear = ({ children }) => (
  <Text
    as="span"
    fontWeight="bold"
    color="teal.400"
    mr={4}
  >
    {children}
  </Text>
)
