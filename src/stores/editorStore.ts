import { create } from 'zustand';
import { createTauriStore } from '@tauri-store/zustand';
import { Draft } from '../types/types';

type EditorStore = {
    draft: Draft;
    setDraft: (draft: Draft) => void;
    resetDraft: () => void;
    addDraftSection: (section: { id: string; title: string; content: string }) => void;
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
}));

export const tauriHandler = createTauriStore('editor-store', useEditorStore);
