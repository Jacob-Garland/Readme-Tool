import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Heading, Input, Button, Fieldset, Field, Stack, NativeSelect, For, HStack, Checkbox } from '@chakra-ui/react';
import BackButton from '../components/BackButton';

const NewReadme: React.FC = () => {
  const nav = useNavigate();

  const handleStart = () => {
    const formData = { title: '', author: '', license: '' };
    nav('/editor', { state: formData });
  };

  return (
    <Box mx="auto" mt={10} p={4} borderWidth={1} borderRadius="lg" boxShadow="md" maxW="md">
        <HStack mb={4} alignItems="center" justifyContent="center">
            <BackButton />
            <Heading textAlign={"center"} size={"3xl"}>Create A New README</Heading>
        </HStack>

            <Fieldset.Root size="lg" maxW="md">
                <Stack mb={2}>
                    {/* <Fieldset.Legend>Create a Readme</Fieldset.Legend> */}
                    <Fieldset.HelperText fontSize={"md"} fontWeight={"bold"} textAlign={"center"}>
                        Please provide some details below to get started.
                    </Fieldset.HelperText>
                </Stack>

                <Fieldset.Content>
                    <Field.Root>
                    <Field.Label fontSize={"md"}>What is your project name?</Field.Label>
                    <Input name="title" />
                    </Field.Root>

                    <Field.Root>
                    <Field.Label fontSize={"md"}>Who created this project?</Field.Label>
                    <Input name="author" />
                    </Field.Root>

                    <Field.Root>
                    <Field.Label fontSize={"md"}>What license do you need for your project?</Field.Label>
                    <NativeSelect.Root>
                        <NativeSelect.Field name="license">
                        <For each={["MIT", "Apache 2.0", "GPL 3.0"]}>
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
                    <Checkbox.HiddenInput />
                    <Checkbox.Control />
                    <Checkbox.Label>Do you need a Table of Contents?</Checkbox.Label>
                </Checkbox.Root>

                <Button type="submit" alignSelf="center" size={"lg"} onClick={handleStart} mt={4} colorPalette={"purple"}>
                    Start
                </Button>
            </Fieldset.Root>
    </Box>
  );
};

export default NewReadme;
