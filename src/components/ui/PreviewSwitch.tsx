import { Stack, Switch, Text } from "@chakra-ui/react"
import { Dispatch, SetStateAction } from "react";

interface PreviewSwitchProps {
    isGitView: boolean;
    setIsGitView: Dispatch<SetStateAction<boolean>>;
}

const PreviewSwitch: React.FC<PreviewSwitchProps> = ({ isGitView, setIsGitView }) => {
    const handleSwitchChange = (details: { checked: boolean }) => {
        setIsGitView(details.checked);
    };

    return (
        <Stack
            align={"center"}
            direction={"row"}
            p={4}
        >
            <Text fontSize={"md"} mr={3}>Raw MD</Text>
            <Switch.Root colorPalette={"purple"} size={"lg"} checked={isGitView} onCheckedChange={handleSwitchChange}>
                <Switch.HiddenInput />
                <Switch.Control />
                <Switch.Label />
            </Switch.Root>
            <Text fontSize={"md"}>Git-View</Text>
        </Stack>
    )
}

export default PreviewSwitch;
