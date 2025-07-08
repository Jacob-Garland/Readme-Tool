import { Box, Flex, Heading, Code } from '@chakra-ui/react';
import BackButton from './ui/BackButton';
import HeaderMenu from './ui/HeaderMenu';
import { ColorModeSwitch } from './ui/color-mode';

interface HeaderProps {
  markdown: string;
  onReset: () => void;
}

const Header: React.FC<HeaderProps> = ({ markdown, onReset }) => {
    return (
        <Box as="header" w="100%" px={6} py={4} mb={4} boxShadow="lg" boxShadowColor={"black"}>
            <Flex align="center" justify="space-between">
                {/* Left-side */}
                <Flex gap={2}>
                    <BackButton />
                </Flex>

                <Flex>
                    <Heading size="lg" textAlign="center">
                        The Ultimate <Code size={"lg"} p={2}>README.md</Code> Tool
                    </Heading>
                </Flex>
        
                {/* Right-side */}
                <Flex gap={2}>
                    <ColorModeSwitch />
                    <HeaderMenu markdown={markdown} onReset={onReset} />
                </Flex>
            </Flex>
        </Box>
    );
};

export default Header;