import React, { useState } from 'react';
import { Box, Heading, HStack, FileUpload, Icon, Code, Text, Button } from '@chakra-ui/react';
import BackButton from '../components/BackButton';
import { Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EditReadme: React.FC = () => {
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    // FileUpload.Root expects FileAcceptDetails, which has a 'files' property
    const handleFileAccept = (details: { files: File[] }) => {
        const files = details.files;
        if (files && files.length > 0) {
            setUploadedFile(files[0]);
            setSuccess(true);
        }
    };

    const handleGoToEditor = async () => {
        if (uploadedFile) {
            const content = await uploadedFile.text();
            navigate('/editor', { state: { file: uploadedFile, content } });
        }
    };

    return (
        <Box mx="auto" mt={10} p={4} borderWidth={1} borderRadius="lg" boxShadow="md" maxW="md">
            <HStack mb={4} alignItems="center" justifyContent="center">
                <BackButton />
                <Heading textAlign={"center"} size={"3xl"}>Edit An Existing README</Heading>
            </HStack>

            <FileUpload.Root maxW="xl" alignItems="stretch" maxFiles={1} accept={{ 'text/markdown': ['.md'] }}
                allowDrop={true}
                onFileAccept={handleFileAccept}
            >
                <FileUpload.HiddenInput />
                <FileUpload.Dropzone>
                    <Icon size="md" color="fg.muted">
                        <Upload />
                    </Icon>
                    <FileUpload.DropzoneContent>
                        <Box>Drag and drop an existing <Code>README.md</Code> file here.</Box>
                        <Box>Or click to select one. Only <Code>.md</Code> files are allowed.</Box>
                    </FileUpload.DropzoneContent>
                </FileUpload.Dropzone>
                <FileUpload.List />
            </FileUpload.Root>

            {success && (
                <Text mt={4} color="green.500" fontWeight="bold" textAlign="center">
                    File uploaded successfully!
                </Text>
            )}

            <Button
                type="button"
                alignSelf="center"
                onClick={handleGoToEditor}
                mt={4}
                disabled={!uploadedFile}
            >
                Continue to Editor
            </Button>
        </Box>
    );
};

export default EditReadme;
