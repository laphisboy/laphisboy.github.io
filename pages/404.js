import { Container, Heading, Text, Button, Box } from '@chakra-ui/react'
import NextLink from 'next/link'
import Layout from '../components/layouts/article'

const NotFound = () => (
  <Layout>
    <Container>
      <Box textAlign="center" py={20}>
        <Heading as="h1" fontSize="6xl" mb={4}>
          404
        </Heading>
        <Text fontSize="xl" mb={8} color="gray.400">
          Page not found
        </Text>
        <Button as={NextLink} href="/" colorScheme="teal">
          Go back home
        </Button>
      </Box>
    </Container>
  </Layout>
)

export default NotFound
