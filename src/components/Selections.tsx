import { CheckboxCard, VStack } from "@chakra-ui/react";

interface SelectionsProps {
  selectedSections: string[];
  checkedSections: string[];
  onToggle: (title: string) => void;
}

const Selections: React.FC<SelectionsProps> = ({ selectedSections, checkedSections, onToggle }) => {
  return (
    <VStack align="stretch" gap={3}>
      {selectedSections.map((title) => (
        <CheckboxCard.Root 
          key={title}
          size={"md"}
          colorPalette={"purple"}
          variant={"surface"}
          checked={checkedSections.includes(title)}
          onCheckedChange={() => onToggle(title)}
        >
          <CheckboxCard.HiddenInput />
          <CheckboxCard.Control>
            <CheckboxCard.Label>{title}</CheckboxCard.Label>
            <CheckboxCard.Indicator />
          </CheckboxCard.Control>
        </CheckboxCard.Root>
      ))}
    </VStack>
  );
};

export default Selections;
