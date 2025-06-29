import { Tabs, Box, Textarea } from "@chakra-ui/react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";

const Editor = () => {
    const [raw, setRaw] = useState<string>("");

    return (
        <Tabs.Root variant="outline" size="md" defaultValue="raw" mt={10} mb={10} mx="auto">
            <Tabs.List>
                <Tabs.Trigger value="raw">Raw Editor</Tabs.Trigger>
                <Tabs.Trigger value="preview">Output Preview</Tabs.Trigger>
            </Tabs.List>

            <Tabs.ContentGroup
                _open={{
                animationName: "fade-in, scale-in",
                animationDuration: "300ms",
                }}
                _closed={{
                    animationName: "fade-out, scale-out",
                    animationDuration: "120ms",
                }}>
                <Tabs.Content value="raw" p={6}>
                    <Textarea
                        value={raw}
                        onChange={(e) => setRaw(e.target.value)}
                        h="70vh"
                        w={"75%"}
                        placeholder="Write your README here..."
                        fontFamily="mono"
                        resize="none"
                    />
                </Tabs.Content>
                <Tabs.Content value="preview">
                    <Box h="70vh" p={4}>
                        <Box>
                        <ReactMarkdown skipHtml>
                            {raw}
                        </ReactMarkdown>
                        </Box>
                    </Box>
                </Tabs.Content>
            </Tabs.ContentGroup>
        </Tabs.Root>
    );
};

export default Editor;
