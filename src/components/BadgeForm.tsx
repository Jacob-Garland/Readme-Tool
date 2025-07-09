import {
  Button,
  Field,
  Icon,
  Input,
  Popover,
  Portal,
  Stack,
  Textarea,
} from "@chakra-ui/react";
import React, { useRef, useState } from "react";
import { toaster } from "./ui/toaster";
import { DiamondPlus } from "lucide-react";

interface BadgeFormProps {
  onInsert: (markdown: string, opts?: { section?: string }) => void;
  selections: string[];
}

const BadgeForm: React.FC<BadgeFormProps> = ({ onInsert, selections }) => {
    const baseURL = "https://img.shields.io/badge/";
    const labelRef = useRef<HTMLInputElement>(null);
    const messageRef = useRef<HTMLInputElement>(null);
    const leftColorRef = useRef<HTMLInputElement>(null);
    const rightColorRef = useRef<HTMLInputElement>(null);
    const quickRef = useRef<HTMLTextAreaElement>(null);
    const [loading, setLoading] = useState(false);

    // Helper to build badge URL
    const buildBadgeURL = (label: string, message: string, leftColor: string, rightColor: string) => {
      // Encode for URL
      const enc = (s: string) => encodeURIComponent(s || "");
      let url = baseURL + enc(label);
      if (message) url += "-" + enc(message);
      if (leftColor) url += "-" + enc(leftColor);
      if (rightColor) url += "?color=" + enc(rightColor);
      return url;
    };

    // Handler for custom badge
    const handleAddBadge = () => {
      setLoading(true);
      try {
        const label = labelRef.current?.value.trim() || "";
        const message = messageRef.current?.value.trim() || "";
        const leftColor = leftColorRef.current?.value.trim() || "";
        const rightColor = rightColorRef.current?.value.trim() || "";
        if (!label) throw new Error("Label is required");
        const url = buildBadgeURL(label, message, leftColor, rightColor);
        const md = `![Static Badge](${url})`;
        // If Badges section is in selections, append to that section
        if (selections.includes("Badges")) {
          onInsert(md, { section: "Badges" });
        } else {
          onInsert(md);
        }
        toaster.create({
          title: "Badge added!",
          description: "Your badge markdown was inserted.",
          type: "success",
        });
      } catch (e: any) {
        toaster.create({
          title: "Badge error",
          description: e.message || "Could not create badge.",
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    // Handler for quick badge
    const handleQuickBadge = () => {
      setLoading(true);
      try {
        const val = quickRef.current?.value.trim() || "";
        if (!val) throw new Error("Quick badge input required");
        // Format: label-message-color (like shields.io)
        const [label, message, color] = val.split("-");
        if (!label) throw new Error("Label required in quick badge");
        const url = buildBadgeURL(label, message || "", color || "", "");
        const md = `![Static Badge](${url})`;
        if (selections.includes("Badges")) {
          onInsert(md, { section: "Badges" });
        } else {
          onInsert(md);
        }
        toaster.create({
          title: "Badge added!",
          description: "Your quick badge markdown was inserted.",
          type: "success",
        });
      } catch (e: any) {
        toaster.create({
          title: "Badge error",
          description: e.message || "Could not create badge.",
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    return (
    <Popover.Root>
        <Popover.Trigger asChild>
            <Button variant={"solid"} color={"purple.500"} fontSize={"md"} w={"80%"} loading={loading}>
                <Icon as={DiamondPlus} mr={1} /> Make a Badge
            </Button>
        </Popover.Trigger>
        <Portal>
            <Popover.Positioner>
            <Popover.Content>
                <Popover.Arrow />
                <Popover.Body>
                <Stack gap="4">
                    <Field.Root>
                        <Field.Label>Label</Field.Label>
                        <Input placeholder="Left-hand-side text" ref={labelRef} />
                    </Field.Root>
                    <Field.Root>
                        <Field.Label>Message (optional)</Field.Label>
                        <Input placeholder="Right-hand-side text" ref={messageRef} />
                    </Field.Root>
                    <Field.Root>
                        <Field.Label>Left Label Color</Field.Label>
                        <Input placeholder="Background of left label (hex, rgb, rgba, etc.)" ref={leftColorRef} />
                    </Field.Root>
                    <Field.Root>
                        <Field.Label>Right Color (optional)</Field.Label>
                        <Input placeholder="Background of right label (hex, rgb, rgba, etc.)" ref={rightColorRef} />
                    </Field.Root>
                    <Button onClick={handleAddBadge} loading={loading}>Build Badge</Button>
                    <Field.Root>
                        <Field.Label>Quick Badge</Field.Label>
                        <Textarea placeholder="Label-message-color (e.g. build-passing-brightgreen)" ref={quickRef} />
                    </Field.Root>
                    <Button onClick={handleQuickBadge} loading={loading}>Quick Badge</Button>
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