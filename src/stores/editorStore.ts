import { create } from 'zustand';
import { createTauriStore, setAutosave, clearAutosave } from '@tauri-store/zustand';
import { parseDocument } from "../utils/parseDocument"; // <-- Make sure this exports a function returning { sections, title }
import { Section } from "@/types/types";
import type { Draft, SaveStatus } from '../types/types';

type EditorStore = {
    updateTOCSection: () => void;
    // Draft management
    draft: Draft;
    setDraft: (draft: Draft) => void;
    resetDraft: () => void;
    addDraftSection: (section: { id: string; title: string; content: string }) => void;
    updateDraftSection: (id: string, updates: { title?: string; content?: string }) => void;
    reorderSections: (newOrder: string[]) => void;
    setTitle: (title: string, checked?: boolean) => void;
    toggleSectionSelection: (id: string, checked: boolean) => void;
    saveDraft: () => Promise<void>;
    // Save functionality
    saveStatus: SaveStatus;
    resetSaveStatus: () => void;
    setSaveStatus: (status: SaveStatus) => void;
    lastSaved: number | null;
    autoSaveEnabled: boolean;
    toggleAutoSave: (enabled: boolean) => void;
    // Error handling
    error: string | null;
    setError: (error: string | null) => void;
};

export const useEditorStore = create<EditorStore>((set, get) => ({
  draft: {
    sections: [],
    selections: [],
    markdown: "",
    title: "",
  },
  updateTOCSection: () => set((state) => {
      const newDraft = updateTOCSectionInDraft(state.draft);
      return { draft: newDraft };
  }),
  toggleSectionSelection: (id: string, checked: boolean) => set((state) => {
      let selections = state.draft.selections;
      if (checked) {
          if (!selections.includes(id)) selections = [...selections, id];
      } else {
          selections = selections.filter((selId: string) => selId !== id);
      }
      // Update ToC before markdown
      const draftWithTOC = updateTOCSectionInDraft({
          ...state.draft,
          selections
      });
      return {
          draft: {
              ...draftWithTOC,
              selections,
              markdown: buildMarkdown({
                  sections: draftWithTOC.sections,
                  selections,
                  title: draftWithTOC.title,
              }),
          },
      };
  }),
  setDraft: (draft) => {
      // Always update ToC before setting draft
      const draftWithTOC = updateTOCSectionInDraft(draft);
      set({ draft: draftWithTOC });
      isDirty = true;
      if (get().autoSaveEnabled) {
          debouncedAutosave();
      }
  },
  resetDraft: () => {
      set({
          draft: {
              sections: [],
              selections: [],
              markdown: '',
          }
      });
      isDirty = false;
      if (debounceTimer) clearTimeout(debounceTimer);
      clearAutosave();
  },
  addDraftSection: (section) => set((state) => {
      // Prevent duplicate ToC section
      if (section.id === "toc" && state.draft.sections.some(s => s.id === "toc")) {
          // If already exists, just check it if unchecked
          let newSelections = state.draft.selections;
          if (!newSelections.includes("toc")) {
              newSelections = [...newSelections, "toc"];
          }
          const draftWithTOC = updateTOCSectionInDraft({
              ...state.draft,
              selections: newSelections,
          });
          return {
              draft: {
                  ...draftWithTOC,
                  selections: newSelections,
                  markdown: buildMarkdown({
                      sections: draftWithTOC.sections,
                      selections: newSelections,
                      title: draftWithTOC.title,
                  }),
              },
          };
      }
      // Add section to sections and selections, always preserve ids
      const newSections = [...state.draft.sections, section];
      const newSelections = [...state.draft.selections, section.id];
      // Update ToC before markdown
      const draftWithTOC = updateTOCSectionInDraft({
          ...state.draft,
          sections: newSections,
          selections: Array.from(new Set(newSelections)),
      });
      return {
          draft: {
              ...draftWithTOC,
              sections: newSections,
              selections: Array.from(new Set(newSelections)),
              markdown: buildMarkdown({
                  sections: draftWithTOC.sections,
                  selections: Array.from(new Set(newSelections)),
                  title: draftWithTOC.title,
              }),
          },
      };
  }),

  // Call this whenever markdown changes
  syncSectionsFromMarkdown: (markdown: string) => {
    const { sections, title } = parseDocument(markdown);
    // Keep selections in sync: add new section ids, remove missing ones
    const prevSelections = get().draft.selections;
    const newIds = sections.map(s => s.id);
    const selections = prevSelections.filter(id => newIds.includes(id));
    // Optionally, auto-check new sections
    sections.forEach(s => {
      if (!selections.includes(s.id)) selections.push(s.id);
    });
    set(state => ({
      draft: {
        ...state.draft,
        markdown,
        sections,
        title,
        selections,
      }
    }));
  },

  updateDraftSection: (id, updates) => set(state => {
    const sections = state.draft.sections.map(s =>
      s.id === id ? { ...s, ...updates } : s
    );
    // Rebuild markdown from sections (implement buildMarkdownFromSections)
    const markdown = buildMarkdownFromSections(sections, state.draft.title);
    return {
      draft: {
        ...state.draft,
        sections,
        markdown,
      }
    };
  }),

  reorderSections: (newOrder) => set((state) => {
      // Only reorder the selections array (IDs), not the sections array (objects)
      let selections = state.draft.selections;
      if (selections.includes("__title__") && !newOrder.includes("__title__")) {
          newOrder = ["__title__", ...newOrder.filter(id => id !== "__title__")];
      }
      // Rebuild selections to match newOrder, always keep __title__ at front if checked
      let newSelections = newOrder.filter(id => selections.includes(id));
      if (selections.includes("__title__") && !newSelections.includes("__title__")) {
          newSelections = ["__title__", ...newSelections];
      }
      // Update ToC before markdown
      const draftWithTOC = updateTOCSectionInDraft({
          ...state.draft,
          selections: newSelections,
      });
      return {
          draft: {
              ...draftWithTOC,
              selections: newSelections,
              markdown: buildMarkdown({
                  sections: draftWithTOC.sections,
                  selections: newSelections,
                  title: draftWithTOC.title,
              }),
          },
      };
  }),

  setTitle: (title, checked = true) => set((state) => {
      // Always add __title__ to selections if checked, remove if not
      let selections = state.draft.selections.filter(id => id !== "__title__");
      if (checked) {
          selections = ["__title__", ...selections];
      }
      // Update ToC before markdown
      const draftWithTOC = updateTOCSectionInDraft({
          ...state.draft,
          title,
          selections,
      });
      return {
          draft: {
              ...draftWithTOC,
              title,
              selections,
              markdown: buildMarkdown({
                  sections: draftWithTOC.sections,
                  selections,
                  title,
              }),
          },
      };
  }),
  saveStatus: "idle",
  resetSaveStatus: () => set({ saveStatus: "idle", lastSaved: null, error: null }),
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
  autoSaveEnabled: true,
  toggleAutoSave: async (enabled) => {
      set({ autoSaveEnabled: enabled });
      if (debounceTimer) clearTimeout(debounceTimer);
      if (enabled) {
          await setAutosave(15000); // 15 seconds
      } else {
          clearAutosave();
      }
  },
}));

// Helper to build markdown from sections (with section-id comments)
function buildMarkdownFromSections(sections: Section[], title?: string) {
  let md = "";
  if (title) md += `# ${title}\n\n`;
  for (const s of sections) {
    md += `<!-- section-id: ${s.id} -->\n`;
    md += `## ${s.title}\n\n`;
    md += `${s.content}\n\n`;
  }
  return md.trim();
}

// For Tauri persistence and multi-window sync
export const tauriHandler = createTauriStore('editor-store', useEditorStore);

await tauriHandler.start();