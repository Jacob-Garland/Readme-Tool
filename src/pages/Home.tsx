import { useNavigate } from "react-router-dom";
import { Box, Button, Code, Heading, Highlight, Text, Image, HStack } from "@chakra-ui/react";

export default function Home() {
    const navigate = useNavigate();
  
    return (
        <Box display={"flex"} flexDirection="column" alignItems="center" justifyContent="center" height="100vh">
        <Heading size={"3xl"} mb={5}>
            Welcome to the Ultimate
            <Highlight query={"README.md"} styles={{ px: 1, py: 0, borderRadius: "md", bg: "purple.200" }}>
                README.md
            </Highlight> 
            Tool!
        </Heading>

        <Box flexDirection={"row"} display="flex" justifyContent="space-between" gap={8} mt={2} mb={24}>
            <Button onClick={() => navigate("/new")} size={"xl"} colorPalette={"purple"}>New <Code>README.md</Code></Button>
            <Button onClick={() => navigate("/edit")} colorPalette={"purple"} size={"xl"} disabled>Edit A <Code>README.md</Code></Button>
            <Button colorPalette={"purple"} size={"xl"} disabled>New GitHub Profile README</Button>
        </Box>

        <Text>Made with ❤️ by Jacob Garland, with help from:</Text>
        <HStack p={2} mt={2}>
            <Image src="../../public/tauri.svg" alt="Tauri Logo" boxSize={"60px"} fit={"contain"}/>
            <Image src="../../public/react.svg" alt="React Logo" boxSize={"60px"} fit={"contain"}/>
        </HStack>
        </Box>
    );
}
