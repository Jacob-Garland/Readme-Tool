import { AppSettings } from '../types/types';
import { Store } from '@tauri-apps/plugin-store';

let store: Store | null = null;

async function getStore(): Promise<Store> {
  if (!store) {
    store = await Store.load('store.json');
  }
  return store;
}

// --- Settings State ---
export async function getSettings(): Promise<AppSettings | null> {
  const s = await getStore();
  return (await s.get('settings')) as AppSettings | null;
}

export async function setSettings(settings: AppSettings): Promise<void> {
  const s = await getStore();
  await s.set('settings', settings);
  await s.save();
}

export async function clearSettings(): Promise<void> {
  const s = await getStore();
  await s.delete('settings');
  await s.save();
}
