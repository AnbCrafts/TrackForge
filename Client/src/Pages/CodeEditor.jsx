import React, { useContext, useEffect, useState } from 'react';
import { TrackForgeContextAPI } from '../ContextAPI/TrackForgeContextAPI';
import { Link, useParams } from 'react-router-dom';
import { ChevronDown, ChevronRight } from "lucide-react";
import { toast } from 'react-toastify';
import CodeViewer from '../Components/CodeViewer';

const CodeEditor = () => {
  const { fetchProjectFiles, thisProjectFiles, serverURL, projectById, project } = useContext(TrackForgeContextAPI);
  const { username, hash, projectId } = useParams();
  const basePath = `/auth/${hash}/${username}/workspace`;

  useEffect(() => {
    fetchProjectFiles(projectId);
    if (projectId) {
      projectById(projectId);
    }
  }, [projectId]);

  // multiple opened files like VS Code
  const [openedFiles, setOpenedFiles] = useState([]);
  const [activeFile, setActiveFile] = useState(null);

  const handleFileClick = async (file) => {
    try {
      if (!file?.path) throw new Error("File path missing");

      const response = await fetch(`${serverURL}/project/files/content?fileUrl=${encodeURIComponent(file.path)}`);
      const text = await response.text();

      const opened = {
        ...file,
        content: text,
      };

      // Add to opened tabs if not already
      setOpenedFiles((prev) => {
        const exists = prev.find((f) => f.path === file.path);
        if (exists) return prev; // already open
        return [...prev, opened];
      });

      setActiveFile(opened);
    } catch (error) {
      console.error("Error loading file:", error);
      toast.error("Failed to load file content");
    }
  };

  const closeFile = (file) => {
    const remaining = openedFiles.filter(f => f.path !== file.path);
    setOpenedFiles(remaining);

    // if closing active file, switch to last opened
    if (activeFile?.path === file.path) {
      setActiveFile(remaining.length ? remaining[remaining.length - 1] : null);
    }
  };

  // When switching tabs
  const handleTabClick = async (file) => {
    try {
      const response = await fetch(`${serverURL}/project/files/content?fileUrl=${encodeURIComponent(file.path)}`);
      const text = await response.text();

      const refreshedFile = {
        ...file,
        content: text,
      };

      // Replace with fresh content in openedFiles
      setOpenedFiles((prev) =>
        prev.map((f) => (f.path === file.path ? refreshedFile : f))
      );

      setActiveFile(refreshedFile);
    } catch (error) {
      console.error("Error reloading file:", error);
      toast.error("Failed to reload file content");
    }
  };

  const blockedFolders = ["images", "pictures", "photos", "photo", "img", "pic"];
  const projectName = project?.project?.name || "root";

  // Build tree from files
  const filteredProjectFiles = thisProjectFiles?.filter(f => !blockedFolders.includes(f.name?.toLowerCase())) || [];
  const treeData = buildFileTree(filteredProjectFiles, projectName);

  return (
    <div className='min-h-[90vh] w-full flex flex-col p-4 bg-primary text-primary'>
      <div className="flex items-center justify-between mb-4 bg-card border border-default p-4 rounded-xl shadow">
        <h1 className="text-xl font-bold flex items-center gap-3">
          💻 Code Editor — <span className="text-neon">{projectName}</span>
        </h1>
        <Link
          to={`${basePath}/projects/${projectId}`}
          className="text-xs font-semibold btn-gradient text-white px-4 py-2 rounded-xl shadow hover:opacity-90 transition cursor-pointer"
        >
          Go back to project
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-[75vh] items-stretch">
        {/* LEFT COLUMN: Sidebar Explorer */}
        <div className="w-full lg:w-80 bg-card border border-default rounded-2xl p-4 flex flex-col shadow-lg">
          <h2 className="text-xs font-bold text-secondary uppercase tracking-wider mb-3 pb-2 border-b border-default/50">
            Workspace Explorer
          </h2>
          <div className="flex-1 overflow-y-auto noScroll max-h-[70vh]">
            {thisProjectFiles && thisProjectFiles.length ? (
              <TreeNode node={treeData} depth={0} onFileClick={handleFileClick} />
            ) : (
              <p className="text-xs text-muted">No files in this project</p>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Tab Bar & Code Editor */}
        <div className="flex-1 flex flex-col bg-card border border-default rounded-2xl shadow-lg overflow-hidden">
          {/* Tabs */}
          {openedFiles.length > 0 ? (
            <div className="flex border-b border-default bg-secondary/30 overflow-x-auto noScroll">
              {openedFiles.map((file) => (
                <div
                  key={file.path}
                  className={`px-4 py-2.5 flex items-center gap-2 border-r border-default cursor-pointer text-xs font-bold transition-all ${
                    activeFile?.path === file.path
                      ? "bg-card text-neon border-t-2 border-t-[var(--border-neon)]"
                      : "text-muted hover:bg-secondary/50"
                  }`}
                  onClick={() => handleTabClick(file)}
                >
                  <span>{file.filename.split('/').pop()}</span>
                  <button
                    className='cursor-pointer text-muted hover:text-red-400 font-bold ml-1 transition-colors'
                    onClick={(e) => {
                      e.stopPropagation();
                      closeFile(file);
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          ) : null}

          {/* Active file editor or empty state */}
          <div className="flex-1 flex flex-col min-h-[50vh] relative">
            {activeFile ? (
              <CodeViewer file={activeFile} />
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-muted p-8 text-center bg-secondary/5">
                <svg className="w-16 h-16 text-muted/30 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h3 className="text-sm font-bold text-primary mb-1">No File Open</h3>
                <p className="text-xs text-muted max-w-xs">
                  Select a file from the Workspace Explorer sidebar to view and edit its contents.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper to build hierarchical folder tree
function buildFileTree(folders = [], projectName = "root") {
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

const TreeNode = ({ node, depth = 0, onFileClick }) => {
  const [isOpen, setIsOpen] = useState(depth === 0);

  if (node.type === "file") {
    return (
      <div
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
        className="flex items-center justify-between py-1.5 border-b border-default/5 hover:bg-hover/10 rounded transition text-xs"
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
        className="flex items-center justify-between py-1.5 cursor-pointer hover:bg-hover/20 transition rounded border-b border-default/10"
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
          className="text-[10px] text-muted py-1 italic"
        >
          Empty directory
        </div>
      )}
    </div>
  );
};

export default CodeEditor;
