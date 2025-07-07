import { load } from '@tauri-apps/plugin-store';

// Create a new store or load the existing one
const store = await load('readme-draft.json', { autoSave: true });

// --- Section State ---
export async function saveSections(sections: any[]) {
  await store.set('sections', sections);
}

export async function loadSections(): Promise<any[] | null> {
  return (await store.get('sections')) ?? [];
}

export async function saveCheckedSections(checkedSections: string[]) {
  await store.set('checkedSections', checkedSections);
}

export async function loadCheckedSections(): Promise<string[]> {
  return (await store.get('checkedSections')) ?? [];
}

// --- Theme (Light/Dark) ---
export async function saveTheme(theme: 'light' | 'dark') {
  await store.set('theme', theme);
}

export async function loadTheme(): Promise<'light' | 'dark' | null> {
  return (await store.get('theme')) ?? null;
}

// --- Git-View Switch ---
export async function saveGitView(isGitView: boolean) {
  await store.set('isGitView', isGitView);
}

export async function loadGitView(): Promise<boolean> {
  return (await store.get('isGitView')) ?? true;
}

// Function to save the current state of the store to the json file (manual save)
export async function saveStore() {
  try {
    await store.save();
    console.log('[Store] Draft saved.');
  } catch (err) {
    console.error('[Store] Failed to save draft:', err);
    throw err;
  }
}