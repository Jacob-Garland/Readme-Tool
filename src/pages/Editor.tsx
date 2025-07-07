import { Tabs, Box, Textarea, Flex, Heading, HStack } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Header from "@/components/Header";
import PreviewSwitch from "@/components/ui/PreviewSwitch";
import Sections from "../components/Sections";
import Selections from "../components/Selections";
import ResetButton from "@/components/ui/ResetButton";
import CopyButton from "@/components/ui/CopyButton";
import DownloadButton from "@/components/ui/DownloadButton";
import { templates } from "../utils/templates";
import { useAutosave } from "@/hooks/useAutosave";

export type SectionType = {
  id: string;
  title: string;
  content: string;
};

const Editor = () => {
    const [sections, setSections] = useState<SectionType[]>([]);
    const [checkedSections, setCheckedSections] = useState<string[]>([]);
    const [markdown, setMarkdown] = useState<string>("");
    const [isGitView, setIsGitView] = useState<boolean>(true);


    // Add section by id (only adds to checkedSections, not sections array)
    const handleAddSection = (sectionId: string) => {
        // If not already in checkedSections, add it
        setCheckedSections(prev => prev.includes(sectionId) ? prev : [...prev, sectionId]);
        // If not already in sections, add from template
        if (!sections.find(s => s.id === sectionId)) {
            const template = templates.find(t => t.id === sectionId);
            if (template) {
                setSections(prev => [...prev, { ...template }]);
            }
        }
    };

    // Toggle checked state
    const handleToggleSection = (id: string, checked: boolean) => {
        if (checked) {
            // Add to checkedSections if not present
            setCheckedSections(prev => prev.includes(id) ? prev : [...prev, id]);
        } else {
            // Remove from checkedSections, but keep in sections array
            setCheckedSections(prev => prev.filter(t => t !== id));
        }
    };

    // Reorder sections (affects both checkedSections and sections array order)
    const handleReorderSections = (newOrder: string[]) => {
        // Reorder checkedSections to match newOrder
        setCheckedSections(prev => newOrder.filter(id => prev.includes(id)));
        // Reorder sections array to match newOrder
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

    // This is used to separate sections in the markdown output
    const SECTION_DELIMITER = "\u2063"; // Using a Unicode character as a delimiter for now

    // Update markdown when checkedSections or sections change
    useEffect(() => {
        // Only include sections that are checked, in the current order of checkedSections
        const checked = sections.filter(s => checkedSections.includes(s.id));
        setMarkdown(checked.map(s => s.content).join(SECTION_DELIMITER));
    }, [sections, checkedSections]);

    // Autosave hook to save sections periodically
    useAutosave(sections, setSections);

    return (
        <>
        <Header sections={sections} />
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
                        <Tabs.Trigger value="raw">Raw File</Tabs.Trigger>
                        <Tabs.Trigger value="editor">Section Editor</Tabs.Trigger>
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
                                    onChange={(e) => {
                                        const newContents = e.target.value.split(SECTION_DELIMITER);
                                        setSections(prevSections =>
                                        prevSections.map((section, idx) => ({
                                            ...section,
                                            content: newContents[idx] !== undefined ? newContents[idx].replaceAll(SECTION_DELIMITER, "") : ""
                                        }))
                                    );}}
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
                                    <Heading mt={2} mb={4} textAlign={"center"}>
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
                            value="editor"
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
                            <HStack>
                                {/* Need to add an Editor here for sections, or refactor Raw tab */}
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
                                    <Heading mt={2} mb={4} textAlign={"center"}>
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
                            <HStack justifyContent={"space-between"} alignItems="flex-start" flexWrap="wrap">
                                <Box minH="750px" minW={"70%"} maxW={"85%"} borderRadius="md" bg={"gray.100"} p={4} boxShadow="md" overflow={"auto"}>
                                    {isGitView ? (
                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                            {markdown}
                                        </ReactMarkdown>
                                    ) : (
                                        <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{markdown}</pre>
                                    )}
                                </Box>
                                <Box minW={"15%"} maxW={"30%"} borderRadius="md" bg={"purple.100"} p={4} boxShadow="md" alignContent={"center"} display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                                    <PreviewSwitch isGitView={isGitView} setIsGitView={setIsGitView} />
                                    <DownloadButton />
                                    <CopyButton value={markdown} />
                                </Box>
                            </HStack>
                        </Tabs.Content>
                    </Tabs.ContentGroup>
                </Tabs.Root>
            </Box>

            <Sections onSectionClick={handleAddSection} />
        </Flex>
        </>
    );
};

export default Editor;
