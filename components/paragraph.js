import { Text } from '@chakra-ui/react'

const Paragraph = ({ children }) => (
  <Text
    fontSize="lg"
    lineHeight="1.6"
    mb={3}
    color="gray.300"
  >
    {children}
  </Text>
)

export default Paragraph
