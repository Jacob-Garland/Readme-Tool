import { create } from 'zustand';
import { createTauriStore, setAutosave, clearAutosave } from '@tauri-store/zustand';
import type { Draft, SaveStatus } from '../types/types';

type EditorStore = {
    // Draft management
    draft: Draft;
    setDraft: (draft: Draft) => void;
    resetDraft: () => void;
    addDraftSection: (section: { id: string; title: string; content: string }) => void;
    updateDraftSection: (id: string, updates: { title?: string; content?: string }) => void;
    reorderSections: (newOrder: string[]) => void;
    setTitle: (title: string, checked?: boolean) => void;
    toggleSectionSelection: (id: string, checked: boolean) => void;
    saveDraft: () => Promise<void>;
    // Save functionality
    saveStatus: SaveStatus;
    resetSaveStatus: () => void;
    setSaveStatus: (status: SaveStatus) => void;
    lastSaved: number | null;
    autoSaveEnabled: boolean;
    toggleAutoSave: (enabled: boolean) => void;
    // Error handling
    error: string | null;
    setError: (error: string | null) => void;
};

export const useEditorStore = create<EditorStore>((set, get) => {
    // Track if there are unsaved changes
    let isDirty = false;
    let debounceTimer: ReturnType<typeof setTimeout> | null = null;

    // Debounce logic for autosave (fires 15s after last change)
    const debouncedAutosave = () => {
        if (debounceTimer) clearTimeout(debounceTimer);
        debounceTimer = setTimeout(async () => {
            if (get().autoSaveEnabled && isDirty) {
                await get().saveDraft();
                isDirty = false;
            }
        }, 15000);
    };

    return {
        toggleSectionSelection: (id: string, checked: boolean) => set((state) => {
            let selections = state.draft.selections;
            if (checked) {
                if (!selections.includes(id)) selections = [...selections, id];
            } else {
                selections = selections.filter((selId: string) => selId !== id);
            }
            return {
                draft: {
                    ...state.draft,
                    selections,
                    markdown: buildMarkdown({
                        sections: state.draft.sections,
                        selections,
                        title: state.draft.title,
                    }),
                },
            };
        }),
        draft: {
            sections: [],
            selections: [],
            markdown: '',
        },
        setDraft: (draft) => {
            set({ draft });
            isDirty = true;
            if (get().autoSaveEnabled) {
                debouncedAutosave();
            }
        },
        resetDraft: () => {
            set({
                draft: {
                    sections: [],
                    selections: [],
                    markdown: '',
                }
            });
            isDirty = false;
            if (debounceTimer) clearTimeout(debounceTimer);
            clearAutosave();
        },
        addDraftSection: (section) => set((state) => {
            // Add section to sections and selections, always preserve ids
            const newSections = [...state.draft.sections, section];
            const newSelections = [...state.draft.selections, section.id];
            return {
                draft: {
                    ...state.draft,
                    sections: newSections,
                    selections: Array.from(new Set(newSelections)),
                    markdown: buildMarkdown({
                        sections: newSections,
                        selections: Array.from(new Set(newSelections)),
                        title: state.draft.title,
                    }),
                },
            };
        }),

        updateDraftSection: (id, updates) => set((state) => {
            // Update a section by id, preserving id and checked state
            const newSections = state.draft.sections.map(s =>
                s.id === id ? { ...s, ...updates } : s
            );
            return {
                draft: {
                    ...state.draft,
                    sections: newSections,
                    markdown: buildMarkdown({
                        sections: newSections,
                        selections: state.draft.selections,
                        title: state.draft.title,
                    }),
                },
            };
        }),

        reorderSections: (newOrder) => set((state) => {
            // Always preserve __title__ in selections if it was checked before
            let selections = state.draft.selections;
            if (selections.includes("__title__") && !newOrder.includes("__title__")) {
                newOrder = ["__title__", ...newOrder.filter(id => id !== "__title__")];
            }
            // Reorder sections array to match newOrder (excluding __title__)
            const newSections = newOrder
                .filter(id => id !== "__title__")
                .map(id => state.draft.sections.find(s => s.id === id))
                .filter((s): s is { id: string; title: string; content: string } => Boolean(s));
            // Rebuild selections to match newOrder, always keep __title__ at front if checked
            let newSelections = newOrder.filter(id => selections.includes(id));
            if (selections.includes("__title__") && !newSelections.includes("__title__")) {
                newSelections = ["__title__", ...newSelections];
            }
            return {
                draft: {
                    ...state.draft,
                    sections: newSections,
                    selections: newSelections,
                    markdown: buildMarkdown({
                        sections: newSections,
                        selections: newSelections,
                        title: state.draft.title,
                    }),
                },
            };
        }),

        setTitle: (title, checked = true) => set((state) => {
            // Always add __title__ to selections if checked, remove if not
            let selections = state.draft.selections.filter(id => id !== "__title__");
            if (checked) {
                selections = ["__title__", ...selections];
            }
            return {
                draft: {
                    ...state.draft,
                    title,
                    selections,
                    markdown: buildMarkdown({
                        sections: state.draft.sections,
                        selections,
                        title,
                    }),
                },
            };
        }),
        saveStatus: "idle",
        resetSaveStatus: () => set({ saveStatus: "idle", lastSaved: null, error: null }),
        lastSaved: null,
        error: null,
        setSaveStatus: (status) => set({ saveStatus: status }),
        setError: (error) => set({ error }),
        saveDraft: async () => {
            set({ saveStatus: "saving", error: null });
            try {
                // If using tauriHandler, this will persist automatically
                set({ saveStatus: "saved", lastSaved: Date.now() });
            } catch (e: any) {
                set({ saveStatus: "error", error: e?.message || "Save failed" });
            }
        },
        autoSaveEnabled: true,
        toggleAutoSave: async (enabled) => {
            set({ autoSaveEnabled: enabled });
            if (debounceTimer) clearTimeout(debounceTimer);
            if (enabled) {
                await setAutosave(15000); // 15 seconds
            } else {
                clearAutosave();
            }
        },
    };
});

// Helper to build markdown from sections, selections, and title
interface BuildMarkdownArgs {
  sections: { id: string; content: string }[];
  selections: string[];
  title?: string;
}
function buildMarkdown({ sections, selections, title }: BuildMarkdownArgs) {
  // Only include sections that are checked, in the current order of checkedSections
  const checked = sections.filter(s => selections.includes(s.id));
  const cleanSection = (s: string) => s.replace(/^\n+|\n+$/g, "").trim();
  let newMarkdown = checked.map(s => cleanSection(s.content)).join('\n\n\n');
  if (title && title.trim() && selections.includes("__title__")) {
    // Remove all H1s for this title from the markdown, then prepend a single one
    const h1Regex = new RegExp(`^# ${title.trim()}\\s*\\n*`, 'gm');
    newMarkdown = newMarkdown.replace(h1Regex, '');
    newMarkdown = `# ${title.trim()}\n\n\n` + newMarkdown.replace(/^\n+/, "");
  }
  return newMarkdown;
}

// For Tauri persistence and multi-window sync
export const tauriHandler = createTauriStore('editor-store', useEditorStore);

await tauriHandler.start();