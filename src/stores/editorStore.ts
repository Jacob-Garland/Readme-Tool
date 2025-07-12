import { create } from 'zustand';
import { createTauriStore } from '@tauri-store/zustand';

type EditorStore = {
};

export const useEditorStore = create<EditorStore>()(

);

export const tauriHandler = createTauriStore();
