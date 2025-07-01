import React from 'react';
import { IconButton, useClipboard } from '@chakra-ui/react';
import { Copy } from 'lucide-react';

interface CopyButtonProps {
  value: string;
}

const CopyButton: React.FC<CopyButtonProps> = ({ value }) => {
  const clipboard = useClipboard({ value });

  return (
    <IconButton
      aria-label="Copy"
      variant="solid"
      colorScheme="purple"
      onClick={clipboard.copy}
      size="md"
      p={2}
    >
      <Copy /> Copy File
    </IconButton>
  );
};

export default CopyButton;
