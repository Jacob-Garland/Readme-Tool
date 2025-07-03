// This file will be for a GitHub Profile README generation screen.
import { Box, Heading, Text, VStack } from '@chakra-ui/react';
import BackButton from '@/components/ui/BackButton';

const GitReadme = () => {
    return (
        <Box p={4}>
            <BackButton />
            <Heading as="h1" m={4}>
                GitHub Profile README Generator
            </Heading>
            <Text mb={4}>
                Create a stunning README for your GitHub profile with ease.
            </Text>
            <VStack p={4} align="stretch">
                {/* Add your components here */}
            </VStack>
        </Box>
    );
};

export default GitReadme;
