import React from "react";
import { Button, Icon } from "@chakra-ui/react";
import { DiamondPlus } from "lucide-react";

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
  >
    <Icon as={DiamondPlus} />
    Title
  </Button>
);

export default TitleButton;
