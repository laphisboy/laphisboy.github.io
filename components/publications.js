import { Box, Flex, Heading, Image, Text, Link, Divider } from '@chakra-ui/react'

const PubLink = ({ href, children }) => (
  <Link href={href} isExternal color="accent" fontWeight="medium">
    {children}
  </Link>
)

const Publication = ({ title, authors, venue, figure, links }) => (
  <Flex direction={{ base: 'column', md: 'row' }} align={{ base: 'stretch', md: 'center' }} gap={5} py={5}>
    <Box flexShrink={0} w={{ base: '100%', md: '270px' }}>
      <Image
        src={figure}
        alt={`${title} teaser figure`}
        w="100%"
        borderRadius="sm"
        borderWidth={1}
        borderColor="borderMain"
      />
    </Box>

    <Box flex="1">
      <Heading as="h4" fontSize={17} mb={1} lineHeight="1.35">
        {title}
      </Heading>
      <Text fontSize={14} color="textMuted" mb={1}>
        {authors}
      </Text>
      <Text fontSize={14} color="textMuted" mb={2}>
        {venue}
      </Text>
      <Text fontSize={14}>
        {links.map(([label, href], i) => (
          <span key={href}>
            {i > 0 && ' • '}
            <PubLink href={href}>{label}</PubLink>
          </span>
        ))}
      </Text>
    </Box>
  </Flex>
)

const Publications = () => (
  <>
    <Publication
      title="FLoD: Integrating Flexible Level of Detail into 3D Gaussian Splatting for Customizable Rendering"
      authors={<>Yunji Seo*, <strong>Young Sun Choi*</strong>, Hyun Seung Son, Youngjung Uh</>}
      venue="ACM TOG (SIGGRAPH 2025)"
      figure="/images/papers/flod.jpg"
      links={[
        ['project page', 'https://3dgs-flod.github.io/flod/'],
        ['paper', 'https://arxiv.org/abs/2408.12894'],
        ['code', 'https://github.com/3DGS-FLoD/flod']
      ]}
    />
    <Divider />
    <Publication
      title="BallGAN: 3D-aware Image Synthesis with a Spherical Background"
      authors={<>Minjung Shin, Yunji Seo, Jeongmin Bae, <strong>Youngsun Choi</strong>, Hyunsu Kim, Hyeran Byun, Youngjung Uh</>}
      venue="ICCV 2023"
      figure="/images/papers/ballgan.jpg"
      links={[
        ['project page', 'https://minjung-s.github.io/ballgan'],
        ['paper', 'https://arxiv.org/abs/2301.09091'],
        ['code', 'https://github.com/minjung-s/BallGAN']
      ]}
    />
  </>
)

export default Publications
