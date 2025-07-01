import React from 'react';
import { IconButton } from '@chakra-ui/react';
import { FileDown } from 'lucide-react';
import { toaster } from './toaster';

const DownloadButton: React.FC = () => {
    const handleDownload = () => {
        try {
          toaster.create({
            title: 'Download started',
            description: 'The file is being downloaded.',
            type: 'success',
          });
        } catch (error) {
          toaster.create({
            title: 'Download failed',
            description: 'Unsuccessful file download. Please try again...',
            type: 'error',
          });
        }
      };

    return (
        <IconButton
        aria-label="Download"
        variant="solid"
        colorScheme="purple"
        size="md"
        p={2}
        mb={4}
        onClick={handleDownload}
        >
        <FileDown /> Download File
        </IconButton>
    );
};

export default DownloadButton;
