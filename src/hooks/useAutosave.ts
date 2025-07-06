import { useEffect, useRef } from "react";
import { saveSections, loadSections, Section } from "@/utils/saveRestore";

export function useAutosave(
  sections: Section[],
  setSections: (sections: Section[]) => void
) {
  // Load draft on mount
  useEffect(() => {
    loadSections().then((draft) => {
      if (draft) setSections(draft);
    });
    // eslint-disable-next-line
  }, []);

  // Autosave every 5 seconds if sections change
  const prevSections = useRef<Section[] | null>(null);

  useEffect(() => {
    if (
      prevSections.current &&
      JSON.stringify(prevSections.current) === JSON.stringify(sections)
    ) {
      return;
    }
    prevSections.current = sections;

    const interval = setInterval(() => {
      saveSections(sections);
    }, 5000);

    return () => clearInterval(interval);
  }, [sections]);
}