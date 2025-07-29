import React from "react";
import MonacoEditor from "@monaco-editor/react";
import { useEditorStore } from "../stores/editorStore";

interface MonacoEditorWrapperProps {
  value: string;
  onChange: (value: string) => void;
  height?: string;
  width?: string;
}

const MonacoEditorWrapper: React.FC<MonacoEditorWrapperProps> = ({
  value,
  height = "77vh",
  width = "75%",
}) => {
  const syncSectionsFromMarkdown = useEditorStore((s) => s.syncSectionsFromMarkdown);

  return (
    <MonacoEditor
      height={height}
      width={width}
      defaultLanguage="markdown"
      theme="vs-dark"
      value={value}
      options={{
        fontSize: 16,
        minimap: { enabled: false },
        wordWrap: "on",
        scrollBeyondLastLine: false,
        lineNumbers: "on",
      }}
      onChange={(val) => {
        if (val !== undefined) syncSectionsFromMarkdown(val);
      }}
    />
  );
};

export default MonacoEditorWrapper;
