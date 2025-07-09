import {
  Button,
  Field,
  Input,
  Popover,
  Portal,
  Stack,
  Textarea,
  CloseButton
} from "@chakra-ui/react"

const BadgeForm = () => {
  return (
    <Popover.Root autoFocus={true} closeOnEscape={true}>
      <Popover.Trigger asChild>
        <Button size="md" variant="solid">
          Make a Badge
        </Button>
      </Popover.Trigger>
      <Portal>
        <Popover.Positioner>
          <Popover.Content>
            <Popover.Arrow />
            <Popover.Body>
              <Stack gap="4">
                <CloseButton
                  position="absolute"
                  top="8px"
                  right="8px"
                />
                <Field.Root>
                  <Field.Label>Label</Field.Label>
                  <Input placeholder="Left-hand-side text" />
                </Field.Root>
                <Field.Root>
                  <Field.Label>Label Color</Field.Label>
                  <Input placeholder="Background of left label (hex, rgb, rgba, etc.)" />
                </Field.Root>
                <Field.Root>
                  <Field.Label>Quick Badge</Field.Label>
                  <Textarea placeholder="Label, optional message, and color. Separated by dashes." />
                </Field.Root>
                <Button>Add Badge</Button>
              </Stack>
            </Popover.Body>
            <Popover.CloseTrigger />
          </Popover.Content>
        </Popover.Positioner>
      </Portal>
    </Popover.Root>
  )
}

export default BadgeForm;