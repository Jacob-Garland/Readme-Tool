import { CheckboxCard, VStack, Heading, IconButton } from "@chakra-ui/react";
import { arrayMove, SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { GripVertical } from 'lucide-react';
import { CSS } from '@dnd-kit/utilities';
import React from "react";

import type { Section } from "../types/types";
interface SelectionsProps {
  selectedSections: string[];
  checkedSections: string[];
  onToggle: (id: string, checked: boolean) => void;
  onReorder: (newOrder: string[]) => void;
  nonDraggableIds?: string[];
  title?: string;
  sections: Section[];
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
          {draggable !== false ? (
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
          ) : null}
          <CheckboxCard.Label mt={2} fontSize={"md"}>{children}</CheckboxCard.Label>
          <CheckboxCard.Indicator />
        </CheckboxCard.Control>
      </CheckboxCard.Root>
    </div>
  );
}

const Selections: React.FC<SelectionsProps> = ({ selectedSections, checkedSections, onToggle, onReorder, nonDraggableIds = [], title, sections }) => {
  const sensors = useSensors(useSensor(PointerSensor));

  // The title card is always at the top and not draggable
  const renderTitleCard = title && title.trim() ? (
    <DraggableCard
      key="__title__"
      id="__title__"
      checked={checkedSections.includes(title)}
      onToggle={() => {
        const isChecked = checkedSections.includes(title);
        onToggle(title, !isChecked);
      }}
      draggable={false}
    >
      {title}
    </DraggableCard>
  ) : null;

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    // Prevent reordering the title card
    if (active.id === "__title__" || over.id === "__title__") return;

    const oldIndex = selectedSections.findIndex(id => id === active.id);
    const newIndex = selectedSections.findIndex(id => id === over.id);
    const newOrder = arrayMove(selectedSections, oldIndex, newIndex);
    onReorder(newOrder);
  };

  return (
    <>
      <Heading m={2} textAlign={"center"}>
        Table Of Contents
      </Heading>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={selectedSections} strategy={verticalListSortingStrategy}>
          <VStack align="stretch" p={2}>
            {renderTitleCard}
            {selectedSections
              // Filter out the title if it matches the title prop (avoid duplicate card)
              .filter(sectionId => !(title && title.trim() && sectionId === title.trim()))
              .map((sectionId) => {
                // Find the section object to get the current title
                const section = sections.find((s) => s.id === sectionId);
                const sectionTitle = section ? section.title : sectionId;
                return (
                  <DraggableCard
                    key={sectionId}
                    id={sectionId}
                    checked={checkedSections.includes(sectionId)}
                    onToggle={onToggle}
                    draggable={!nonDraggableIds.includes(sectionId)}
                  >
                    {sectionTitle}
                  </DraggableCard>
                );
              })}
          </VStack>
        </SortableContext>
      </DndContext>
    </>
  );
};

export default Selections;
