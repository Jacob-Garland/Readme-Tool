import { Tabs, Box, Textarea, Flex, Heading, Text, HStack } from "@chakra-ui/react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Header from "@/components/Header";
import Sections from "../components/Sections";
import { useTemplates } from "../hooks/useTemplates";

const Editor = () => {
    const [raw, setRaw] = useState<string>("");
    const { getTemplate } = useTemplates();

    // Handler to append a section template to the raw editor
    const handleAddSection = (section: string) => {
        let template = "";
        if (section === "BLANK_SECTION") {
            template = `\n\n## New Section\n\nType or add your section here.\n\n`;
        } else {
            template = getTemplate(section);
            // Ensure a blank line after each section
            if (!template.endsWith("\n\n")) template = template.trimEnd() + "\n\n";
        }
        setRaw((prev) => prev + (prev && !prev.endsWith("\n") ? "\n\n" : "") + template);
    };

    return (
        <>
        <Header />

        {/* Tabs/Editor area */}
        <Flex w="100%" px={[0, 2, 6]} py={2} direction={["column", "row"]} align="flex-start" justify="center" gap={4} flex="1 1 0%" minH="0">
            <Box
                w={["100%", "100%", "80%"]}
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
                            <HStack justifyContent={"space-between"}>
                                <Textarea
                                    value={raw}
                                    onChange={(e) => setRaw(e.target.value)}
                                    h="77vh"
                                    minH="300px"
                                    w="75%"
                                    placeholder="Write your README here..."
                                    fontFamily="mono"
                                    resize="none"
                                    borderColor="purple.300"
                                    _hover={{ borderColor: "purple.500" }}
                                    borderWidth={3}
                                />
                                <Box
                                    w="23%"
                                    h="77vh"
                                    minH="300px"
                                    overflowY="auto"
                                    borderRadius="md"
                                    bg={"purple.100"}
                                    p={4}
                                    boxShadow="md"
                                >
                                    <Heading size="lg" textAlign="center" mt={2}>
                                        My Current Sections
                                    </Heading>
                                    <Text textAlign="center" mb={4}>
                                        WIP
                                    </Text>
                                </Box>
                            </HStack>
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
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {raw}
                                </ReactMarkdown>
                            </Box>
                        </Tabs.Content>
                    </Tabs.ContentGroup>
                </Tabs.Root>
            </Box>

            {/* Right column for Sections Menu */}
            <Box w={["100%", "100%", "20%"]}
                minW={0}
                boxShadow={"lg"}
                borderRadius={"md"}
                h={["auto", "auto", "calc(100vh - 120px)"]}
                maxH={["none", "none", "calc(100vh - 120px)"]}
                display="flex"
                flexDirection="column"
                overflow="hidden" 
                p={4} 
                bg={"purple.100"} 
                overflowY={"auto"}
            >
                <Heading size="lg" textAlign="center" mt={2}>
                    Add A Section
                </Heading>
                <Box textAlign="center" mb={4}>
                    <Text>Click on a section to add it to your README.md</Text>
                </Box>

                <Sections onSectionClick={handleAddSection} />
            </Box>
        </Flex>
        </>
    );
};

export default Editor;
