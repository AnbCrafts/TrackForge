import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

// Helper to build hierarchical folder tree
export function buildFileTree(folders = [], projectName = "root") {
  const rootNode = {
    name: projectName,
    type: "folder",
    children: [],
  };

  function addFileToNode(parentNode, pathParts, fileObj) {
    let current = parentNode;
    for (let i = 0; i < pathParts.length; i++) {
      const part = pathParts[i];
      if (i === pathParts.length - 1) {
        if (!current.children.some(child => child.type === "file" && child.name === part)) {
          current.children.push({
            name: part,
            type: "file",
            file: fileObj,
          });
        }
      } else {
        let folderNode = current.children.find(
          (child) => child.type === "folder" && child.name === part
        );
        if (!folderNode) {
          folderNode = {
            name: part,
            type: "folder",
            children: [],
          };
          current.children.push(folderNode);
        }
        current = folderNode;
      }
    }
  }

  folders.forEach((folder) => {
    const isRootFolder = folder.name.toLowerCase() === projectName.toLowerCase();
    
    // Ensure folder.files is defined
    const files = folder.files || [];
    files.forEach((file) => {
      const normalizedFilename = file.filename.replace(/\\/g, "/");
      const filenameParts = normalizedFilename.split("/").filter(Boolean);

      if (isRootFolder) {
        addFileToNode(rootNode, filenameParts, file);
      } else {
        const folderParts = folder.name.split("/").filter(Boolean);
        addFileToNode(rootNode, [...folderParts, ...filenameParts], file);
      }
    });

    if ((!folder.files || folder.files.length === 0) && !isRootFolder) {
      const folderParts = folder.name.split("/").filter(Boolean);
      let current = rootNode;
      folderParts.forEach((part) => {
        let folderNode = current.children.find(
          (child) => child.type === "folder" && child.name === part
        );
        if (!folderNode) {
          folderNode = {
            name: part,
            type: "folder",
            children: [],
          };
          current.children.push(folderNode);
        }
        current = folderNode;
      });
    }
  });

  return rootNode;
}

export const TreeNode = ({ node, depth = 0, onFileClick, defaultOpen }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen !== undefined ? defaultOpen : depth === 0);

  if (node.type === "file") {
    return (
      <div
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
        className="flex items-center justify-between py-2 border-b border-default/5 hover:bg-hover/10 rounded transition text-xs"
      >
        <div className="flex items-center gap-2 min-w-0">
          <span className="shrink-0">📄</span>
          {onFileClick ? (
            <button
              onClick={() => onFileClick(node.file)}
              className="text-left font-semibold text-[var(--text-neon)] hover:underline truncate cursor-pointer bg-transparent border-none p-0 outline-none"
            >
              {node.name}
            </button>
          ) : (
            <a
              href={node.file.path}
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-[var(--text-neon)] hover:underline truncate"
            >
              {node.name}
            </a>
          )}
          <span className="text-[9px] text-muted shrink-0">
            ({Math.round(node.file.size / 1024)} KB)
          </span>
        </div>
        <div className="text-[9px] text-muted font-mono shrink-0 pr-2">
          {new Date(node.file.uploadedAt || Date.now()).toLocaleDateString()}
        </div>
      </div>
    );
  }

  // Count total nested files in this folder (including files in subfolders)
  const countTotalFiles = (n) => {
    let count = 0;
    if (n.children) {
      n.children.forEach(child => {
        if (child.type === 'file') count++;
        else count += countTotalFiles(child);
      });
    }
    return count;
  };
  const totalFiles = countTotalFiles(node);

  return (
    <div className="w-full">
      <div
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
        className="flex items-center justify-between py-2 cursor-pointer hover:bg-hover/20 transition rounded border-b border-default/10"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          <span className="text-sm">📂</span>
          <span className="font-bold text-primary text-xs">{node.name}</span>
          <span className="text-[9px] text-muted font-medium">
            ({totalFiles} {totalFiles === 1 ? 'file' : 'files'})
          </span>
        </div>
        <div className="text-muted pr-2">
          {isOpen ? (
            <ChevronDown className="h-3.5 w-3.5" />
          ) : (
            <ChevronRight className="h-3.5 w-3.5" />
          )}
        </div>
      </div>
      {isOpen && node.children && node.children.length > 0 && (
        <div className="flex flex-col">
          {node.children.map((child, idx) => (
            <TreeNode key={idx} node={child} depth={depth + 1} onFileClick={onFileClick} />
          ))}
        </div>
      )}
      {isOpen && node.children && node.children.length === 0 && (
        <div
          style={{ paddingLeft: `${(depth + 1) * 16 + 8}px` }}
          className="text-[10px] text-muted py-1.5 italic"
        >
          Empty directory
        </div>
      )}
    </div>
  );
};
