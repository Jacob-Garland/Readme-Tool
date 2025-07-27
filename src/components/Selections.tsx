import { CheckboxCard, VStack, Heading, IconButton } from "@chakra-ui/react";
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { GripVertical } from 'lucide-react';
import { CSS } from '@dnd-kit/utilities';
import React from "react";
import { useEditorStore } from "../stores/editorStore";

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


const Selections: React.FC = () => {
  const sensors = useSensors(useSensor(PointerSensor));
  const selections = useEditorStore((s) => s.draft.selections);
  const sections = useEditorStore((s) => s.draft.sections);
  const title = useEditorStore((s) => s.draft.title);
  const reorderSections = useEditorStore((s) => s.reorderSections);
  const toggleSectionSelection = useEditorStore((s) => s.toggleSectionSelection);

  // Always show all sections as cards (except title if needed)
  const sectionCards = sections.filter(s => s.id !== "__title__");

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    // Prevent reordering the title card
    const activeId = String(active.id);
    const overId = String(over.id);
    if (activeId === "__title__" || overId === "__title__") return;
    const oldIndex = selections.findIndex(id => id === activeId);
    const newIndex = selections.findIndex(id => id === overId);
    const newOrder = Array.from(selections);
    // Only reorder if both are valid
    if (oldIndex !== -1 && newIndex !== -1) {
      newOrder.splice(oldIndex, 1);
      newOrder.splice(newIndex, 0, activeId);
      reorderSections(newOrder);
    }
  };

  const handleToggle = (id: string, checked: boolean) => {
    toggleSectionSelection(id, checked);
  };

  return (
    <>
      <Heading m={2} textAlign={"center"}>
        Table Of Contents
      </Heading>
      {/* Title card always at the top, not draggable */}
      {title && (
        <DraggableCard
          id="__title__"
          checked={selections.includes("__title__")}
          onToggle={handleToggle}
          draggable={false}
        >
          <b>{title}</b>
        </DraggableCard>
      )}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={selections.filter(id => id !== "__title__")}
          strategy={verticalListSortingStrategy}>
          <VStack align="stretch" p={2}>
            {/* Render all sections as draggable cards */}
            {sectionCards.map(section => (
              <DraggableCard
                key={section.id}
                id={section.id}
                checked={selections.includes(section.id)}
                onToggle={handleToggle}
              >
                {section.title}
              </DraggableCard>
            ))}
          </VStack>
        </SortableContext>
      </DndContext>
    </>
  );
};

export default Selections;
