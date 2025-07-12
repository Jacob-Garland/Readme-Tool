import { create } from 'zustand';
import { createTauriStore } from '@tauri-store/zustand';
import { Draft } from '../types/types';

type EditorStore = {
    draft: Draft;
    setDraft: (draft: Draft) => void;
    resetDraft: () => void;
    updateDraftSection: (id: string, content: string) => void;
    addDraftSection: (section: { id: string; title: string; content: string }) => void;
    reorderDraftSections: (fromIndex: number, toIndex: number) => void;
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
    updateDraftSection: (id, content) => set((state) => ({
        draft: {
            ...state.draft,
            sections: state.draft.sections.map((section) =>
                section.id === id ? { ...section, content } : section
            ),
        },
    })),
    addDraftSection: (section) => set((state) => ({
        draft: {
            ...state.draft,
            sections: [...state.draft.sections, section],
        },
    })),
    reorderDraftSections: (fromIndex, toIndex) => set((state) => {
        const sections = [...state.draft.sections];
        const [removed] = sections.splice(fromIndex, 1);
        sections.splice(toIndex, 0, removed);
        return {
            draft: {
                ...state.draft,
                sections,
            },
        };
    }),
}));

export const tauriHandler = createTauriStore('editor-store', useEditorStore);
