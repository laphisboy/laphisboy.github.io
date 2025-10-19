import { Box, Container } from '@chakra-ui/react'
import Header from '../navbar'
import Footer from '../footer'

const ArticleLayout = ({ children }) => {
  return (
    <Box minH="100vh" bg="#0a0a0a">
      <Header />
      <Container maxW="container.xl" pt={14}>
        {children}
      </Container>
      <Footer />
    </Box>
  )
}

export default ArticleLayout
