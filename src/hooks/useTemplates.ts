import { useCallback } from "react";
import { templates } from "../templates/templates";

export function useTemplates() {
    // Get all section titles
    const getSectionTitles = useCallback(() => Object.keys(templates), []);
    // Get a template by section title
    const getTemplate = useCallback((title: string) => templates[title] || "", []);
    return { getSectionTitles, getTemplate };
}
