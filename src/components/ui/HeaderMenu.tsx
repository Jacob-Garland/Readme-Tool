import { Box, IconButton, Group, Menu, Portal } from "@chakra-ui/react"
import { Copy, Download, ListRestart, Save, Github, SquareMenu } from "lucide-react"

const horizontalMenuItems = [
  { label: "Copy", value: "copy", icon: <Copy /> },
  { label: "Save", value: "save", icon: <Save /> },
  { label: "Export", value: "export", icon: <Download /> }
]

const verticalMenuItems = [
  { label: "Reset File", value: "reset", icon: <ListRestart /> },
  { label: "Repository", value: "repository", icon: <Github /> },
]

const HeaderMenu = () => {
  return (
    <Menu.Root>
      <Menu.Trigger asChild>
        <IconButton variant="solid" size="lg" aria-label="Open menu" rounded={"full"}>
            <SquareMenu />
        </IconButton>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            <Group grow gap="0" p={2}>
              {horizontalMenuItems.map((item) => (
                <Menu.Item
                  key={item.value}
                  value={item.value}
                  width="14"
                  gap="1"
                  flexDirection="column"
                  justifyContent="center"
                >
                  {item.icon}
                  {item.label}
                </Menu.Item>
              ))}
            </Group>
            {verticalMenuItems.map((item) => (
              <Menu.Item key={item.value} value={item.value}>
                <Box flex="1">{item.label}</Box>
                {item.icon}
              </Menu.Item>
            ))}
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  )
}

export default HeaderMenu;
