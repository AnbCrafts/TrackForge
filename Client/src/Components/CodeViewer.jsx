import Editor from "@monaco-editor/react";

export default function CodeViewer({ file }) {
  return (
    <div className="w-full h-[97vh]">
      <Editor
        width="100%"
        height="100%"
        language={getLanguageFromExtension(file?.filename)} // ✅ use language
        value={file?.content || ""}                          // ✅ use value
        theme="vs-dark"
        options={{
          readOnly: true,
          minimap: { enabled: true },
          lineNumbers: "on",
          scrollBeyondLastLine: false,
        }}
      />
    </div>
  );
}

function getLanguageFromExtension(filename) {
  if (!filename) return "plaintext";
  const ext = filename.split(".").pop();
  const map = {
    js: "javascript",
    jsx: "javascript",
    ts: "typescript",
    tsx: "typescript",
    html: "html",
    css: "css",
    json: "json",
    py: "python",
    cpp: "cpp",
    java: "java",
    md: "markdown",
  };
  return map[ext] || "plaintext";
}
