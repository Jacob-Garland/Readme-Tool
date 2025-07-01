import { useCallback } from "react";

const templates: Record<string, string> = {
    Title: `# Project Title\n`,
    Introduction: `## About The Project\n\nA brief description of your project here, explaining your motivation for building it and what problem it solves.\n`,
    Installation: `## Installation\n\nInstructions on how to install.\n`,
    Usage: `## Usage\n\nHow to use the project.\n`,
    Contributing: `## Contributing\n\nHere you can explain how others can contribute to your project.\n`,
    "Tech Stack": `## Tech Stack\n\nList the technologies used.\n`,
    Credits: `## Credits\n\nAcknowledge contributors and sources here.\n`,
    Features: `## Features\n\nList of features.\n\n- Feature 1\n- Feature 2\n- Feature 3\n`,
    Deployment: `## Deployment\n\nDeployment instructions.\n`,
    "Run Locally": `## Run Locally\n\nSteps to run the project locally.\n\n1. Clone the repo\n\n\`\`\`bash\n git clone <repo-url>\n\`\`\`\n2. Install dependencies\n\n\`\`\`bash\n cd <repo-name>\n npm install\n\`\`\`\n3. Start the development server\n\n\`\`\`bash\n npm start\n\`\`\``,
    "Environment Variables": `## Environment Variables\n\nList and explain environment variables here.\n\nTo run this project, you will need to add the following environment variables to your .env file:\n\n\`API_Key\`\n`,
    Requirements: `## Requirements\n\nList requirements for the project, if any.\n`,
    FAQ: `## FAQ\n\nFrequently Asked Questions.\n\nYou can add common questions and answers here to help users understand your project better.\n\n1. **Question 1**: Answer to question 1.\n2. **Question 2**: Answer to question 2.\n3. **Question 3**: Answer to question 3.\n`,
    Badges: `## Badges\n\nAdd badges here for your project.\n\n Check out the badges hosted by [shields.io](https://shields.io/).\n`,
    License: `## License\n\nPlease refer to the LICENSE.md file for more details.\n\nIf you need help choosing a license, refer to [https://choosealicense.com/](https://choosealicense.com/).\n`
};

export function useTemplates() {
    // Get all section titles
    const getSectionTitles = useCallback(() => Object.keys(templates), []);
    // Get a template by section title
    const getTemplate = useCallback((title: string) => templates[title] || "", []);
    return { getSectionTitles, getTemplate };
}
