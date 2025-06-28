import { useNavigate } from "react-router-dom";
import { Box, Button, Heading, Text } from "@chakra-ui/react";

export default function Home() {
    const navigate = useNavigate();
  
    return (
        <Box display={"flex"} flexDirection="column" alignItems="center" justifyContent="center" height="100vh">
        <Heading size={"3xl"} mb={5}>Welcome to the Readme Generator!</Heading>

        <Box flexDirection={"column"} display="flex" mt={4} mb={4}>
            <Button maxW={"xl"} onClick={() => navigate("/new")}>New Readme</Button>
            <br />
            <Button maxW={"xl"} onClick={() => navigate("/edit")}>Edit A Readme</Button>
        </Box>

        <Text>Made with ❤️ by Jacob Garland</Text>
        </Box>
    );
}
