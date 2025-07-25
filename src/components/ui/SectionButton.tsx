import React, { useRef, useState } from "react";
import { Button, Icon, Popover, Portal, Stack, Input, Box } from "@chakra-ui/react";
import { DiamondPlus } from "lucide-react";

interface SectionButtonProps {
  onAddSection: (sectionTitle: string) => void;
}

const SectionButton: React.FC<SectionButtonProps> = ({ onAddSection }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleAdd = () => {
    if (inputValue.trim()) {
      onAddSection(inputValue.trim());
      setInputValue("");
      setIsOpen(false);
    }
  };

  return (
    <Popover.Root open={isOpen} onOpenChange={details => setIsOpen(details.open)}>
      <Popover.Trigger asChild>
        <Button
          variant={"solid"}
          color={"purple.500"}
          w="80%"
          fontSize={"md"}
          onClick={() => setIsOpen(true)}
        >
          <Icon as={DiamondPlus} />
          New Section
        </Button>
      </Popover.Trigger>
      <Portal>
        <Popover.Positioner>
          <Popover.Content>
            <Popover.Arrow />
            <Popover.Body>
              <Stack gap="4">
                <Box fontWeight="bold">Section Title</Box>
                <Input
                  ref={inputRef}
                  placeholder="Enter section title"
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === "Enter") handleAdd();
                  }}
                  autoFocus
                />
                <Button colorPalette="purple" onClick={handleAdd} disabled={!inputValue.trim()}>
                  Add Section
                </Button>
              </Stack>
            </Popover.Body>
            <Popover.CloseTrigger />
          </Popover.Content>
        </Popover.Positioner>
      </Portal>
    </Popover.Root>
  );
};

export default SectionButton;
