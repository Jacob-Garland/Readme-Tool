import React, { useEffect } from "react";

interface DynamicTOCProps {
  sections: { id: string; title: string }[];
  onUpdateTOC: (tocMarkdown: string) => void;
}

// Utility to create anchor links from section titles
const toAnchor = (title: string) =>
  `#${title.toLowerCase().replace(/[^a-z0-9 ]/g, "").replace(/\s+/g, "-")}`;

const DynamicTOC: React.FC<DynamicTOCProps> = ({ sections, onUpdateTOC }) => {
  useEffect(() => {
    // Exclude the TOC section itself and the Title section from the links (by id or title)
    const filtered = sections.filter(
      (s) =>
        s.title !== "Table of Contents" &&
        s.title !== "Title" &&
        s.id !== "Table of Contents" &&
        s.id !== "Title" &&
        s.id !== "Project Title"
    );
    const tocLinks = filtered.map(
      (s) => `- [${s.title}](${toAnchor(s.title)})`
    );
    const tocMarkdown = `## Table of Contents\n\n${tocLinks.join("\n")}\n\n`;
    onUpdateTOC(tocMarkdown);
  }, [sections, onUpdateTOC]);

  return null; // This component only updates the TOC markdown
};

export default DynamicTOC;
