import React from "react";
import { Button, VStack, Icon } from "@chakra-ui/react";
import { DiamondPlus } from "lucide-react";

const sectionTitles = [
  "Introduction",
  "Installation",
  "Usage",
  "Contributing",
  "Tech Stack",
  "Credits",
  "Features",
  "Deployment",
  "Run Locally",
  "Environment Variables",
  "Requirements",
];

interface SectionsProps {
  onSectionClick?: (section: string) => void;
}

const Sections: React.FC<SectionsProps> = ({ onSectionClick }) => {
  return (
    <VStack gap={2} p={4} alignItems="center">
        <Button variant={"outline"} borderColor={"purple"} borderWidth={3} w="60%" mb={2}>
            <Icon as={DiamondPlus} mr={6} /> Blank Section
        </Button>
      {sectionTitles.map((section) => (
        <Button
          key={section}
          colorPalette="purple"
          w="60%"
          onClick={onSectionClick ? () => onSectionClick(section) : undefined}
        >
          {section}
        </Button>
      ))}
    </VStack>
  );
};

export default Sections;
