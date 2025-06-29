import { useCallback } from "react";

const templates: Record<string, string> = {
  Introduction: `# Introduction\n\nDescribe your project here.\n`,
  Installation: `## Installation\n\nInstructions on how to install.\n`,
  Usage: `## Usage\n\nHow to use the project.\n`,
  Contributing: `## Contributing\n\nContribution guidelines.\n`,
  "Tech Stack": `## Tech Stack\n\nList the technologies used.\n`,
  Credits: `## Credits\n\nAcknowledge contributors and sources.\n`,
  Features: `## Features\n\nList of features.\n`,
  Deployment: `## Deployment\n\nDeployment instructions.\n`,
  "Run Locally": `## Run Locally\n\nSteps to run the project locally.\n`,
  "Environment Variables": `## Environment Variables\n\nList and explain environment variables.\n`,
  Requirements: `## Requirements\n\nList requirements for the project.\n`,
};

export function useTemplates() {
  // Get all section titles
  const getSectionTitles = useCallback(() => Object.keys(templates), []);
  // Get a template by section title
  const getTemplate = useCallback((title: string) => templates[title] || "", []);
  return { getSectionTitles, getTemplate };
}
