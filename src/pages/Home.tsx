import { useNavigate } from "react-router-dom";
import { Box, Button, Heading, Highlight, Text } from "@chakra-ui/react";

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

        <Box flexDirection={"row"} display="flex" gap={8} mt={2} mb={6}>
            <Button onClick={() => navigate("/new")} size={"xl"} colorPalette={"purple"}>New Readme</Button>
            <br />
            <Button onClick={() => navigate("/edit")} colorPalette={"purple"} size={"xl"}>Edit A Readme</Button>
        </Box>

        <Text>Made with ❤️ by Jacob Garland</Text>
        </Box>
    );
}
