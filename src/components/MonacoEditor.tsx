import React from "react";
import MonacoEditor from "@monaco-editor/react";

interface MonacoEditorWrapperProps {
  value: string;
  onChange: (value: string) => void;
  height?: string;
  width?: string;
}

const MonacoEditorWrapper: React.FC<MonacoEditorWrapperProps> = ({
  value,
  onChange,
  height = "77vh",
  width = "75%",
}) => {
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
      onChange={(val) => onChange(val ?? "")}
    />
  );
};

export default MonacoEditorWrapper;
