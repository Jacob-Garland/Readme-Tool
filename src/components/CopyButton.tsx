import React from 'react';
import { IconButton, useClipboard } from '@chakra-ui/react';
import { Copy } from 'lucide-react';
import { toaster } from './ui/toaster';

interface CopyButtonProps {
  value: string;
}

const CopyButton: React.FC<CopyButtonProps> = ({ value }) => {
  const clipboard = useClipboard({ value });

  const handleCopy = () => {
    try {
      clipboard.copy();
      toaster.create({
        title: 'Copied to clipboard',
        description: 'The file has been copied successfully.',
        type: 'success',
      });
    } catch (error) {
      toaster.create({
        title: 'Copy failed',
        description: 'Unsuccessful file copy. Please try again...',
        type: 'error',
      });
    }
  };

  return (
    <IconButton
      aria-label="Copy"
      variant="solid"
      colorScheme="purple"
      onClick={handleCopy}
      size="md"
      p={2}
    >
      <Copy /> Copy File
    </IconButton>
  );
};

export default CopyButton;
