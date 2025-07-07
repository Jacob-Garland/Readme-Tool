import React from "react";
import { Button, VStack, Icon, Box, Heading, Text } from "@chakra-ui/react";
import { DiamondPlus } from "lucide-react";

const sectionTitles = [
  "Title",
  "Logo or Image",
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
  "License",
  "Video",
  "Youtube Video"
];

interface SectionsProps {
  onSectionClick?: (section: string) => void;
}

const Sections: React.FC<SectionsProps> = ({ onSectionClick }) => {
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
            Select A Section
        </Heading>
        <Box textAlign="center" mb={2} fontSize="sm">
            <Text>Click on a section to add it to your README.md</Text>
        </Box>
        
            <VStack gap={2} p={4} alignItems="center">
                <Button variant={"outline"} borderColor={"purple.500"} borderWidth={2} w="80%" mb={4} onClick={handleBlankSection} fontSize={"md"}>
                    <Icon as={DiamondPlus} mr={1} /> Blank Section
                </Button>
            {sectionTitles.map((section) => (
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
            </VStack>
    </Box>
  );
};

export default Sections;
