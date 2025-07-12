import { Box, Flex, Heading, Code } from '@chakra-ui/react';
import BackButton from './ui/BackButton';
import HeaderMenu from './ui/HeaderMenu';
// import StatusIndicator from './ui/StatusIndicator';
import { ColorModeSwitch } from './ui/color-mode';
import { Draft } from '../types/types';

interface HeaderProps {
  markdown: string;
  onReset: () => void;
  draft: Draft;
  colorMode: "light" | "dark";
  setColorMode: (value: "light" | "dark" | ((prev: "light" | "dark") => "light" | "dark")) => void;
}

const Header: React.FC<HeaderProps> = ({ markdown, onReset, draft, colorMode, setColorMode }) => {
    return (
        <Box as="header" w="100%" px={6} py={4} mb={4} boxShadow="lg" boxShadowColor={"black"}>
            <Flex align="center" justify="space-between">
                {/* Left-side */}
                <Flex gap={2}>
                    <BackButton />
                    {/* <StatusIndicator /> */}
                </Flex>

                <Flex>
                    <Heading size="lg" textAlign="center">
                        The Ultimate <Code size={"lg"} p={2}>README.md</Code> Tool
                    </Heading>
                </Flex>
        
                {/* Right-side */}
                <Flex gap={2}>
                    <ColorModeSwitch colorMode={colorMode} setColorMode={setColorMode} />
                    <HeaderMenu markdown={markdown} onReset={onReset} draft={draft} />
                </Flex>
            </Flex>
        </Box>
    );
};

export default Header;