import { CheckboxCard, VStack, IconButton } from "@chakra-ui/react";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import React from "react";

interface SelectionsProps {
  selectedSections: string[];
  checkedSections: string[];
  onToggle: (title: string) => void;
  onReorder: (newOrder: string[]) => void;
}

function DraggableCard({ id, checked, onToggle, children }: { id: string; checked: boolean; onToggle: (id: string) => void; children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.7 : 1,
    background: isDragging ? '#E9D8FD' : undefined,
    cursor: 'grab',
  };
  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <CheckboxCard.Root
        size={"sm"}
        colorPalette={"gray"}
        variant={"surface"}
        borderWidth={2}
        borderColor={"purple.500"}
        checked={checked}
        onCheckedChange={() => onToggle(id)}
      >
        <CheckboxCard.HiddenInput />
        <CheckboxCard.Control>
            <IconButton
              aria-label="Drag handle"
              variant="ghost"
              size="md"
              {...listeners}
              tabIndex={-1}
              cursor="grab"
              mr={2}
            > 
                <GripVertical />
            </IconButton>
              <CheckboxCard.Label mt={2} fontSize={"md"}>{children}</CheckboxCard.Label>
            <CheckboxCard.Indicator />
        </CheckboxCard.Control>
      </CheckboxCard.Root>
    </div>
  );
}

const Selections: React.FC<SelectionsProps> = ({ selectedSections, checkedSections, onToggle, onReorder }) => {
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = selectedSections.indexOf(active.id);
      const newIndex = selectedSections.indexOf(over.id);
      onReorder(arrayMove(selectedSections, oldIndex, newIndex));
    }
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={selectedSections} strategy={verticalListSortingStrategy}>
        <VStack align="stretch" p={2}>
          {selectedSections.map((title) => (
            <DraggableCard key={title} id={title} checked={checkedSections.includes(title)} onToggle={onToggle}>
              {title}
            </DraggableCard>
          ))}
        </VStack>
      </SortableContext>
    </DndContext>
  );
};

export default Selections;
