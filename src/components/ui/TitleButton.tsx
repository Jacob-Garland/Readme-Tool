import React from "react";
import { Button } from "@chakra-ui/react";

interface TitleButtonProps {
  onClick: () => void;
}

const TitleButton: React.FC<TitleButtonProps> = ({ onClick }) => (
  <Button
    variant={"solid"}
    colorPalette="purple"
    w="80%"
    fontSize={"md"}
    onClick={onClick}
    mb={2}
  >
    Add Title
  </Button>
);

export default TitleButton;
