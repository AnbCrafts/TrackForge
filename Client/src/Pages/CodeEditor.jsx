import React, { useContext, useEffect, useState } from 'react'
import { TrackForgeContextAPI } from '../ContextAPI/TrackForgeContextAPI'
import {  useParams } from 'react-router-dom';
import { ChevronDown, ChevronRight, File, Folder, X } from "lucide-react";
import { toast } from 'react-toastify';
import CodeViewer from '../Components/CodeViewer';

const CodeEditor = () => {
    const {getUserProjects,userProjects,getProjectFiles,projectFiles,uploadFiles} = useContext(TrackForgeContextAPI);
    const id = localStorage.getItem("userId");
    const {username,hash} = useParams();

    useEffect(()=>{
        getUserProjects(id);
    }, [id])

    const [expand,setExpand] = useState({
      index:"",
      value:false
    });

    const pId = localStorage.getItem("thisProject");
    useEffect(()=>{
      if(pId) getProjectFiles(pId);
    },[pId])

    const [openFiles,setOpenFiles] = useState([]);
    const [activeFile,setActiveFile] = useState(null);
    const [fileContents,setFileContents] = useState({});

    const fetchFileData = async () => {
      const newContent = {};

      if (projectFiles && projectFiles.length) {
        await Promise.all(
          projectFiles.map(async (f) => {
            try {
              const res = await fetch(f.path);   // fetch file from URL
              const text = await res.text();     // get raw content
              newContent[f._id] = text;
            } catch (err) {
              newContent[f._id] = "// ❌ Error loading file";
            }
          })
        );
      }

      setFileContents(newContent); // update state
    };

    useEffect(()=>{
      if(openFiles.length) fetchFileData();
    },[openFiles, projectFiles]);

    useEffect(()=>{
      // If activeFile is removed, set activeFile to last open file
      if(openFiles.length && (!activeFile || !openFiles.includes(activeFile))){
        setActiveFile(openFiles[openFiles.length - 1]);
      } else if(openFiles.length === 0){
        setActiveFile(null);
      }
    }, [openFiles]);

    const [createFile,setCreateFile] = useState(false);
    const [createFolder,setCreateFolder] = useState(false);
    const [newFileName,setNewFileName] = useState("");
    const [newFolderName,setNewFolderName] = useState("");


    const fileCreationSubmitHandler = async (e) => {
          e.preventDefault();
      const id = localStorage.getItem("userId");
  const pId = localStorage.getItem("thisProject");
  if (!newFileName) {
    toast.error("File name cannot be empty");
    return;
  }

  // Create new file object
  const newFile = {
    _id: `temp-${Date.now()}`, 
    filename: newFileName,
    fileType: "text/plain",   
    path: "",                  
    folder:  "", 
    uploadedAt: new Date().toISOString(),
    uploadedBy: id,
  };

  uploadFiles(pId,newFile);

  // setActiveFile(newFile.filename);

  // setFileContents((prev) => ({
  //   ...prev,
  //   [newFile._id]: "",
  // }));

  toast.success(`File "${newFileName}" created successfully!`);

  // Reset input field if you have one
  setNewFileName("");
  setCreateFile(false);
};



  return (
    <div className='h-[100vh] w-full flex items-start justify-start '>
       <div className="bg-gray-50 max-w-60 text-start h-[100vh] overflow-y-scroll noScroll flex flex-col items-start justify-start shadow-2xl">
  <h1 className="text-lg w-full font-medium text-center p-3 bg-gray-800 text-white overflow-hidden text-ellipsis whitespace-nowrap">
    {`${username}'s Projects`}
  </h1>

  {userProjects && userProjects.projects && userProjects.projects.length ? (
    userProjects.projects
      .slice() // to avoid mutating original array
      .sort(
        (a, b) => new Date(b.project.createdAt) - new Date(a.project.createdAt)
      ) // newest first
      .map((p, i) => {
        const isOpen = expand.index === i && expand.value;
        return (
          <React.Fragment key={p?.project?._id}>
          <div
            onClick={() =>
            {
              setExpand({
                index: i,
                value: !isOpen,
              }),
              localStorage.setItem("thisProject",p?.project?._id);
            }
            }
            className={`flex items-center justify-between p-4 transition-all border-b border-gray-200 hover:bg-gray-900 ${isOpen?"bg-gray-900 text-white":""} w-full hover:text-white cursor-pointer overflow-hidden`}
          >
            
            <span  className="font-medium block max-w-40 overflow-hidden text-ellipsis whitespace-nowrap">
              {p?.project?.name}
            </span>
            {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </div>

          {
            isOpen && <div className='mb-4 flex flex-col items-start justify-between w-full bg-gray-200 '>
              <div className='flex items-center justify-start gap-3 w-full px-4 py-1 bg-gray-700 text-white relative'>
               {createFile && (
  <div className="absolute top-8 left-0 flex items-center justify-between gap-3">
    <input
      type="text"
      value={newFileName}
      onChange={(e) => setNewFileName(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          if (!newFileName.trim()) return;
          fileCreationSubmitHandler();
        }
      }}
      className="py-1 flex-1 px-2 outline-none border border-gray-200 bg-gray-100 text-gray-900 block w-full"
      placeholder="Enter file name and press enter"
    />

    <button
      type="button"
      onClick={fileCreationSubmitHandler}
      className="text-sm p-0.5 text-white bg-gray-800"
    >
      Create
    </button>
  </div>
)}

                { createFolder  && <div className='absolute w-full top-8 left-0'>
                  <input value={newFolderName} onChange={(e)=>setNewFolderName(e.target.value)} type="text" className='py-1 px-2 outline-none border border-gray-200 bg-gray-100 text-gray-900 block w-full' placeholder='enter folder name' />
                    

                </div>}
               <span>Add new</span>
                <File onClick={()=>setCreateFile(!createFile)} className='hover:bg-white hover:text-gray-900 transition-all rounded p-0.5 cursor-pointer' size={22}/>
                <Folder onClick={()=>setCreateFolder(!createFolder)} className='hover:bg-white hover:text-gray-900 transition-all rounded p-0.5 cursor-pointer' size={22}/>
              </div>

              {
                projectFiles && projectFiles.length
                ?
                projectFiles.map((f,i)=>(
                 
                  <span
                    onClick={() => {
                      setOpenFiles((prev) =>
                        prev.includes(f.filename) ? prev : [...prev, f.filename]
                      )
                      setActiveFile(f.filename)
                    }}
                    className={`px-4 py-1 block w-full border-b border-gray-300 cursor-pointer hover:bg-gray-900 hover:text-white transition-all ${activeFile ===f.filename && "bg-gray-800 text-white"}`}
                    key={i}
                  >
                    {f.filename}
                  </span>


                ))
                :(
                  <p>No files found for this project</p>
                )
              }
            </div>
          }
          </React.Fragment>
        );
      })
  ) : (
    <span>No Projects Found</span>
  )}
</div>

       <div className='max-w-full flex-1 min-h-[100vh] overflow-y-scroll noScroll flex flex-col items-start justify-between'>
  {/* Tabs */}
  {openFiles && openFiles.length > 0 && (
    <div className='bg-gray-800 flex items-center justify-start overflow-x-scroll noScroll w-full'>
      {openFiles.map((filename, i) => (
        <span
          className={`px-4 text-gray-400 w-40 flex items-center justify-between border-r border-gray-300 cursor-pointer transition-all ${
            filename === activeFile ? "bg-gray-900 text-white font-bold" : ""
          }`}
          key={i}
          onClick={() => setActiveFile(filename)}
        >
          {filename}
          <X
            className='p-0.5 bg-white text-gray-800 rounded'
            size={18}
            onClick={(e) => {
              e.stopPropagation();
              setOpenFiles((prev) => prev.filter((f) => f !== filename));
            }}
          />
        </span>
      ))}
    </div>
  )}

  {/* Editor */}
  <div className='flex-1 w-full'>
    {activeFile && (() => {
      const fileObj = projectFiles.find((f) => f.filename === activeFile);
      if (fileObj && fileContents[fileObj._id]) {
        return (
          <CodeViewer
            key={fileObj._id}
            file={{
              ...fileObj,
              content: fileContents[fileObj._id],
            }}
          />
        );
      }
      return <div className="p-4 text-gray-500">Loading {activeFile}...</div>;
    })()}
  </div>
</div>
    </div>
  )
}

export default CodeEditor
