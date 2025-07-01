import React from 'react';
import { IconButton } from '@chakra-ui/react';
import { Copy } from 'lucide-react';

const CopyButton: React.FC = () => {
  return (
    <IconButton
      aria-label="Copy"
      variant="solid"
      colorScheme="purple"
      size="md"
      p={2}
    >
      <Copy /> Copy File
    </IconButton>
  );
};

export default CopyButton;
