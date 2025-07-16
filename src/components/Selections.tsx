import { CheckboxCard, VStack, Heading, IconButton } from "@chakra-ui/react";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import React from "react";

interface SelectionsProps {
  selectedSections: string[];
  checkedSections: string[];
  onToggle: (id: string, checked: boolean) => void;
  onReorder: (newOrder: string[]) => void;
  nonDraggableIds?: string[];
}

function DraggableCard({ id, checked, onToggle, children, draggable }: { id: string; checked: boolean; onToggle: (id: string, checked: boolean) => void; children: React.ReactNode; draggable?: boolean }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.7 : 1,
    background: isDragging ? '#E9D8FD' : undefined,
    cursor: draggable === false ? 'default' : 'grab',
  };
  return (
    <div ref={setNodeRef} style={style} {...(draggable === false ? {} : attributes)}>
      <CheckboxCard.Root
        size={"sm"}
        colorPalette={"gray"}
        variant={"surface"}
        borderWidth={2}
        borderColor={"purple.500"}
        checked={checked}
        onCheckedChange={(details) => onToggle(id, Boolean(details.checked))}
      >
        <CheckboxCard.HiddenInput />
        <CheckboxCard.Control>
          {draggable !== false && (
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
          )}
          <CheckboxCard.Label mt={2} fontSize={"md"}>{children}</CheckboxCard.Label>
          <CheckboxCard.Indicator />
        </CheckboxCard.Control>
      </CheckboxCard.Root>
    </div>
  );
}

const Selections: React.FC<SelectionsProps> = ({ selectedSections, checkedSections, onToggle, onReorder, nonDraggableIds = [] }) => {
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = selectedSections.findIndex(id => id === active.id);
    const newIndex = selectedSections.findIndex(id => id === over.id);
    const newOrder = arrayMove(selectedSections, oldIndex, newIndex);
    onReorder(newOrder);
  };

  return (
    <>
      <Heading m={2} textAlign={"center"}>
        Selections
      </Heading>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={selectedSections} strategy={verticalListSortingStrategy}>
          <VStack align="stretch" p={2}>
            {selectedSections.map((title) => (
              <DraggableCard
                key={title}
                id={title}
                checked={checkedSections.includes(title)}
                onToggle={onToggle}
                draggable={!nonDraggableIds.includes(title)}
              >
                {title}
              </DraggableCard>
            ))}
          </VStack>
        </SortableContext>
      </DndContext>
    </>
  );
};

export default Selections;
