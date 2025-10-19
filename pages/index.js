import React from 'react';
import NextLink from 'next/link'
import {
  Link,
  Container,
  Heading,
  Box,
  Button,
  List,
  ListItem,
  Text,
  useToast,
} from '@chakra-ui/react'
import Paragraph from '../components/paragraph'
import { BioSection, BioYear } from '../components/bio'
import Layout from '../components/layouts/article'
import Section from '../components/section'
import { IoLogoGithub, IoMailUnread, IoDocumentAttach, IoSchool } from 'react-icons/io5'
import Scene from '../components/scene'

const Home = () => {
  const toast = useToast()
  return (
  <Layout>
    <Container maxW="1000px" mx="auto" px={4}>
      {/* 3D Scene Section */}
      <Box display="flex" flexDirection="column" alignItems="center" mb={8}>
        <Scene />
        <Box mt={4} textAlign="center" maxW="400px">
          <Text fontSize="xs" color="gray.500">to be updated</Text>
        </Box>
      </Box>

      <Box maxW="800px" mx="auto">
        <Box display={{ lg: 'flex' }} alignItems="center">
          <Box flexGrow={1} textAlign={{ base: "center", lg: "left" }}>
        <Heading as="h2" variant="page-title">
          Young Sun Choi
        </Heading>
        <p><b>Ph.D. Student</b> <br/>Yonsei University</p>
          </Box>
          <Box
            flexShrink={0}
            mt={{ base: 4, md: 0 }}
            ml={{ md: 6 }}
            textAlign="center"
          >
          <Box
            borderColor="whiteAlpha.800"
            borderWidth={2}
            borderStyle="solid"
            w="150px"
            h="150px"
            display="inline-block"
            borderRadius="full"
            overflow="hidden"
            bg="gray.600"
          >
            <img
              src="/images/voxel_portrait.png"
              alt="Profile"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </Box>
        </Box>
        </Box>
      </Box>

      <Section delay={0.1}>
        <Box maxW="800px" mx="auto">
          <Heading as="h3" variant="section-title">
            About me
          </Heading>
          <Paragraph>
            I am a Ph.D. student at Yonsei University, interested in 3D Computer Vision. 
            My research is driven by the goal of enhancing reconstruction quality and developing 3D models more practical for real-world applications. 
            I am always open to exploring creative challenges and collaborations. 
            Please feel free to contact me!
          </Paragraph>
        </Box>
      </Section>


      <Section delay={0.2}>
        <Box maxW="800px" mx="auto">
          <Heading as="h3" variant="section-title">
            Links
          </Heading>
        <List>
          <ListItem>
            <Button
              variant="ghost"
              colorScheme="teal"
              leftIcon={<IoMailUnread/>}
              onClick={() => {
                navigator.clipboard.writeText('youngsun.choi@yonsei.ac.kr');
                toast({
                  title: "Email copied!",
                  description: "youngsun.choi@yonsei.ac.kr has been copied to clipboard",
                  status: "success",
                  duration: 2000,
                  isClosable: true,
                });
              }}
            >
              youngsun.choi@yonsei.ac.kr
            </Button>
          </ListItem>
          <ListItem>
            <Link href="https://github.com/laphisboy" target="_blank">
              <Button
                variant="ghost"
                colorScheme="teal"
                leftIcon={<IoLogoGithub />}
              >
                @laphisboy
              </Button>
            </Link>
          </ListItem>
          <ListItem>
            <Link href="https://vilab.yonsei.ac.kr/" target="_blank">
              <Button
                variant="ghost"
                colorScheme="teal"
                leftIcon={<IoSchool />}
              >
                Yonsei VILAB
              </Button>
            </Link>
          </ListItem>
        </List>
        </Box>
      </Section>

      <Section delay={0.2}>
        <Box maxW="800px" mx="auto" textAlign="center">
          <Link as={NextLink} href="/research">
            <Button
              size="lg"
              colorScheme="teal"
              variant="outline"
              _hover={{
                bg: "teal.500",
                color: "white",
                transform: "translateY(-2px)",
                boxShadow: "lg"
              }}
              transition="all 0.2s"
            >
              View Publications
            </Button>
          </Link>
        </Box>
      </Section>

      <Box align="center" h="2em">
      </Box>

    </Container>
  </Layout>
  );
};

export default Home
