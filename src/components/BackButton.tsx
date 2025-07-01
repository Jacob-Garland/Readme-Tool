import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IconButton } from '@chakra-ui/react';
import { ArrowLeft } from 'lucide-react';

const BackButton: React.FC = () => {
  const navigate = useNavigate();
  return (
    <IconButton
      aria-label="Back to Home"
      onClick={() => navigate('/')}
      variant="solid"
      colorPalette={"purple"}
      size="md"
      p={2}
      mr={4}
    >
      <ArrowLeft />
    </IconButton>
  );
};

export default BackButton;
