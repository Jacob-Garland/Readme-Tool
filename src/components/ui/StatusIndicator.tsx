import { HStack, Spinner, Status, Text } from '@chakra-ui/react';
import React, { useEffect, useRef, useState } from 'react';
import { useEditorStore } from '../../stores/editorStore';

// This component shows a loading spinner or a status indicator based on the saveStatus in the store
// Shows a live-updating timer for seconds since last save, resets on save
const StatusIndicator: React.FC = () => {
  const saveStatus = useEditorStore((s) => s.saveStatus);
  const [secondsSinceSave, setSecondsSinceSave] = useState(0);
  const prevStatus = useRef<null | string>(null);
  const intervalRef = useRef<number | null>(null);

  // Start timer when not saving, reset on save
  useEffect(() => {
    if (prevStatus.current === "saving" && saveStatus === "saved") {
      setSecondsSinceSave(0);
    }
    prevStatus.current = saveStatus;
  }, [saveStatus]);

  // Increment timer every second when not saving
  useEffect(() => {
    if (saveStatus === "saved") {
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
  }, [saveStatus]);

  if (saveStatus === "saving") {
    return (
      <HStack>
        <Spinner size="md" color="yellow.600" borderWidth={"4px"} />
        <Text fontSize="md">Saving draft...</Text>
      </HStack>
    );
  }
  if (saveStatus === "error") {
    return (
      <Status.Root colorPalette="red">
        <Status.Indicator />
        <Text fontSize="md">Save failed</Text>
      </Status.Root>
    );
  }
  // Show autosave status with seconds/minutes
  let timeString = '';
  if (secondsSinceSave > 0 && secondsSinceSave < 60) {
    timeString = ` ${secondsSinceSave} second${secondsSinceSave === 1 ? '' : 's'} ago`;
  } else if (secondsSinceSave >= 60) {
    const minutes = Math.floor(secondsSinceSave / 60);
    timeString = ` ${minutes} minute${minutes === 1 ? '' : 's'} ago`;
  }
  
  return (
    <Status.Root colorPalette="green">
      <Status.Indicator />
      <Text fontSize="md">
        Draft Saved{timeString}
      </Text>
    </Status.Root>
  );
};

export default StatusIndicator;
