import { create } from 'zustand';
import { createTauriStore } from '@tauri-store/zustand';
import type { AppSettings } from '@/types/types';

type AppStore = {
    settings: AppSettings | null;
    setSettings: (settings: AppSettings) => void;
    clearSettings: () => void;
};

export const useAppStore = create<AppStore>((set) => ({
    settings: null,
    setSettings: (settings) => {
        set({ settings });
    },
    clearSettings: () => {
        set({ settings: null });
    },
}));

export const tauriHandler = createTauriStore('app-store', useAppStore);

await tauriHandler.start();
