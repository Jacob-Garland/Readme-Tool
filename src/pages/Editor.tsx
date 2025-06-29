import { Tabs, Box, Textarea, Flex, IconButton, Button, Heading, Code, Link, Text } from "@chakra-ui/react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Github } from "lucide-react";
import Sections from "../components/Sections";

const Editor = () => {
    const [raw, setRaw] = useState<string>("");

    return (
        <>
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
                    The <Code size={"lg"} p={2}>README.md</Code> Generator
                </Heading>
                {/* Right: Save and Reset buttons */}
                <Flex gap={2}>
                    <Button colorPalette={"purple"}>Save</Button>
                    <Button colorPalette={"purple"}>Reset</Button>
                </Flex>
            </Flex>
        </Box>

        {/* Tabs/Editor area */}
        <Flex w="100%" px={[0, 2, 6]} py={2} direction={["column", "row"]} align="flex-start" justify="center" gap={4} flex="1 1 0%" minH="0">
            <Box
                w={["100%", "100%", "75%"]}
                minW={0}
                boxShadow={"lg"}
                borderRadius={"md"}
                h={["auto", "auto", "calc(100vh - 120px)"]}
                maxH={["none", "none", "calc(100vh - 120px)"]}
                display="flex"
                flexDirection="column"
                overflow="hidden"
            >
                <Tabs.Root
                    variant="outline"
                    size="lg"
                    defaultValue="raw"
                    mb={10}
                    colorPalette={"purple"}
                >
                    <Tabs.List zIndex={1}>
                        <Tabs.Trigger value="raw">Raw Editor</Tabs.Trigger>
                        <Tabs.Trigger value="preview">Output Preview</Tabs.Trigger>
                    </Tabs.List>
                    <Tabs.ContentGroup flex="1 1 0%" minH={0}>
                        <Tabs.Content
                            value="raw"
                            p={6}
                            flex="1 1 0%"
                            minH={0}
                            overflowY="auto"
                            _open={{
                                animationName: "fade-in, scale-in",
                                animationDuration: "300ms",
                            }}
                            _closed={{
                                animationName: "fade-out, scale-out",
                                animationDuration: "120ms",
                            }}
                        >
                            <Textarea
                                value={raw}
                                onChange={(e) => setRaw(e.target.value)}
                                h="77vh"
                                minH="300px"
                                w="100%"
                                placeholder="Write your README here..."
                                fontFamily="mono"
                                resize="none"
                            />
                        </Tabs.Content>
                        <Tabs.Content
                            value="preview"
                            p={6}
                            flex="1 1 0%"
                            minH={0}
                            overflowY="auto"
                            _open={{
                                animationName: "fade-in, scale-in",
                                animationDuration: "300ms",
                            }}
                            _closed={{
                                animationName: "fade-out, scale-out",
                                animationDuration: "120ms",
                            }}
                        >
                            <Box minH="300px" overflowY="auto" borderRadius="md" bg={"gray.100"} p={4} boxShadow="md">
                                <ReactMarkdown skipHtml>
                                    {raw}
                                </ReactMarkdown>
                            </Box>
                        </Tabs.Content>
                    </Tabs.ContentGroup>
                </Tabs.Root>
            </Box>

            {/* Right column for Sections Menu */}
            <Box w={["100%", "100%", "25%"]} minW={0} mt={[8, 0, 0]} boxShadow={"lg"} borderRadius={"md"} p={4} bg={"purple.100"}>
                <Heading size="lg" textAlign="center" mt={2}>
                    Add A Section
                </Heading>
                <Box textAlign="center" mb={4}>
                    <Text>Click on a section to add it to your README.md</Text>
                </Box>

                <Sections />
            </Box>
        </Flex>
        </>
    );
};

export default Editor;
