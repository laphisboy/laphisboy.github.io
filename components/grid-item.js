import { Box, Text, Link } from '@chakra-ui/react'
import Image from 'next/image'
import { motion } from 'framer-motion'

const MotionBox = motion(Box)

const GridItem = ({ children, href, title, thumbnail }) => (
  <MotionBox
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    w="100%"
    textAlign="center"
  >
    <Link href={href} target="_blank" rel="noopener noreferrer">
      <Box
        borderRadius="lg"
        overflow="hidden"
        bg="gray.700"
        borderWidth="1px"
        borderColor="gray.600"
        _hover={{
          borderColor: 'teal.400',
          boxShadow: '0 0 20px rgba(56, 178, 172, 0.3)'
        }}
        transition="all 0.3s"
      >
        <Image
          src={thumbnail || '/images/placeholder.jpg'}
          alt={title}
          className="grid-item-thumbnail"
          width={300}
          height={200}
          style={{
            width: '100%',
            height: '200px',
            objectFit: 'cover'
          }}
        />
        <Box p={4}>
          <Text fontWeight="bold" fontSize="lg" mb={2}>
            {title}
          </Text>
          <Text fontSize="sm" color="gray.300">
            {children}
          </Text>
        </Box>
      </Box>
    </Link>
  </MotionBox>
)

export { GridItem }
