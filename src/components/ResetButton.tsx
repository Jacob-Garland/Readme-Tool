import React from 'react';
import { IconButton } from '@chakra-ui/react';
import { ListRestart } from 'lucide-react';

interface ResetButtonProps {
  onReset: () => void;
}

const ResetButton: React.FC<ResetButtonProps> = ({ onReset }) => {
  return (
        <IconButton
            aria-label="Reset"
            onClick={onReset}
            variant="solid"
            colorPalette={"purple"}
            size="md"
            p={2}
            ml={4}
        >
            <ListRestart />
        </IconButton>
  );
};

export default ResetButton;
