import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IconButton, Box, HoverCard, Portal, Strong } from '@chakra-ui/react';
import { ArrowLeft } from 'lucide-react';

const BackButton: React.FC = () => {
  const navigate = useNavigate();
  return (
    <HoverCard.Root size={"sm"} openDelay={100} closeDelay={100}>
      <HoverCard.Trigger>
        <IconButton
          aria-label="Back to Home"
          onClick={() => navigate('/')}
          variant="solid"
          rounded={"full"}
        >
          <ArrowLeft />
        </IconButton>
      </HoverCard.Trigger>
      <Portal>
        <HoverCard.Positioner>
          <HoverCard.Content bg={"purple.500"} color={{ _light: "black", _dark: "white" }} rounded="md" shadow="md">
            <HoverCard.Arrow />
            <Box>
              <Strong>Back to Home</Strong>
            </Box>
          </HoverCard.Content>
        </HoverCard.Positioner>
      </Portal>
    </HoverCard.Root>
  );
};

export default BackButton;
