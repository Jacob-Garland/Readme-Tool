import { BaseDirectory, writeTextFile, readTextFile, remove } from '@tauri-apps/plugin-fs';
import { exists } from '@tauri-apps/plugin-fs';

export type Section = {
  id: string;
  title: string;
  content: string;
};

const FILE_NAME = 'readme-draft.json';
const FILE_PATH = FILE_NAME; // For tauri-fs, path is just the filename in AppData
const BASE_DIR = BaseDirectory.AppData;

export async function saveSections(sections: Section[]): Promise<void> {
  try {
    const content = JSON.stringify(sections, null, 2);
    await writeTextFile(FILE_PATH, content, { baseDir: BASE_DIR });
    console.log('[Storage] Draft saved.');
  } catch (err) {
    console.error('[Storage] Failed to save draft:', err);
    throw err;
  }
}

export async function loadSections(): Promise<Section[] | null> {
  try {
    const fileExists = await exists(FILE_PATH, { baseDir: BASE_DIR });
    if (!fileExists) return null;

    const content = await readTextFile(FILE_PATH, { baseDir: BASE_DIR });
    const sections = JSON.parse(content);

    if (!Array.isArray(sections)) throw new Error('Invalid format');

    return sections as Section[];
  } catch (err) {
    console.error('[Storage] Failed to load draft:', err);
    return null;
  }
}

export async function deleteDraft(): Promise<void> {
  try {
    const fileExists = await exists(FILE_PATH, { baseDir: BASE_DIR });
    if (fileExists) await remove(FILE_PATH, { baseDir: BASE_DIR });
    console.log('[Storage] Draft deleted.');
  } catch (err) {
    console.error('[Storage] Failed to delete draft:', err);
    throw err;
  }
}
