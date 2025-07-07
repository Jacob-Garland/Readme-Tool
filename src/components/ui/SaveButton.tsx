import { IconButton } from '@chakra-ui/react';
import { Save } from 'lucide-react';
import { saveStore } from '@/utils/store';
import { toaster } from './toaster';

const SaveButton = () => {
    const handleSave = async () => {
        try {
            await saveStore();
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
            console.error("Error saving sections:", error);
        }
    };

  return (
    <IconButton
      aria-label="Save"
      onClick={handleSave}
      variant="solid"
      colorPalette={"purple"}
      size="lg"
      p={2}
      mr={4}
    >
      <Save /> Save
    </IconButton>
  );
};

export default SaveButton;