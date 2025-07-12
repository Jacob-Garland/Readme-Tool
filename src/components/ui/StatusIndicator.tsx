import { HStack, Spinner, Status, Text } from '@chakra-ui/react';
import React, { useEffect, useRef, useState } from 'react';

// Props: saving (true when saving), onSave (callback to reset timer)
interface StatusIndicatorProps {
  saving: boolean;
}

// This component shows a loading spinner or a status indicator based on the saving prop
// Shows a live-updating timer for seconds since last save, resets on save
const StatusIndicator: React.FC<StatusIndicatorProps> = ({ saving }) => {
  const [secondsSinceSave, setSecondsSinceSave] = useState(0);
  const prevSaving = useRef(false);
  const intervalRef = useRef<number | null>(null);

  // Start timer when not saving, reset on save
  useEffect(() => {
    // If just finished saving, reset timer
    if (prevSaving.current && !saving) {
      setSecondsSinceSave(0);
    }
    prevSaving.current = saving;
  }, [saving]);

  // Increment timer every second when not saving
  useEffect(() => {
    if (!saving) {
      intervalRef.current = setInterval(() => {
        setSecondsSinceSave((s) => s + 1);
      }, 1000);
    } else {
      setSecondsSinceSave(0);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [saving]);

  if (saving) {
    return (
      <HStack>
        <Spinner size="md" color="yellow.600" borderWidth={"4px"} />
        <Text fontSize="md">Saving draft...</Text>
      </HStack>
    );
  }

  return (
    <Status.Root colorPalette="green">
      <Status.Indicator />
      <Text fontSize="md">
        Draft Saved{secondsSinceSave > 0 ? ` ${secondsSinceSave} second${secondsSinceSave === 1 ? '' : 's'} ago` : ''}
      </Text>
    </Status.Root>
  );
};

export default StatusIndicator;
