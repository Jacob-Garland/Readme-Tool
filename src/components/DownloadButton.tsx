import React from 'react';
import { IconButton } from '@chakra-ui/react';
import { FileDown } from 'lucide-react';

const DownloadButton: React.FC = () => {
  return (
    <IconButton
      aria-label="Download"
      variant="solid"
      colorScheme="purple"
      size="md"
      p={2}
      mb={4}
    >
      <FileDown /> Download File
    </IconButton>
  );
};

export default DownloadButton;
