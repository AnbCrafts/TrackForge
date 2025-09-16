import React, { useContext, useEffect, useState } from 'react';
import { TrackForgeContextAPI } from '../ContextAPI/TrackForgeContextAPI';
import { Link, useParams } from 'react-router-dom';
import { ChevronDown, ChevronRight } from "lucide-react";
import { toast } from 'react-toastify';
import CodeViewer from '../Components/CodeViewer';

const CodeEditor = () => {
  const { fetchProjectFiles, thisProjectFiles } = useContext(TrackForgeContextAPI);
  const { username, hash, projectId } = useParams();
  const basePath = `/auth/${hash}/${username}/workspace`;

  useEffect(() => {
    fetchProjectFiles(projectId);
  }, [projectId]);

  const [openedFolder, setOpenedFolder] = useState({ key: 0, open: false });

  // multiple opened files like VS Code
  const [openedFiles, setOpenedFiles] = useState([]);
  const [activeFile, setActiveFile] = useState(null);

  const handleFileClick = async (file) => {
  try {
    if (!file?.path) throw new Error("File path missing");

    const response = await fetch(file.path);
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
    const response = await fetch(file.path);
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


  return (
    <div className='min-h-[100vh] w-full mx-auto'>
      <div className="border border-gray-200 rounded-lg p-4">
        <h1 className="text-2xl font-medium text-gray-800 flex items-center justify-start gap-10">
           
          <Link
            to={`${basePath}/projects/${projectId}`}
            className="text-sm bg-gray-800 text-white px-4 py-1 rounded cursor-pointer"
          >
            Go back to project
          </Link>
        </h1>

        {thisProjectFiles && thisProjectFiles.length ? 
        (
          <ul className="mt-5 py-5 flex items-start justify-start gap-5 flex-wrap">
            {
            
            thisProjectFiles.map((f, i) =>
            (!(blockedFolders.includes(f?.name?.toLowerCase())) ) &&
            (
              <li key={i} className="mb-3">
                {/* Folder header */}
                <div
                  onClick={() =>
                    setOpenedFolder({
                      key: i,
                      open: openedFolder.key === i ? !openedFolder.open : true,
                    })
                  }
                  className="px-4 cursor-pointer py-2 rounded text-lg font-medium w-60 bg-gray-800 text-white flex items-center justify-between relative "
                >
                  📂 {f.name}
                  {openedFolder.key === i && openedFolder.open ? (
                    <ChevronDown />
                  ) : (
                    <ChevronRight />
                  )}
                </div>

                {/* Folder contents */}
                {openedFolder.key === i && openedFolder.open && (
                  <ul className="ml-8 mt-2 space-y-1 max-h-80 overflow-y-scroll noScroll">
                    {f.files && f.files.length > 0 ? (
                      f.files.map((file, idx) => (
                        <li
                          key={idx}
                          className="flex items-center space-x-2 text-sm text-gray-700 cursor-pointer font-medium mb-2 gap-1 p-1 rounded hover:bg-gray-700 hover:text-white transition-all border border-gray-300 max-w-50 overflow-hidden text-ellipsis whitespace-nowrap"
                          onClick={() => handleFileClick(file)}
                        >
                          📄 <span>{file.filename}</span>
                          <span className="text-xs text-gray-500">
                            ({Math.round(file.size / 1024)} KB)
                          </span>
                        </li>
                      ))
                    ) : (
                      <li className="text-sm text-gray-500">No files in this folder</li>
                    )}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>No Files for this project</p>
        )}
      </div>

      {/* Opened files (Tabs like VS Code) */}
      {/* Opened files (Tabs like VS Code) */}
{openedFiles.length > 0 && (
  <div className="mt-5 border-b flex bg-gray-800 text-white">
    {openedFiles.map((file) => (
      <div
        key={file.path}
        className={`px-4 py-2 flex items-center gap-2 cursor-pointer ${
          activeFile?.path === file.path ? "bg-gray-900" : "bg-gray-700"
        }`}
        onClick={() => handleTabClick(file)}  // <-- fetch fresh content on switch
      >
        <span>{file.filename}</span>
        <button
        className='cursor-pointer'
          onClick={(e) => {
            e.stopPropagation();
            closeFile(file);
          }}
        >
          ❌
        </button>
      </div>
    ))}
  </div>
)}


      {/* Active file editor */}
      <div className="">
        {activeFile ? (
          <CodeViewer file={activeFile} />
        ) : (
          <p className="text-gray-500">No file open</p>
        )}
      </div>
    </div>
  );
};

export default CodeEditor;
