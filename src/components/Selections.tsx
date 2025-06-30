import { CheckboxCard, VStack } from "@chakra-ui/react";

interface SelectionsProps {
  selectedSections: string[];
}

const Selections: React.FC<SelectionsProps> = ({ selectedSections }) => {
  return (
    <VStack align="stretch" gap={3}>
      {selectedSections.map((title) => (
        <CheckboxCard.Root 
          key={title}
          size={"md"}
          colorPalette={"purple"}
          variant={"surface"}
          defaultChecked={true}
          readOnly
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
