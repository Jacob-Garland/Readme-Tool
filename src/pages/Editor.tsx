import { Tabs, Box, Flex, HStack } from "@chakra-ui/react";
import { nanoid } from 'nanoid';
import { useCallback } from "react";
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
    // Extract title from markdown (first H1) and keep it in sync
    const title = useEditorStore((s) => s.draft.title || "");
    const setDraft = useEditorStore((s) => s.setDraft);
    const updateDraftSection = useEditorStore((s) => s.updateDraftSection);
    // Provide default settings: Git-View
    const settings = useAppStore((s) => s.settings) || { preview: true };
    const isGitView = settings.preview ?? true;
    const setSettings = useAppStore((s) => s.setSettings);

    const draft: Draft = {
        sections,
        selections: checkedSections,
        markdown,
        title,
    };

    // Helper to update the TOC section content dynamically
    const updateTOCSection = useCallback((tocMarkdown: string) => {
        const tocSection = sections.find(s => s.title === "Table of Contents");
        if (!tocSection) return;
        if (tocSection.content === tocMarkdown) return;
        updateDraftSection(tocSection.id, { content: tocMarkdown });
    }, [sections, updateDraftSection]);


    // Handler to update preview mode in settings
    const handleSetPreview = (value: boolean | ((prev: boolean) => boolean)) => {
        const next = typeof value === "function" ? value(isGitView) : value;
        setSettings({ ...settings, preview: next });
    };

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
                                        // Extract H1 as title, update draft.title, and update sections
                                        const match = val.match(/^# (.+)$/m);
                                        const newTitle = match ? match[1].trim() : "";
                                        // Remove all H1s at the top for section splitting
                                        const cleanedMarkdown = val.replace(/^(# .+\n+)+/, "");
                                        // Split on two or more newlines to get section contents
                                        const newContents = cleanedMarkdown.split(/\n{2,}/);
                                        // Robustly map newContents to sections by id, preserving ids and checked state
                                        let updatedSections: Section[] = [];
                                        let usedIds: Set<string> = new Set();
                                        for (let idx = 0; idx < newContents.length; idx++) {
                                            const content = newContents[idx];
                                            // Extract first H2 as section title
                                            const h2Match = content.match(/^##\s+(.+)$/m);
                                            const title = h2Match ? h2Match[1].trim() : "";
                                            // Try to match by id (array index), fallback to unused section
                                            let existing = sections[idx];
                                            if (!existing) {
                                                // Try to find a section with the same title that hasn't been used yet
                                                const found = sections.find(s => s.title === title && !usedIds.has(s.id));
                                                if (found) existing = found;
                                            }
                                            if (existing) {
                                                usedIds.add(existing.id);
                                                updatedSections.push({
                                                    ...existing,
                                                    content,
                                                    title: title || existing.title,
                                                });
                                            } else {
                                                // New section: generate unique id with nanoid
                                                const id = nanoid();
                                                updatedSections.push({
                                                    id,
                                                    title,
                                                    content,
                                                });
                                            }
                                        }
                                        // --- Robust title handling ---
                                        // Always keep __title__ in selections if it was checked before
                                        let selections = draft.selections;
                                        if (checkedSections.includes("__title__") && !selections.includes("__title__")) {
                                            selections = ["__title__", ...selections.filter(id => id !== "__title__")];
                                        }
                                        setDraft({ ...draft, sections: updatedSections, title: newTitle, selections });
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
                                    <Selections />
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
                                    <Selections />
                                </Box>
                            </HStack>
                        </Tabs.Content>
                    </Tabs.ContentGroup>
                </Tabs.Root>
            </Box>

            <BuilderMenu
                onInsertBadge={handleInsertBadge}
                onInsertMarkdownComponent={handleInsertMarkdownComponent}
                selections={checkedSections}
            />
        </Flex>
        </>
    );
};

export default Editor;
