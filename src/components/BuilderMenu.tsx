import React from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { Button, VStack, Icon, Box, Heading, Field, Portal, Select, createListCollection, Separator } from "@chakra-ui/react";
import { DiamondPlus } from "lucide-react";
import BadgeForm from "./BadgeForm";
import TitleButton from "./ui/TitleButton";

// Pre-Built Sections
const sectionTitles = createListCollection({
  items: [
     { label: "Table of Contents", value: "Table of Contents" },
     { label: "Introduction", value: "Introduction" },
     { label: "Installation", value: "Installation" },
     { label: "Usage", value: "Usage" },
     { label: "Contributing", value: "Contributing" },
     { label: "Tech Stack", value: "Tech Stack" },
     { label: "Credits", value: "Credits" },
     { label: "Features", value: "Features" },
     { label: "Deployment", value: "Deployment" },
     { label: "Run Locally", value: "Run Locally" },
     { label: "Environment Variables", value: "Environment Variables" },
     { label: "Requirements", value: "Requirements" },
     { label: "FAQ", value: "FAQ" },
     { label: "Badges", value: "Badges" },
     { label: "License", value: "License" }
    ],
});

// Markdown Components
const markdownComponentTitles = createListCollection({
  items: [
    { label: "Heading 1", value: "Heading 1" },
    { label: "Heading 2", value: "Heading 2" },
    { label: "Heading 3", value: "Heading 3" },
    { label: "Bold Text", value: "Bold Text" },
    { label: "Italicized Text", value: "Italicized Text" },
    { label: "Blockquote", value: "Blockquote" },
    { label: "Ordered List", value: "Ordered List" },
    { label: "Unordered List", value: "Unordered List" },
    { label: "Code", value: "Code" },
    { label: "Link", value: "Link" },
    { label: "Logo", value: "Logo" },
    { label: "Image", value: "Image" },
    { label: "Video", value: "Video" },
    { label: "Youtube Video", value: "Youtube Video" },
  ],
});

interface BuilderMenuProps {
  onSectionClick?: (section: string) => void;
  onInsertBadge: (markdown: string, opts?: { section?: string }) => void;
  onInsertMarkdownComponent?: (section: string) => void;
  selections: string[];
}
const formSchema = z.object({
  section: z.string().min(1, "Section is required"),
  markdownComponent: z.string().min(1, "Component is required"),
});

type FormValues = z.infer<typeof formSchema>;

const BuilderMenu: React.FC<BuilderMenuProps> = ({ onSectionClick, onInsertBadge, onInsertMarkdownComponent, selections }) => {
  const { handleSubmit, formState: { errors }, control } = useForm<FormValues>();

  const onSubmit = handleSubmit((data) => {
    if (onInsertMarkdownComponent) {
      onInsertMarkdownComponent(data.markdownComponent);
    }
    if (onSectionClick) {
      onSectionClick(data.section);
    }
  });

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

              {/* <Heading size="lg" textAlign="center">
                Pre-Built Sections
              </Heading> */}

              <form onSubmit={onSubmit}>
                <VStack gap={2} alignItems="center">
                  <Field.Root invalid={!!errors.section} w={"80%"}>
                    <Field.Label>Pre-Built Sections</Field.Label>
                    <Controller
                      name="section"
                      control={control}
                      render={({ field }) => (
                        <Select.Root
                          name={field.name}
                          value={field.value}
                          collection={sectionTitles}
                          onValueChange={({value}) => field.onChange(value)}
                          onInteractOutside={() => field.onBlur()}
                          multiple
                        >
                          <Select.HiddenSelect />
                          <Select.Control>
                            <Select.Trigger>
                              <Select.ValueText placeholder="Select a section" />
                            </Select.Trigger>
                            <Select.IndicatorGroup>
                              <Select.ClearTrigger />
                              <Select.Indicator />
                            </Select.IndicatorGroup>
                          </Select.Control>
                          <Portal>
                            <Select.Content>
                              {sectionTitles.items.map((section) => (
                                <Select.Item item={section} key={section.value}>
                                  {section.label}
                                  <Select.ItemIndicator />
                                </Select.Item>
                              ))}
                            </Select.Content>
                          </Portal>
                        </Select.Root>
                      )}
                    />
                    <Field.ErrorText>{errors.section?.message}</Field.ErrorText>
                  </Field.Root>
                  <Button type="submit" variant={"solid"} color={"purple.500"} w="80%" fontSize={"md"}>
                    <Icon as={DiamondPlus} mr={1} /> Add Section
                  </Button>
                </VStack>
              </form>

              {/* Old buttons on menu */}
              {/* {sectionTitles.filter(section => section !== 'Title').map((section) => (
                  <Button
                    key={section}
                    colorPalette="purple"
                    w="80%"
                    onClick={onSectionClick ? () => onSectionClick(section) : undefined}
                    fontSize={"md"}
                  >
                    {section}
                  </Button>
              ))} */}

              <Separator />
              
              {/* Old menu buttons */}
              {/* <Heading size="lg" textAlign="center" mt={4}>
                Markdown Components
              </Heading> */}
              {/* {markdownComponentTitles.map((section) => (
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
              ))} */}

              <form onSubmit={onSubmit}>
                <VStack gap={2} alignItems="center">
                  <Field.Root invalid={!!errors.markdownComponent} w={"80%"}>
                    <Field.Label>Markdown Components</Field.Label>
                    <Controller
                      name="markdownComponent"
                      control={control}
                      render={({ field }) => (
                        <Select.Root
                          name={field.name}
                          value={field.value}
                          collection={markdownComponentTitles}
                          onValueChange={({value}) => field.onChange(value)}
                          onInteractOutside={() => field.onBlur()}
                        >
                          <Select.HiddenSelect />
                          <Select.Control>
                            <Select.Trigger>
                              <Select.ValueText placeholder="Select a component" />
                            </Select.Trigger>
                            <Select.IndicatorGroup>
                              <Select.ClearTrigger />
                              <Select.Indicator />
                            </Select.IndicatorGroup>
                          </Select.Control>
                          <Portal>
                            <Select.Content>
                              {markdownComponentTitles.items.map((component) => (
                                <Select.Item item={component} key={component.value}>
                                  {component.label}
                                  <Select.ItemIndicator />
                                </Select.Item>
                              ))}
                            </Select.Content>
                          </Portal>
                        </Select.Root>
                      )}
                    />
                    <Field.ErrorText>{errors.markdownComponent?.message}</Field.ErrorText>
                  </Field.Root>
                  <Button type="submit" variant={"solid"} color={"purple.500"} w="80%" fontSize={"md"}>
                    <Icon as={DiamondPlus} mr={1} /> Add Component
                  </Button>
                </VStack>
              </form>

            </VStack>
    </Box>
  );
};

export default BuilderMenu;
