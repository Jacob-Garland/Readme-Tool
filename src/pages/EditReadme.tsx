import React from 'react';
import { Box, Heading, HStack } from '@chakra-ui/react';
import BackButton from '../components/BackButton';

const EditReadme: React.FC = () => (
    <Box p={8}>
        <HStack mb={4} alignItems="center" justifyContent="center">
            <BackButton />
            <Heading textAlign={"center"} size={"3xl"}>Edit An Existing README</Heading>
        </HStack>
    </Box>
)

export default EditReadme
