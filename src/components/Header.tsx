import { Box, Flex, Heading, IconButton, Button, Link, Code } from '@chakra-ui/react';
import { Github } from 'lucide-react';
import BackButton from './BackButton';

const Header = () => {
    return (
        <Box as="header" w="100%" px={6} py={4} mb={4} boxShadow="lg" boxShadowColor={"black"}>
            <Flex align="center" justify="space-between">
                {/* Left: GitHub repo button */}
                    <Link href="https://github.com/Jacob-Garland/Readme-Tool" target="_blank" rel="noopener noreferrer">
                        <IconButton
                            aria-label="GitHub Repository"
                            variant="solid"
                            size="lg"
                            rounded={"full"}
                        >
                            <Github />
                        </IconButton>
                    </Link>
                        
                <Heading size="lg" textAlign="center" flex={1}>
                    The Ultimate <Code size={"lg"} p={2}>README.md</Code> Tool
                </Heading>
        
                {/* Right: Save and Reset buttons */}
                <Flex gap={2}>
                    <BackButton />
                    <Button colorPalette={"purple"}>Save</Button>
                </Flex>
            </Flex>
        </Box>
    );
};

export default Header;