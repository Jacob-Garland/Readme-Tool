import React from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { Button, VStack, HStack, Icon, Box, Heading, Field, Portal, Select, createListCollection } from "@chakra-ui/react";
import { DiamondPlus } from "lucide-react";
import { useEditorStore } from "../stores/editorStore";
import { nanoid } from 'nanoid';
import TitleButton from "./ui/TitleButton";
import { templates } from '../utils/templates';
import BadgeFormButton from "./ui/BadgeForm";
import SectionButton from "./ui/SectionButton";

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
  onInsertBadge: (markdown: string, opts?: { section?: string }) => void;
  onInsertMarkdownComponent?: (section: string) => void;
  selections: string[];
}
const formSchema = z.object({
  section: z.array(z.string()).min(1, "Section is required"),
  markdownComponent: z.string({ message: "Component is required" }).array(),
});

type FormValues = z.infer<typeof formSchema>;

const BuilderMenu: React.FC<BuilderMenuProps> = ({ onInsertBadge, onInsertMarkdownComponent, selections }) => {
  const { handleSubmit, formState: { errors }, control } = useForm<FormValues>();
  const addDraftSection = useEditorStore((s) => s.addDraftSection);
  const setTitle = useEditorStore((s) => s.setTitle);

  const onSubmit = handleSubmit((data) => {
    if (onInsertMarkdownComponent && Array.isArray(data.markdownComponent)) {
      data.markdownComponent.forEach((component) => onInsertMarkdownComponent(component));
    }
    data.section.forEach((sectionTitle) => {
      // Find the template by title
      const template = templates.find((t: { title: string }) => t.title === sectionTitle);
      if (template) {
        const { title, content } = template;
        const id = nanoid();
        addDraftSection({ id, title, content });
      }
    });
  });
  
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
        bg={{ _light: "purple.100" , _dark: "purple.900" }} 
        overflowY={"auto"}
    >
        <Heading size="2xl" textAlign="center" mt={2}>
            Builder Menu
        </Heading>
            <VStack gap={2} p={4} alignItems="center">
              <TitleButton onClick={(title) => {
                if (title) {
                  setTitle(title, true);
                }
              }} />
              <BadgeFormButton onInsert={onInsertBadge} selections={selections} />
              <SectionButton
                onAddSection={(sectionTitle) => {
                  const id = nanoid();
                  addDraftSection({
                    id,
                    title: sectionTitle,
                    content: `## ${sectionTitle}\n\nType your section here`
                  });
                }}
              />

              <Heading size="xl" textAlign="center" mt={4}>
                Pre-Built Sections
              </Heading>
              <form onSubmit={onSubmit}>
                <HStack gap={2} alignItems="center">
                  <Field.Root invalid={!!errors.section} w={"80%"}>
                    <Field.Label>Select one and add it to your file</Field.Label>
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
                          variant={"subtle"}
                          w={"60"}
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
                            <Select.Positioner>
                              <Select.Content>
                                {sectionTitles.items.map((section) => (
                                  <Select.Item item={section} key={section.value}>
                                    {section.label}
                                    <Select.ItemIndicator />
                                  </Select.Item>
                                ))}
                              </Select.Content>
                            </Select.Positioner>
                          </Portal>
                        </Select.Root>
                      )}
                    />
                    <Field.ErrorText>{errors.section?.message}</Field.ErrorText>
                  </Field.Root>
                  <Button type="submit" variant={"solid"} color={"purple.500"} fontSize={"md"} mt={6} w={"24%"}>
                    <Icon as={DiamondPlus} /> Add
                  </Button>
                </HStack>
              </form>

              <Heading size="xl" textAlign="center" mt={4}>
                Markdown Components
              </Heading>
              <form onSubmit={onSubmit}>
                <HStack gap={2} alignItems="center">
                  <Field.Root invalid={!!errors.markdownComponent} w={"80%"}>
                    <Field.Label>Pre-made in Markdown syntax</Field.Label>
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
                          variant={"subtle"}
                          w={"60"}
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
                            <Select.Positioner>
                              <Select.Content>
                                {markdownComponentTitles.items.map((component) => (
                                  <Select.Item item={component} key={component.value}>
                                    {component.label}
                                    <Select.ItemIndicator />
                                </Select.Item>
                              ))}
                              </Select.Content>
                            </Select.Positioner>
                          </Portal>
                        </Select.Root>
                      )}
                    />
                    <Field.ErrorText>{errors.markdownComponent?.message}</Field.ErrorText>
                  </Field.Root>
                  <Button type="submit" variant={"solid"} color={"purple.500"} fontSize={"md"} mt={6} w={"24%"}>
                    <Icon as={DiamondPlus} /> Add
                  </Button>
                </HStack>
              </form>

            </VStack>
    </Box>
  );
};

export default BuilderMenu;
