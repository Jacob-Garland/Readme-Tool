import { Tabs, Box, Textarea, Flex, IconButton, Button, Heading, Code, Link, Text } from "@chakra-ui/react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Github } from "lucide-react";

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
                        colorPalette={"purple"}
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
        <Flex w="100%" px={[0, 2, 6]} py={2} direction={["column", "row"]} align="flex-start" justify="center" gap={4}>
            <Box w={["100%", "100%", "75%"]} minW={0} boxShadow={"lg"} borderRadius={"md"}>
                <Tabs.Root variant="outline" size="lg" defaultValue="raw" mb={10} mx="auto">
                    <Tabs.List>
                        <Tabs.Trigger value="raw">Raw Editor</Tabs.Trigger>
                        <Tabs.Trigger value="preview">Output Preview</Tabs.Trigger>
                    </Tabs.List>

                    <Tabs.ContentGroup>
                        <Tabs.Content value="raw" p={6}
                            _open={{
                                animationName: "fade-in, scale-in",
                                animationDuration: "300ms",
                            }}
                            _closed={{
                                animationName: "fade-out, scale-out",
                                animationDuration: "120ms",
                            }}>
                            <Textarea
                                value={raw}
                                onChange={(e) => setRaw(e.target.value)}
                                h="70vh"
                                w="100%"
                                placeholder="Write your README here..."
                                fontFamily="mono"
                                resize="none"
                            />
                        </Tabs.Content>
                        <Tabs.Content value="preview"
                            _open={{
                                animationName: "fade-in, scale-in",
                                animationDuration: "300ms",
                            }}
                            _closed={{
                                animationName: "fade-out, scale-out",
                                animationDuration: "120ms",
                            }}>
                            <Box h="70vh" p={4}>
                                <Box>
                                    <ReactMarkdown skipHtml>
                                        {raw}
                                    </ReactMarkdown>
                                </Box>
                            </Box>
                        </Tabs.Content>
                    </Tabs.ContentGroup>
                </Tabs.Root>
            </Box>

            {/* Right column for Sections Menu */}
            <Box w={["100%", "100%", "25%"]} minW={0} mt={[8, 0, 0]} boxShadow={"lg"} borderRadius={"md"}>
                <Heading size="lg" textAlign="center" mt={2}>
                    Add A Section
                </Heading>
                <Box textAlign="center" mb={4}>
                    <Text>Click on a section to add it to your README.md</Text>
                </Box>
                <Box display="flex" flexDirection="column" gap={2} p={4} alignItems={"center"}>
                    {/* TODO:Make seperate component for handling DND and array of buttons */}
                    <Button colorPalette={"purple"} w="60%">
                        Introduction
                    </Button>
                    <Button colorPalette={"purple"} w="60%">
                        Installation
                    </Button>
                    <Button colorPalette={"purple"} w="60%">
                        Usage
                    </Button>
                    <Button colorPalette={"purple"} w="60%">
                        Contributing
                    </Button>
                </Box>
            </Box>
        </Flex>
        </>
    );
};

export default Editor;
