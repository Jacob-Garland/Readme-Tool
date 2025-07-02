import { Tabs, Box, Textarea, Flex, Heading, Text, HStack } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Header from "@/components/Header";
import Sections from "../components/Sections";
import Selections from "../components/Selections";
import ResetButton from "@/components/ui/ResetButton";
import CopyButton from "@/components/ui/CopyButton";
import DownloadButton from "@/components/ui/DownloadButton";
import { templates } from "../utils/templates";

export type SectionType = {
  id: string;
  title: string;
  content: string;
};

const Editor = () => {
    const [sections, setSections] = useState<SectionType[]>([]);
    const [checkedSections, setCheckedSections] = useState<string[]>([]);
    const [markdown, setMarkdown] = useState<string>("");

    // Add section by id
    const handleAddSection = (sectionId: string) => {
        const template = templates.find(t => t.id === sectionId);
        if (!template) return;
        setSections(prev => [...prev, template]);
        setCheckedSections(prev => prev.includes(sectionId) ? prev : [...prev, sectionId]);
    };

    // Toggle checked state
    const handleToggleSection = (id: string) => {
        setCheckedSections(prev =>
            prev.includes(id)
                ? prev.filter(t => t !== id)
                : [...prev, id]
        );
    };

    // Reorder sections
    const handleReorderSections = (newOrder: string[]) => {
        setSections(prev => {
            const idToSection = Object.fromEntries(prev.map(s => [s.id, s]));
            return newOrder.map(id => idToSection[id]).filter(Boolean);
        });
    };

    // Reset all
    const handleReset = () => {
        setSections([]);
        setCheckedSections([]);
        setMarkdown("");
    };

    // Update markdown when sections change
    useEffect(() => {
        setMarkdown(sections.map(s => s.content).join("\n\n"));
    }, [sections]);

    return (
        <>
        <Header />
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
                                    value={markdown}
                                    onChange={(e) => setMarkdown(e.target.value)}
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
                                    <Heading size="xl" textAlign="center" mt={2} mb={4}>
                                        <CopyButton value={markdown} /> <ResetButton onReset={handleReset} />
                                    </Heading>
                                    <Selections
                                        selectedSections={sections.map(s => s.id)}
                                        checkedSections={checkedSections}
                                        onToggle={handleToggleSection}
                                        onReorder={handleReorderSections}
                                    />
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
                            <DownloadButton />
                            <Box minH="300px" maxW={"80%"} borderRadius="md" bg={"gray.100"} p={4} boxShadow="md">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {markdown}
                                </ReactMarkdown>
                            </Box>
                        </Tabs.Content>
                    </Tabs.ContentGroup>
                </Tabs.Root>
            </Box>
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
                <Heading size="xl" textAlign="center" mt={2}>
                    Select A Section
                </Heading>
                <Box textAlign="center" mb={2} fontSize="sm">
                    <Text>Click on a section to add it to your README.md</Text>
                </Box>
                <Sections onSectionClick={handleAddSection} />
            </Box>
        </Flex>
        </>
    );
};

export default Editor;
