import React from "react";
import { Button, Icon } from "@chakra-ui/react";
import { DiamondPlus } from "lucide-react";
import { useEditorStore } from "../../stores/editorStore";

const AddTOCButton: React.FC = () => {
    const addDraftSection = useEditorStore((s) => s.addDraftSection);

    const handleAddTOC = () => {
        // Only one ToC, use a fixed id
        addDraftSection({
            id: "toc",
            title: "Table of Contents",
            content: "",
        });
    };

    return (
        <Button
            variant={"solid"}
            color={"purple.500"}
            w="80%"
            fontSize={"md"}
            onClick={handleAddTOC}
        >
            <Icon as={DiamondPlus} /> Add Table of Contents
        </Button>
    );
};

export default AddTOCButton;