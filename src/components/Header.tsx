import { Box, Flex, Heading, Code } from '@chakra-ui/react';
import BackButton from './ui/BackButton';
import HeaderMenu from './ui/HeaderMenu';
import StatusIndicator from './ui/StatusIndicator';

interface HeaderProps {
  markdown: string;
}

const Header: React.FC<HeaderProps> = ({ markdown }) => {
    return (
        <Box as="header" w="100%" px={6} py={4} mb={4} boxShadow="lg" boxShadowColor={"black"} position="relative">
            <Flex align="center" justify="space-between" position="relative">
                {/* Left-side */}
                <Flex gap={4} minW="220px">
                    <BackButton />
                    <StatusIndicator />
                </Flex>

                {/* Center heading absolutely centered */}
                <Box position="absolute" left="50%" top="50%" style={{ transform: 'translate(-50%, -50%)' }} zIndex={1} w="max-content">
                    <Heading size="lg" textAlign="center">
                        The Ultimate <Code size={"lg"} p={2} bg={"yellow.300"} color={"black"}>README.md</Code> Tool
                    </Heading>
                </Box>

                {/* Right-side */}
                <Flex minW="180px" justify="flex-end">
                    <HeaderMenu markdown={markdown} />
                </Flex>
            </Flex>
        </Box>
    );
};

export default Header;