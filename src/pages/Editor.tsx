import { Tabs, Box, Flex, HStack } from "@chakra-ui/react";
import { useEffect, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Header from "../components/Header";
import MonacoEditorWrapper from "../components/MonacoEditor";
import BuilderMenu from "../components/BuilderMenu";
import Selections from "../components/Selections";
import PreviewSwitch from "../components/ui/PreviewSwitch";
import { templates } from "../utils/templates";
import DynamicTOC from "../hooks/DynamicTOC";
import { useAppStore } from "../stores/appStore";
import { useEditorStore } from "../stores/editorStore";
import type { Draft, Section } from "../types/types";

const Editor = () => {
    const sections = useEditorStore((s) => s.draft.sections);
    const checkedSections = useEditorStore((s) => s.draft.selections);
    const markdown = useEditorStore((s) => s.draft.markdown);
    const setDraft = useEditorStore((s) => s.setDraft);
    const addDraftSection = useEditorStore((s) => s.addDraftSection);
    // Provide default settings: Git-View
    const settings = useAppStore((s) => s.settings) || { preview: true };
    const isGitView = settings.preview ?? true;
    const setSettings = useAppStore((s) => s.setSettings);

    const draft: Draft = {
        sections,
        selections: checkedSections,
        markdown
    };

    // Helper to update the TOC section content dynamically
    const updateTOCSection = useCallback((tocMarkdown: string) => {
        const idx = sections.findIndex(s => s.id === "Table of Contents");
        if (idx === -1) return;
        if (sections[idx].content === tocMarkdown) return;
        const updated = [...sections];
        updated[idx] = { ...updated[idx], content: tocMarkdown };
        setDraft({ ...draft, sections: updated });
    }, [sections, draft, setDraft]);


    // Handler to update preview mode in settings
    const handleSetPreview = (value: boolean | ((prev: boolean) => boolean)) => {
        const next = typeof value === "function" ? value(isGitView) : value;
        setSettings({ ...settings, preview: next });
    };

    // Add section by id (only adds to checkedSections, not sections array)
    const handleAddSection = (sectionId: string) => {
        // If not already in checkedSections, add it
        if (!checkedSections.includes(sectionId)) {
            setDraft({ ...draft, selections: [...checkedSections, sectionId] });
        }
        // If not already in sections, add from template
        if (!sections.find(s => s.id === sectionId)) {
            const template = templates.find(t => t.id === sectionId);
            if (template) {
                addDraftSection({ ...template });
            }
        }
    };

    // Toggle checked state
    const handleToggleSection = (id: string, checked: boolean) => {
        if (checked) {
            if (!checkedSections.includes(id)) {
                setDraft({ ...draft, selections: [...checkedSections, id] });
            }
        } else {
            setDraft({ ...draft, selections: checkedSections.filter(t => t !== id) });
        }
    };

    // Reorder sections (affects both checkedSections and sections array order)
    const handleReorderSections = (newOrder: string[]) => {
        // Prevent Title from being reordered
        let order = newOrder;
        if (checkedSections[0] === 'Title' && newOrder[0] !== 'Title') {
            order = ['Title', ...newOrder.filter(id => id !== 'Title')];
        }
        setDraft({
            ...draft,
            selections: order.filter(id => checkedSections.includes(id)),
            sections: order.map(id => sections.find(s => s.id === id)).filter(Boolean) as Section[],
        });
    };

    // This is used to separate sections in the markdown output
    const SECTION_DELIMITER = "\u2063"; // Using a Unicode character as a delimiter for now

    // Update markdown when checkedSections or sections change
    useEffect(() => {
        // Only include sections that are checked, in the current order of checkedSections
        const checked = sections.filter(s => checkedSections.includes(s.id));
        setDraft({ ...draft, markdown: checked.map(s => s.content).join(SECTION_DELIMITER) });
    }, [sections, checkedSections]);

    // --- Dynamic TOC logic ---
    // Only render and update TOC if "Table of Contents" is in checkedSections
    const showTOC = checkedSections.includes("Table of Contents");

    // Handler to insert badge markdown into the editor
    function handleInsertBadge(badgeMarkdown: string, opts?: { section?: string }) {
        if (opts?.section && opts.section === "Badges") {
            // Find the Badges section and append the badge
            const updatedSections = sections.map(s =>
                s.id === "Badges"
                    ? { ...s, content: s.content + (s.content.trim() ? "\n" : "") + badgeMarkdown + "\n" }
                    : s
            );
            setDraft({ ...draft, sections: updatedSections });
        } else {
            setDraft({ ...draft, markdown: markdown + (markdown.trim() ? "\n" : "") + badgeMarkdown + "\n" });
        }
    }

    // Handler to insert markdown component directly into markdown (not sections)
    function handleInsertMarkdownComponent(componentId: string) {
        const template = templates.find(t => t.id === componentId);
        if (template) {
            setDraft({ ...draft, markdown: markdown + (markdown.trim() ? "\n" : "") + template.content + "\n" });
        }
    }

    return (
        <>
        <Header markdown={markdown} />
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
                                        // Update each section's content in the store
                                        const updatedSections = sections.map((section, idx) => ({
                                            ...section,
                                            content: newContents[idx] !== undefined ? newContents[idx] : ""
                                        }));
                                        setDraft({ ...draft, sections: updatedSections });
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
                                    bg={{ _light: "purple.100" , _dark: "purple.900" }}
                                    p={4}
                                    boxShadow="md"
                                >
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
                                    bg={{ _light: "purple.100" , _dark: "purple.900" }}
                                    p={4}
                                    boxShadow="md"
                                >
                                    <Flex justifyContent="center" mb={4}>
                                        <PreviewSwitch isGitView={isGitView} setIsGitView={handleSetPreview} />
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

            <BuilderMenu
                onSectionClick={handleAddSection}
                onTitleClick={(title) => {
                  // Remove any existing H1 at the top, then add the new one
                  let newMarkdown = markdown.replace(/^# .+\n+/, "");
                  newMarkdown = `# ${title}\n\n` + newMarkdown;
                  setDraft({ ...draft, markdown: newMarkdown });
                }}
                onInsertBadge={handleInsertBadge}
                onInsertMarkdownComponent={handleInsertMarkdownComponent}
                selections={checkedSections}
            />
        </Flex>
        </>
    );
};

export default Editor;
