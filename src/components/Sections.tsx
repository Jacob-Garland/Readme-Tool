import React from "react";
import { Button, VStack, Icon, Box, Heading, Text } from "@chakra-ui/react";
import { DiamondPlus } from "lucide-react";
import BadgeForm from "./BadgeForm";
import TitleButton from "./ui/TitleButton";

// Pre-Built Sections
const sectionTitles = [
  "Title",
  "Table of Contents",
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
  "FAQ",
  "Badges",
  "License"
];

// Markdown Components
const markdownComponentTitles = [
  "Logo",
  "Image",
  "Video",
  "Youtube Video",
  "Heading 1",
  "Heading 2",
  "Heading 3",
  "Bold Text",
  "Italicized Text",
  "Blockquote",
  "Ordered List",
  "Unordered List",
  "Code",
  "Link"
];

interface SectionsProps {
  onSectionClick?: (section: string) => void;
  onInsertBadge: (markdown: string, opts?: { section?: string }) => void;
  onInsertMarkdownComponent?: (section: string) => void;
  selections: string[];
}

const Sections: React.FC<SectionsProps> = ({ onSectionClick, onInsertBadge, onInsertMarkdownComponent, selections }) => {
  // Handler for blank section
  const handleBlankSection = () => {
    if (onSectionClick) {
      onSectionClick('Blank Section');
    }
  };
  
  return (
    <Box w={["100%", "100%", "20%"]}
        minW={0}
        boxShadow={"lg"}
        borderRadius={"md"}
        h={["auto", "auto", "calc(100vh - 120px)"]}
        maxH={["none", "none", "calc(100vh - 120px)"]}
        display="flex"
        flexDirection="column"
        overflow="hidden" 
        p={4} 
        bg={"purple.100"} 
        overflowY={"auto"}
    >
        <Heading size="xl" textAlign="center" mt={2}>
            Builder Menu
        </Heading>
        <Box textAlign="center" fontSize="sm">
            <Text>Click on a button to add it to your README.md</Text>
        </Box>
        
            <VStack gap={2} p={4} alignItems="center">

              <BadgeForm onInsert={onInsertBadge} selections={selections} />
              <Button variant={"solid"} color={"purple.500"} w="80%" onClick={handleBlankSection} fontSize={"md"} mb={2}>
                  <Icon as={DiamondPlus} mr={1} /> Blank Section
              </Button>
              <TitleButton onClick={() => {
                if (onSectionClick) {
                  onSectionClick('Title');
                }
              }} />

              <Heading size="lg" textAlign="center">
                Pre-Built Sections
              </Heading>
              {sectionTitles.filter(section => section !== 'Title').map((section) => (
                  <Button
                    key={section}
                    colorPalette="purple"
                    w="80%"
                    onClick={onSectionClick ? () => onSectionClick(section) : undefined}
                    fontSize={"md"}
                  >
                    {section}
                  </Button>
              ))}

              <Heading size="lg" textAlign="center" mt={4}>
                Markdown Components
              </Heading>
              {markdownComponentTitles.map((section) => (
                  <Button
                    key={section}
                    colorPalette="purple"
                    w="80%"
                    onClick={() => {
                      if (onInsertMarkdownComponent) {
                        onInsertMarkdownComponent(section);
                      }
                    }}
                    fontSize={"md"}
                  >
                    {section}
                  </Button>
              ))}
            </VStack>
    </Box>
  );
};

export default Sections;
