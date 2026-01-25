import { Box, Image, Text, Heading, VStack, Container } from '@chakra-ui/react';

const BasicCardComponent = () => {
  return (
    <Container maxW='sm' shadow='lg' borderRadius='lg' p={4}>
      <VStack spacing={4}>
        <Heading size='md'>Title</Heading>
        <Image src='valid-image-url' alt='image-alt' boxSize='150px' />
        <Text>Description text goes here.</Text>
      </VStack>
    </Container>
  );
};

export default BasicCardComponent;
