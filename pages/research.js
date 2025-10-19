import {
  Container,
  Heading,
  Box,
  Text,
  Link,
  Badge,
  Divider
} from '@chakra-ui/react'
import Layout from '../components/layouts/article'
import Section from '../components/section'

const Research = () => (
  <Layout>
    <Container pt={12}>
          <Heading as="h3" fontSize={20} mb={4}>
            Publications
          </Heading>

      <Section delay={0.1}>
        <Box mb={6}>
          <Heading as="h4" fontSize={18} mb={2}>
            FLoD: Integrating Flexible Level of Detail into 3D Gaussian Splatting for Customizable Rendering
          </Heading>
          <Text fontSize={14} color="gray.400" mb={2}>
            Yunji Seo*, <strong>Youngsun Choi*</strong>, Hyun Seung Son, Youngjung Uh
          </Text>
          <Text fontSize={14} color="gray.400" mb={2}>
            ACM Transactions on Graphics, SIGGRAPH 2025
          </Text>
          <Text fontSize={14} mb={2}>
            Project Page / Paper / Code
          </Text>
        </Box>
        <Divider mb={6} />
      </Section>

      <Section delay={0.2}>
        <Box mb={6}>
          <Heading as="h4" fontSize={18} mb={2}>
            BallGAN: 3D-aware Image Synthesis with a Spherical Background
          </Heading>
          <Text fontSize={14} color="gray.400" mb={2}>
            Minjung Shin, Yunji Seo, Jeongmin Bae, <strong>Youngsun Choi</strong>, Hyunsu Kim, Hyeran Byun, Youngjung Uh
          </Text>
          <Text fontSize={14} color="gray.400" mb={2}>
            ICCV 2023
          </Text>
          <Text fontSize={14} mb={2}>
            Project Page / Paper 
          </Text>
        </Box>
        <Divider mb={6} />
      </Section>

    </Container>
  </Layout>
)

export default Research
