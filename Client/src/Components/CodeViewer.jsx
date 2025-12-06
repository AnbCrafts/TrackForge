import Editor from "@monaco-editor/react";

export default function CodeViewer({ file }) {
  return (
    <div className="w-full h-screen max-h-[97vh] overflow-hidden rounded-lg">
      <Editor
        width="100%"
        height="100%"
        language={getLanguageFromExtension(file?.filename)}
        value={file?.content || ""}
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

  const ext = filename.split(".").pop().toLowerCase();
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
