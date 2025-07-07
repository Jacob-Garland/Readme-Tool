import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Heading, Input, Button, Fieldset, Field, Stack, NativeSelect, For, HStack, Checkbox } from '@chakra-ui/react';
import BackButton from '../components/ui/BackButton';

const LICENSE_OPTIONS = [
  "MIT",
  "Apache 2.0",
  "GPL 3.0",
  "BSD 2-Clause",
  "BSD 3-Clause",
  "CC0",
  "EPL 2.0",
  "LGPL 3.0",
  "MPL 2.0",
  "Unlicense",
];

const NewReadme: React.FC = () => {
  const nav = useNavigate();

  // Refs for form fields
  const titleRef = useRef<HTMLInputElement>(null);
  const authorRef = useRef<HTMLInputElement>(null);
  const licenseRef = useRef<HTMLSelectElement>(null);
  // Table of Contents checkbox ref (logic placeholder)
  const tocRef = useRef<HTMLInputElement>(null);

  // Prebuilt markdown section templates
  const getMarkdownSections = (formData: { title: string; author: string; license: string }) => {
    const sections: string[] = [];
    if (formData.title) {
      sections.push(`# ${formData.title}\n`);
    }
    // Table of Contents logic placeholder
    // if (tocRef.current?.checked) { ... }
    if (formData.author) {
      sections.push(`\n## Credits\nCreated by: ${formData.author}\n`);
    }
    if (formData.license) {
      sections.push(`\n## License\nThis project is licensed under the ${formData.license} license.\n Please refer to the LICENSE.md file for more details.\n`);
    }
    return sections;
  };

  // Logic to build selection cards for the editor
  const getSelections = (formData: { title: string; author: string; license: string }) => {
    const selections: string[] = [];
    if (formData.title) selections.push('Title');
    // Table of Contents logic placeholder
    if (formData.author) selections.push('Credits');
    if (formData.license) selections.push('License');
    return selections;
  };

  const handleStart = () => {
    const formData = {
      title: titleRef.current?.value || '',
      author: authorRef.current?.value || '',
      license: licenseRef.current?.value || '',
    };
    // If all fields are blank, behave as before
    if (!formData.title && !formData.author && !formData.license) {
      nav('/editor', { state: formData });
      return;
    }
    // Build markdown sections and selections
    const markdownSections = getMarkdownSections(formData);
    const selections = getSelections(formData);
    nav('/editor', {
      state: {
        ...formData,
        markdownSections,
        selections,
      },
    });
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      minH="100vh"
      p={4}
    >
      <Box
        mx="auto"
        p={4}
        borderWidth={1}
        borderRadius="lg"
        boxShadow="md"
        maxW="md"
        width="100%"
        bg="white"
      >
        <HStack mb={4} alignItems="center" justifyContent="center">
          <BackButton />
          <Heading textAlign={"center"} size={"3xl"}>Create A New README</Heading>
        </HStack>

        <Fieldset.Root size="lg" maxW="md">
          <Stack mb={2}>
            <Fieldset.HelperText fontSize={"md"} fontWeight={"bold"} textAlign={"center"}>
              Please provide some details below to get started.
            </Fieldset.HelperText>
          </Stack>

          <Fieldset.Content>
            <Field.Root>
              <Field.Label fontSize={"md"}>What is your project name?</Field.Label>
              <Input name="title" ref={titleRef} />
            </Field.Root>

            <Field.Root>
              <Field.Label fontSize={"md"}>Who created this project?</Field.Label>
              <Input name="author" ref={authorRef} />
            </Field.Root>

            <Field.Root>
              <Field.Label fontSize={"md"}>What license do you need for your project?</Field.Label>
              <NativeSelect.Root colorPalette={"purple"}>
                <NativeSelect.Field name="license" ref={licenseRef}>
                  <option value="">Choose a License</option>
                  <For each={LICENSE_OPTIONS}>
                    {(item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    )}
                  </For>
                </NativeSelect.Field>
                <NativeSelect.Indicator />
              </NativeSelect.Root>
            </Field.Root>
          </Fieldset.Content>

          <Checkbox.Root
            colorPalette={"purple"}
            variant={"outline"}
            size={"lg"}
          >
            <Checkbox.HiddenInput ref={tocRef} />
            <Checkbox.Control />
            <Checkbox.Label>Do you need a Table of Contents?</Checkbox.Label>
          </Checkbox.Root>

          <Button type="submit" alignSelf="center" size={"lg"} onClick={handleStart} mt={4} colorPalette={"purple"}>
            Start
          </Button>
        </Fieldset.Root>
      </Box>
    </Box>
  );
};

export default NewReadme;
