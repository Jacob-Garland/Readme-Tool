import { Box, Flex, Heading, IconButton, Link, Code } from '@chakra-ui/react';
import { Github } from 'lucide-react';
import BackButton from './ui/BackButton';
import SaveButton from './ui/SaveButton';
import type { Section } from '@/utils/saveRestore';

interface HeaderProps {
  sections: Section[];
}

const Header: React.FC<HeaderProps> = ({ sections }) => {
    return (
        <Box as="header" w="100%" px={6} py={4} mb={4} boxShadow="lg" boxShadowColor={"black"}>
            <Flex align="center" justify="space-between">
                {/* Left-side */}
                <Flex gap={2}>
                    <BackButton />
                    <SaveButton sections={sections} />
                </Flex>

                <Flex>
                    <Heading size="lg" textAlign="center">
                        The Ultimate <Code size={"lg"} p={2}>README.md</Code> Tool
                    </Heading>
                </Flex>
        
                {/* Right-side */}
                <Flex gap={2}>
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
                </Flex>
            </Flex>
        </Box>
    );
};

export default Header;