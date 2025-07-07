import { Box, Flex, Heading, IconButton, Link, Code } from '@chakra-ui/react';
import { Github } from 'lucide-react';
import BackButton from './ui/BackButton';
import HeaderMenu from './ui/HeaderMenu';
import SaveButton from './ui/SaveButton';
import { ColorModeSwitch } from './ui/color-mode';

const Header = () => {
    return (
        <Box as="header" w="100%" px={6} py={4} mb={4} boxShadow="lg" boxShadowColor={"black"}>
            <Flex align="center" justify="space-between">
                {/* Left-side */}
                <Flex gap={2}>
                    <BackButton />
                    <SaveButton />
                </Flex>

                <Flex>
                    <Heading size="lg" textAlign="center">
                        The Ultimate <Code size={"lg"} p={2}>README.md</Code> Tool
                    </Heading>
                </Flex>
        
                {/* Right-side */}
                <Flex gap={2}>
                    <ColorModeSwitch />
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
                    <HeaderMenu />
                </Flex>
            </Flex>
        </Box>
    );
};

export default Header;