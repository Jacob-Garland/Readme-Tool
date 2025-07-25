import { create } from 'zustand';
import { createTauriStore, setAutosave, clearAutosave } from '@tauri-store/zustand';
import type { Draft, SaveStatus } from '../types/types';

type EditorStore = {
    // Draft management
    draft: Draft;
    setDraft: (draft: Draft) => void;
    resetDraft: () => void;
    addDraftSection: (section: { id: string; title: string; content: string }) => void;
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
            // Add section to sections and selections
            const newSections = [...state.draft.sections, section];
            const newSelections = [...state.draft.selections, section.id];
            // Rebuild markdown
            const title = state.draft.title || "";
            const SECTION_DELIMITER = "\u2063";
            let newMarkdown = newSections.filter(s => newSelections.includes(s.id)).map(s => s.content).join(SECTION_DELIMITER);
            if (title && title.trim()) {
                newMarkdown = `# ${title.trim()}\n\n` + newMarkdown;
            }
            newMarkdown = newMarkdown.replace(/^(# .+\n+)+/, title && title.trim() ? `# ${title.trim()}\n\n` : "");
            return {
                draft: {
                    ...state.draft,
                    sections: newSections,
                    selections: newSelections,
                    markdown: newMarkdown,
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

// For Tauri persistence and multi-window sync
export const tauriHandler = createTauriStore('editor-store', useEditorStore);

await tauriHandler.start();
