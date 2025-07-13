import { Box, IconButton, Group, Menu, Portal, Separator } from "@chakra-ui/react"
import { Copy, Download, ListRestart, Save, Github, SquareMenu } from "lucide-react"
import { toaster } from './toaster';
import { useAppStore } from '../../stores/appStore';
import { useEditorStore } from '../../stores/editorStore';
import { save, confirm } from '@tauri-apps/plugin-dialog';
import { writeTextFile } from '@tauri-apps/plugin-fs';

type HeaderMenuProps = {
  markdown: string;
};

const HeaderMenu: React.FC<HeaderMenuProps> = ({ markdown }) => {
  const saveDraft = useEditorStore((s) => s.saveDraft);
  const saveStatus = useEditorStore((s) => s.saveStatus);
  const resetSaveStatus = useEditorStore((s) => s.resetSaveStatus);
  const resetDraft = useEditorStore((s) => s.resetDraft);
  const clearSettings = useAppStore((s) => s.clearSettings);
  // Copy logic
  const handleCopy = () => {
    try {
      navigator.clipboard.writeText(markdown);
      toaster.create({
        title: 'Copied to clipboard',
        description: 'The file has been copied successfully.',
        type: 'success',
      });
    } catch (error) {
      toaster.create({
        title: 'Copy failed',
        description: 'Unsuccessful file copy. Please try again...',
        type: 'error',
      });
    }
  };

  // Save logic: saves draft via zustand store, shows success toaster
  const handleSave = async () => {
    await saveDraft();
    if (saveStatus === "saved") {
      toaster.create({
        title: 'Draft saved',
        description: 'Your draft has been saved successfully.',
        type: 'success',
      });
    } else if (saveStatus === "error") {
      toaster.create({
        title: 'Save failed',
        description: 'There was an error saving your draft.',
        type: 'error',
      });
    }
  };

  // Download logic
  const handleDownload = async () => {
    try {
      const filePath = await save({
        defaultPath: 'README.md',
        filters: [
          {
            name: 'Markdown Files',
            extensions: ['md'],
          },
        ],
      });
      if (filePath) {
        // Save the markdown content to the selected file
        await writeTextFile(filePath, markdown);
        toaster.create({
          title: 'Download successful',
          description: 'Your file has been downloaded successfully.',
          type: 'success',
        });
        console.log("File downloaded to:", filePath);
      } else {
        toaster.create({
          title: 'Download failed',
          description: 'There was an error downloading your file. Please try again.',
          type: 'error',
        });
      }
    } catch (error) {
      toaster.create({
        title: 'Download failed',
        description: 'There was an error downloading your file. Please try again.',
        type: 'error',
      });
      console.error("Error downloading file:", error);
    }
  };

  // Repository logic
  const handleRepository = () => {
    window.open('https://github.com/Jacob-Garland/Readme-Tool', '_blank', 'noopener,noreferrer');
  };

  // Reset logic for draft
  const handleResetDraft = async () => {
    let confirmation = false;
    try {
      confirmation = await confirm(
        'Are you sure you want to reset the editor? This will clear all your current draft content.',
        {
          title: 'Ultimate README Tool: WARNING!',
          kind: 'warning',
          okLabel: 'Reset',
          cancelLabel: 'Cancel',
        }
      );
    } catch {
      // Fallback for browser or if plugin fails
      confirmation = window.confirm('Are you sure you want to reset the editor? This will clear all your current draft content.');
    }
    if (confirmation) {
      resetDraft();
      resetSaveStatus();
      toaster.create({
        title: 'Editor Reset',
        description: 'Editor draft has been cleared.',
        type: 'success',
      });
    }
  };

  // Reset logic for settings
  const handleResetSettings = async () => {
    let confirmation = false;
    try {
      confirmation = await confirm(
        'Are you sure you want to reset settings? This will reset the app settings to default.',
        {
          title: 'Ultimate README Tool: WARNING!',
          kind: 'warning',
          okLabel: 'Reset',
          cancelLabel: 'Cancel',
        }
      );
    } catch {
      // Fallback for browser or if plugin fails
      confirmation = window.confirm('Are you sure you want to reset settings? This will clear all your custom settings.');
    }
    if (confirmation) {
      clearSettings();
      toaster.create({
        title: 'Settings Reset',
        description: 'Settings have been reset to default.',
        type: 'info',
      });
    };
  };

  return (
    <Menu.Root closeOnSelect={true}>
      <Menu.Trigger asChild>
        <IconButton variant="solid" size="lg" aria-label="Open Menu" rounded={"full"}>
          <SquareMenu />
        </IconButton>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            <Group grow gap="0" p={2}>
              <Menu.Item
                value="copy"
                width="14"
                gap="1"
                flexDirection="column"
                justifyContent="center"
                onClick={handleCopy}
              >
                <Copy />
                Copy
              </Menu.Item>
              {/* Manual Save button for draft in editor */}
              <Menu.Item
                value="save"
                width="14"
                gap="1"
                flexDirection="column"
                justifyContent="center"
                onClick={handleSave}
              >
                <Save />
                Save
              </Menu.Item>
            </Group>
            <Separator />
            <Menu.Item
              value="export"
              onClick={handleDownload}
            >
              <Box flex="1">Export File</Box>
              <Download />
            </Menu.Item>
            <Menu.Item
              value="reset-draft"
              color="fg.error"
              _hover={{ bg: "bg.error", color: "fg.error" }}
              onClick={handleResetDraft}
            >
              <Box flex="1">Reset Editor</Box>
              <ListRestart />
            </Menu.Item>
            <Menu.Item
              value="reset-settings"
              color="fg.error"
              _hover={{ bg: "bg.error", color: "fg.error" }}
              onClick={handleResetSettings}
            >
              <Box flex="1">Reset Settings</Box>
              <ListRestart />
            </Menu.Item>
            <Separator />
            <Menu.Item
              value="repository"
              onClick={handleRepository}
            >
              <Box flex="1">Repository</Box>
              <Github />
            </Menu.Item>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
};

export default HeaderMenu;
