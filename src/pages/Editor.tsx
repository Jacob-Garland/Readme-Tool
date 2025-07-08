import { Tabs, Box, Flex, Heading, HStack } from "@chakra-ui/react";
import { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Header from "@/components/Header";
import MonacoEditorWrapper from "@/components/MonacoEditor";
import Sections from "../components/Sections";
import Selections from "../components/Selections";
// import ResetButton from "@/components/ui/ResetButton";
// import CopyButton from "@/components/ui/CopyButton";
// import DownloadButton from "@/components/ui/DownloadButton";
import PreviewSwitch from "@/components/ui/PreviewSwitch";
import { templates } from "../utils/templates";
import DynamicTOC from "../components/DynamicTOC";
import {
  saveSections,
  loadSections,
  saveCheckedSections,
  loadCheckedSections,
  saveGitView,
  loadGitView,
  store as tauriStore
} from "../utils/store";

export type SectionType = {
  id: string;
  title: string;
  content: string;
};

const Editor = () => {
    const location = useLocation();
    const [sections, setSections] = useState<SectionType[]>([]);
    const [checkedSections, setCheckedSections] = useState<string[]>([]);
    const [markdown, setMarkdown] = useState<string>("");
    const [isGitView, setIsGitView] = useState<boolean>(true);

    // Helper to update the TOC section content dynamically
    const updateTOCSection = useCallback((tocMarkdown: string) => {
        setSections(prevSections => {
            const idx = prevSections.findIndex(s => s.id === "Table of Contents");
            if (idx === -1) return prevSections;
            // Only update if content is different
            if (prevSections[idx].content === tocMarkdown) return prevSections;
            const updated = [...prevSections];
            updated[idx] = { ...updated[idx], content: tocMarkdown };
            return updated;
        });
    }, []);

    // On mount, check for state from NewReadme and initialize sections if present
    useEffect(() => {
        if (location.state && (location.state.markdownSections || location.state.selections)) {
            const { markdownSections = [], selections = [] } = location.state as any;
            const newSections: SectionType[] = selections.map((sel: string, idx: number) => ({
                id: sel,
                title: sel,
                content: markdownSections[idx] || ""
            }));
            setSections(newSections);
            setCheckedSections(selections);
        } else {
            (async () => {
                const loadedSections = await loadSections();
                const loadedChecked = await loadCheckedSections();
                const loadedGitView = await loadGitView();
                if (loadedSections) setSections(loadedSections);
                if (loadedChecked) setCheckedSections(loadedChecked);
                if (typeof loadedGitView === "boolean") setIsGitView(loadedGitView);
            })();
        }
    }, []);

    // Save sections to store when sections change
    useEffect(() => {
        saveSections(sections);
    }, [sections]);

    // Save checkedSections to store when checkedSections change
    useEffect(() => {
        saveCheckedSections(checkedSections);
    }, [checkedSections]);

    // Save Git-View switch to store when isGitView changes
    useEffect(() => {
        saveGitView(isGitView);
    }, [isGitView]);

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
    const handleReset = async () => {
        setSections([]);
        setCheckedSections([]);
        setMarkdown("");
        // Remove from Tauri store as well
        await tauriStore.delete("sections");
        await tauriStore.delete("checkedSections");
        await tauriStore.delete("isGitView");
    };

    // This is used to separate sections in the markdown output
    const SECTION_DELIMITER = "\u2063"; // Using a Unicode character as a delimiter for now

    // Update markdown when checkedSections or sections change
    useEffect(() => {
        // Only include sections that are checked, in the current order of checkedSections
        const checked = sections.filter(s => checkedSections.includes(s.id));
        setMarkdown(checked.map(s => s.content).join(SECTION_DELIMITER));
    }, [sections, checkedSections]);

    // --- Dynamic TOC logic ---
    // Only render and update TOC if "Table of Contents" is in checkedSections
    const showTOC = checkedSections.includes("Table of Contents");

    return (
        <>
        <Header markdown={markdown} onReset={handleReset} />
        {/* Dynamic TOC logic: updates the TOC section whenever sections or order change */}
        {showTOC && (
            <DynamicTOC
                sections={sections.filter(s => checkedSections.includes(s.id))}
                onUpdateTOC={updateTOCSection}
            />
        )}
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
                                <MonacoEditorWrapper
                                    value={markdown}
                                    onChange={(val) => {
                                        const newContents = val.split(SECTION_DELIMITER);
                                        setSections(prevSections =>
                                        prevSections.map((section, idx) => ({
                                            ...section,
                                            content: newContents[idx] !== undefined ? newContents[idx] : ""
                                        }))
                                        );
                                    }}
                                    height="77vh"
                                    width="75%"
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
                                    <Heading m={4} textAlign={"center"}>
                                        Selections
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
                                    <Heading textAlign={"center"}>
                                        Selections
                                    </Heading>
                                    <Flex justifyContent="center" mb={4}>
                                        <PreviewSwitch isGitView={isGitView} setIsGitView={setIsGitView} />
                                    </Flex>
                                    <Selections
                                        selectedSections={sections.map(s => s.id)}
                                        checkedSections={checkedSections}
                                        onToggle={handleToggleSection}
                                        onReorder={handleReorderSections}
                                    />
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
