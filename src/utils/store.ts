import { Draft, AppSettings } from '../types';
import { invoke } from '@tauri-apps/api/core';

// --- Settings State ---
export async function getSettings() {
  return await invoke('get_settings');
}

export async function setSettings(settings: AppSettings) {
  return await invoke('set_settings', { settings });
}

export async function clearSettings() {
  return await invoke('clear_settings');
}

// --- Editor Draft State ---
export async function getDraft() {
  return await invoke('get_draft');
}

export async function setDraft(draft: Draft) {
  return await invoke('set_draft', { draft });
}

export async function clearDraft() {
  return await invoke('clear_draft');
}