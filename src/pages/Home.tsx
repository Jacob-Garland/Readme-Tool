import { useNavigate } from "react-router-dom";
import { Box, Button, Code, Heading, Highlight, Text, Image, HStack } from "@chakra-ui/react";
import { ColorModeSwitch } from "@/components/ui/color-mode";

export default function Home() {
    const navigate = useNavigate();
  
    return (
        <Box display={"flex"} flexDirection="column" alignItems="center" justifyContent="center" height="100vh">
            <Heading size={"3xl"} mb={5}>
                Welcome to the Ultimate
                <Highlight query={"README.md"} styles={{ px: 3, py: 0, borderRadius: "md", bg: "purple.200" }}>
                    README.md
                </Highlight> 
                Tool!
            </Heading>

            <Box flexDirection={"row"} display="flex" justifyContent="space-between" gap={8} mt={2} mb={24}>
                <Button onClick={() => navigate("/new")} size={"xl"} colorPalette={"purple"}>New <Code>README.md</Code></Button>
                <Button onClick={() => navigate("/edit")} colorPalette={"purple"} size={"xl"}>Edit A <Code>README.md</Code></Button>
                <Button onClick={() => navigate("/git")} colorPalette={"purple"} size={"xl"}>New GitHub Profile <Code>README.md</Code></Button>
            </Box>

            <HStack p={2} mt={2}>
                <Text fontWeight={"semibold"}>Created by Jacob Garland with</Text>
                <Image src="../../public/tauri.svg" alt="Tauri Logo" boxSize={"50px"} fit={"contain"}/>
                <Image src="../../public/react.svg" alt="React Logo" boxSize={"50px"} fit={"contain"}/>
            </HStack>
            
            <ColorModeSwitch />
        </Box>
    );
}
