import { create } from 'zustand';
import { createTauriStore, setAutosave } from '@tauri-store/zustand';
import type { Draft, SaveStatus } from '../types/types';

type EditorStore = {
    draft: Draft;
    setDraft: (draft: Draft) => void;
    resetDraft: () => void;
    addDraftSection: (section: { id: string; title: string; content: string }) => void;
    saveStatus: SaveStatus;
    lastSaved: number | null;
    error: string | null;
    setSaveStatus: (status: SaveStatus) => void;
    setError: (error: string | null) => void;
    saveDraft: () => Promise<void>;
};


export const useEditorStore = create<EditorStore>((set) => ({
    draft: {
        sections: [],
        selections: [],
        markdown: '',
    },
    setDraft: (draft) => set({ draft }),
    resetDraft: () => set({
        draft: {
            sections: [],
            selections: [],
            markdown: '',
        }
    }),
    addDraftSection: (section) => set((state) => ({
        draft: {
            ...state.draft,
            sections: [...state.draft.sections, section],
        },
    })),
    saveStatus: "idle",
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
}));

// For Tauri persistence and multi-window sync
export const tauriHandler = createTauriStore('editor-store', useEditorStore);

await tauriHandler.start();
await setAutosave(30); // Set autosave interval to 30 seconds
