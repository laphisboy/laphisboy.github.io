import { Container, Heading } from '@chakra-ui/react'
import Layout from '../components/layouts/article'
import Section from '../components/section'
import Publications from '../components/publications'

const Research = () => (
  <Layout>
    <Container pt={12}>
      <Heading as="h3" fontSize={20} mb={4}>
        Publications
      </Heading>
      <Section delay={0.1}>
        <Publications />
      </Section>
    </Container>
  </Layout>
)

export default Research
