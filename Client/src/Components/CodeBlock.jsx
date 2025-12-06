import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function CodeBlock({ file }) {
  return (
    <div className="w-full overflow-x-auto rounded-lg">
      <SyntaxHighlighter
        language={getLanguageFromExtension(file?.filename)}
        style={vscDarkPlus}
        showLineNumbers
        customStyle={{
          margin: 0,
          background: "transparent",
        }}
      >
        {file?.content || ""}
      </SyntaxHighlighter>
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
    c: "c",
    java: "java",
    md: "markdown",
    sql: "sql",
    sh: "bash",
    xml: "xml",
    txt: "plaintext",
  };

  return map[ext] || "plaintext";
}
