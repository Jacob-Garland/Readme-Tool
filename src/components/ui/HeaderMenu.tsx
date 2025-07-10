import { Box, IconButton, Group, Menu, Portal } from "@chakra-ui/react"
import { Copy, Download, ListRestart, Save, Github, SquareMenu } from "lucide-react"
import { toaster } from './toaster';
import { clearDraft, clearSettings, setDraft } from '@/utils/store';
import { save } from '@tauri-apps/plugin-dialog';
import { writeTextFile } from '@tauri-apps/plugin-fs';
import { Draft } from '../../types';

type HeaderMenuProps = {
  markdown: string;
  onReset: () => void;
  draft: Draft;
};

const HeaderMenu: React.FC<HeaderMenuProps> = ({ markdown, onReset, draft }) => {
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

  // Save logic: saves draft via Tauri, shows error/success toasters
  const handleSave = async () => {
    try {
      await setDraft(draft);
      toaster.create({
        title: 'Draft saved',
        description: 'Your draft has been saved successfully.',
        type: 'success',
      });
    } catch (error) {
      toaster.create({
        title: 'Save failed',
        description: 'There was an error saving your draft. Please try again.',
        type: 'error',
      });
      console.error('Error saving draft:', error);
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
    await clearDraft();
    onReset();
    toaster.create({
      title: 'Editor Reset',
      description: 'Editor draft has been cleared.',
      type: 'info',
    });
  };

  // Reset logic for settings
  const handleResetSettings = async () => {
    await clearSettings();
    toaster.create({
      title: 'Settings Reset',
      description: 'Settings have been reset to default.',
      type: 'info',
    });
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
            <Menu.Item
              value="export"
              onClick={handleDownload}
            >
              <Box flex="1">Export File</Box>
              <Download />
            </Menu.Item>
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
