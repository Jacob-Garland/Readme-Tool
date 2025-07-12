import { create } from 'zustand';
import { createTauriStore } from '@tauri-store/zustand';
import type { SaveStatus } from '../types/types';

interface SaveStore {
  markdown: string;
  status: SaveStatus;
  lastSaved: number | null;
  error: string | null;
  setMarkdown: (markdown: string) => void;
  save: () => Promise<void>;
  setStatus: (status: SaveStatus) => void;
  setError: (error: string | null) => void;
}


export const useSaveStore = create<SaveStore>((set) => ({
  markdown: "",
  status: "idle",
  lastSaved: null,
  error: null,
  setMarkdown: (markdown: string) => set({ markdown }),
  setStatus: (status: SaveStatus) => set({ status }),
  setError: (error: string | null) => set({ error }),
  save: async () => {
    set({ status: "saving", error: null });
    try {
      // Persist markdown to Tauri store (handled by createTauriStore)
      // Optionally, you could trigger a file save or other side effect here
      set({ status: "saved", lastSaved: Date.now() });
    } catch (e: any) {
      set({ status: "error", error: (e as Error)?.message || "Save failed" });
    }
  },
}));

export const tauriHandler = createTauriStore('save-store', useSaveStore);

await tauriHandler.start();
