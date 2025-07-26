import { CheckboxCard, VStack, Heading, IconButton } from "@chakra-ui/react";
import { arrayMove, SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
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
  const checkedSections = useEditorStore((s) => s.draft.selections);
  const sections = useEditorStore((s) => s.draft.sections);
  const title = useEditorStore((s) => s.draft.title);
  const reorderSections = useEditorStore((s) => s.reorderSections);
  const setDraft = useEditorStore((s) => s.setDraft);
  const nonDraggableIds: string[] = [];

  const selectedSections = sections.map(s => s.id);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    // Prevent reordering the title card
    if (active.id === "__title__" || over.id === "__title__") return;
    const oldIndex = selectedSections.findIndex(id => id === active.id);
    const newIndex = selectedSections.findIndex(id => id === over.id);
    const newOrder = arrayMove(selectedSections, oldIndex, newIndex);
    reorderSections(newOrder);
  };

  const handleToggle = (id: string, checked: boolean) => {
    let selections = checkedSections;
    if (checked) {
      if (!checkedSections.includes(id)) {
        selections = [...checkedSections, id];
      }
    } else {
      selections = checkedSections.filter(t => t !== id);
    }
    // Use the current draft from the store
    const draft = useEditorStore.getState().draft;
    setDraft({ ...draft, selections });
  };

  return (
    <>
      <Heading m={2} textAlign={"center"}>
        Table Of Contents
      </Heading>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={selectedSections} strategy={verticalListSortingStrategy}>
          <VStack align="stretch" p={2}>
            {/* Render title card if present and always use id for checked state */}
            {title && (
                <DraggableCard
                    key={"__title__"}
                    id={"__title__"}
                    checked={checkedSections.includes("__title__")}
                    onToggle={() => handleToggle("__title__", !checkedSections.includes("__title__"))}
                    draggable={false}
                >
                    {title}
                </DraggableCard>
            )}
            {sections
                .filter(section => section.id !== "__title__")
                .map((section) => (
                    <DraggableCard
                        key={section.id}
                        id={section.id}
                        checked={checkedSections.includes(section.id)}
                        onToggle={() => handleToggle(section.id, !checkedSections.includes(section.id))}
                        draggable={!nonDraggableIds.includes(section.id)}
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
