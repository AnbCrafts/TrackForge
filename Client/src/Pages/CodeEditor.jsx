import React, { useContext, useEffect, useState } from 'react';
import { TrackForgeContextAPI } from '../ContextAPI/TrackForgeContextAPI';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { 
  ChevronDown, 
  ChevronRight, 
  Sparkles, 
  Bug, 
  X, 
  Play, 
  CheckCircle, 
  Plus,
  Code,
  Save
} from "lucide-react";
import { toast } from 'react-toastify';
import CodeViewer from '../Components/CodeViewer';
import { TreeNode, buildFileTree } from '../Components/TreeNode';

const CodeEditor = () => {
  const { 
    fetchProjectFiles, 
    thisProjectFiles, 
    serverURL, 
    projectById, 
    project,
    createTicket,
    allUserProfiles,
    searchUserProfiles,
    userProjects,
    getUserProjects
  } = useContext(TrackForgeContextAPI);
  const { username, hash, projectId } = useParams();
  const basePath = `/auth/${hash}/${username}/workspace`;
  const myUserId = localStorage.getItem("userId");
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      getUserProjects(userId);
    }
  }, []);

  useEffect(() => {
    fetchProjectFiles(projectId);
    if (projectId) {
      projectById(projectId);
    }
  }, [projectId]);

  const [openedFiles, setOpenedFiles] = useState([]);
  const [activeFile, setActiveFile] = useState(null);

  // Editable Code & Save States
  const [isSaving, setIsSaving] = useState(false);
  const handleEditorChange = (newContent) => {
    setActiveFile(prev => prev ? { ...prev, content: newContent } : null);
    setOpenedFiles(prev => prev.map(f => f.path === activeFile?.path ? { ...f, content: newContent } : f));
  };

  const handleSaveFile = async () => {
    if (!activeFile) return;
    setIsSaving(true);
    try {
      const response = await fetch(`${serverURL}/project/files/content`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: activeFile.projectId || projectId,
          fileUrl: activeFile.path,
          content: activeFile.content
        })
      });
      const data = await response.json();
      if (data.success) {
        toast.success("💾 File saved successfully!");
      } else {
        toast.error(data.message || "Failed to save file.");
      }
    } catch (error) {
      console.error("Save file error:", error);
      toast.error("Failed to save file.");
    } finally {
      setIsSaving(false);
    }
  };

  // AI Bug Finder & Auto Reporter States
  const [isBugPanelOpen, setIsBugPanelOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [detectedBugs, setDetectedBugs] = useState([]);
  const [activeReportBug, setActiveReportBug] = useState(null);
  const [reportForm, setReportForm] = useState({
    title: "",
    description: "",
    assignedTo: "",
    priority: "Medium",
    projectId: "",
  });

  // Load users when sidebar opens
  useEffect(() => {
    if (isBugPanelOpen) {
      searchUserProfiles("");
    }
  }, [isBugPanelOpen]);

  // Reset scanner bugs on file change
  useEffect(() => {
    setDetectedBugs([]);
  }, [activeFile]);

  const handleScanCode = async () => {
    if (!activeFile?.content) {
      return toast.warn("Open a file with content to analyze.");
    }
    setIsScanning(true);
    setDetectedBugs([]);
    try {
      const response = await fetch(`${serverURL}/ai/code/find-bugs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileContent: activeFile.content,
          filename: activeFile.filename,
          projectId: projectId,
        }),
      });
      const data = await response.json();
      if (data.success) {
        setDetectedBugs(data.bugs || []);
        toast.success("✨ Code analysis completed!");
      } else {
        toast.error(data.message || "Failed to analyze code.");
      }
    } catch (error) {
      console.error("Code scan error:", error);
      toast.error("Failed to analyze code.");
    } finally {
      setIsScanning(false);
    }
  };

  const handleOpenReportBug = (bug) => {
    const activeFilename = activeFile?.filename?.split('/')?.pop() || 'unknown_file';
    setReportForm({
      title: `[Bug in ${activeFilename}] ${bug.title}`,
      description: `File: ${activeFile?.filename || 'unknown'}\nLine: ${bug.lineRange || 'unknown'}\nSeverity: ${bug.severity}\n\nDescription:\n${bug.description}\n\nSuggested Fix:\n${bug.fixRecommendation || 'None'}`,
      assignedTo: "",
      priority: ["low", "medium", "high", "critical"].includes(bug.severity.toLowerCase())
        ? bug.severity.charAt(0).toUpperCase() + bug.severity.slice(1).toLowerCase()
        : "Medium",
      projectId: activeFile?.projectId || projectId,
    });
    setActiveReportBug(bug);
  };

  const handleReportBugSubmit = async (e) => {
    e.preventDefault();
    if (!reportForm.title.trim() || !reportForm.projectId) {
      toast.warn("Title and Project are required.");
      return;
    }
    try {
      const payload = {
        title: reportForm.title.trim(),
        description: reportForm.description.trim(),
        projectId: reportForm.projectId,
        assignedTo: reportForm.assignedTo || null,
        priority: reportForm.priority,
        createdBy: myUserId,
        stepsToReproduce: [],
        status: "Open"
      };
      await createTicket(payload);
      toast.success("Bug ticket reported successfully!");
      setActiveReportBug(null);
    } catch (err) {
      console.error("Error reporting bug ticket:", err);
      toast.error("Failed to report ticket.");
    }
  };

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
  const projectName = projectId && projectId !== "undefined" && project?.project?.name 
    ? project.project.name 
    : "All Projects";

  // Build trees for all user projects
  const projectTrees = userProjects?.projects?.map((p) => {
    const projName = p.project?.name || "Unnamed Project";
    const folders = p.project?.folders || [];
    
    // Inject projectId into files so the Code Editor always knows which project a file belongs to
    const foldersWithProjectId = folders.map(f => ({
      ...f,
      files: f.files?.map(file => ({
        ...file,
        projectId: p.project?._id
      }))
    }));

    const filteredFolders = foldersWithProjectId.filter(f => !blockedFolders.includes(f.name?.toLowerCase()));
    
    // If folders is empty, initialize it with a default folder so it shows in explorer
    const foldersToBuild = filteredFolders.length > 0 
      ? filteredFolders 
      : [{ name: projName, files: [] }];

    return {
      tree: buildFileTree(foldersToBuild, projName),
      isActive: p.project?._id === projectId
    };
  }) || [];

  return (
    <div className='min-h-[90vh] w-full flex flex-col p-4 bg-primary text-primary'>
      <div className="flex items-center justify-between mb-4 bg-card border border-default p-4 rounded-xl shadow">
        <h1 className="text-xl font-bold flex items-center gap-3">
          💻 Code Editor — <span className="text-neon">{projectName}</span>
        </h1>
        <div className="flex items-center gap-2">
          {activeFile && (
            <>
              <button
                onClick={handleSaveFile}
                disabled={isSaving}
                className="text-xs font-bold px-4 py-2 rounded-xl shadow bg-green-600 border border-green-500 text-white hover:bg-green-700 transition cursor-pointer flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="h-4 w-4" />
                <span>{isSaving ? "Saving..." : "Save Changes"}</span>
              </button>
              <button
                onClick={() => setIsBugPanelOpen(!isBugPanelOpen)}
                className={`text-xs font-bold px-4 py-2 rounded-xl shadow transition cursor-pointer flex items-center gap-1.5 border ${
                  isBugPanelOpen
                    ? "bg-purple-600 border-purple-500 text-white"
                    : "bg-secondary border-default text-primary hover:bg-hover"
                }`}
              >
                <Sparkles className="h-4 w-4" />
                <span>{isBugPanelOpen ? "Close AI Finder" : "AI Bug Finder"}</span>
              </button>
            </>
          )}
          {projectId && projectId !== "undefined" && (
            <Link
              to={`${basePath}/projects/${projectId}`}
              className="text-xs font-semibold btn-gradient text-white px-4 py-2 rounded-xl shadow hover:opacity-90 transition cursor-pointer"
            >
              Go back to project
            </Link>
          )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-[75vh] items-stretch">
        {/* LEFT COLUMN: Sidebar Explorer */}
        <div className="w-full lg:w-80 shrink-0 bg-card border border-default rounded-2xl p-4 flex flex-col shadow-lg">
          <h2 className="text-xs font-bold text-secondary uppercase tracking-wider mb-3 pb-2 border-b border-default/50">
            Workspace Explorer
          </h2>
          <div className="flex-1 overflow-y-auto noScroll max-h-[70vh]">
            {projectTrees.length ? (
              projectTrees.map((item, idx) => (
                <TreeNode 
                  key={idx} 
                  node={item.tree} 
                  depth={0} 
                  onFileClick={handleFileClick} 
                  defaultOpen={projectId ? item.isActive : false} 
                />
              ))
            ) : (
              <p className="text-xs text-muted">No projects found</p>
            )}
          </div>
        </div>

        {/* MIDDLE COLUMN: Tab Bar & Code Editor */}
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
              <CodeViewer file={activeFile} onChange={handleEditorChange} />
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

        {/* RIGHT COLUMN: AI Bug Finder Panel */}
        {isBugPanelOpen && (
          <div className="w-full lg:w-96 shrink-0 bg-card border border-default rounded-2xl p-5 flex flex-col shadow-lg overflow-y-auto noScroll max-h-[80vh] gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-default">
              <h3 className="text-sm font-bold text-primary flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-purple-400 animate-pulse" />
                AI Code Analyzer
              </h3>
              <button
                onClick={() => setIsBugPanelOpen(false)}
                className="p-1 rounded-lg hover:bg-secondary text-muted hover:text-primary transition cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {activeFile ? (
              <div className="flex-1 flex flex-col gap-4">
                <div className="text-xs">
                  <span className="text-muted">Target File: </span>
                  <span className="font-bold text-neon">{activeFile.filename.split('/').pop()}</span>
                </div>

                <button
                  onClick={handleScanCode}
                  disabled={isScanning}
                  className="w-full py-2 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:opacity-95 text-white rounded-lg text-xs font-bold shadow-md transition flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isScanning ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      <span>Scanning file...</span>
                    </>
                  ) : (
                    <>
                      <Bug className="h-4 w-4 animate-bounce" />
                      <span>Scan Code for Bugs</span>
                    </>
                  )}
                </button>

                {isScanning && (
                  <div className="flex-1 flex flex-col items-center justify-center py-12 text-center">
                    <p className="text-xs text-muted animate-pulse">Gemini is analyzing structure, variables, checks, and syntax...</p>
                  </div>
                )}

                {!isScanning && detectedBugs.length > 0 && (
                  <div className="flex-1 flex flex-col gap-3">
                    <div className="flex items-center justify-between text-[10px] font-bold text-muted uppercase tracking-wider">
                      <span>Issues Found</span>
                      <span className="px-2 py-0.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-full">
                        {detectedBugs.length}
                      </span>
                    </div>

                    <div className="space-y-3 overflow-y-auto max-h-[50vh] pr-1 noScroll">
                      {detectedBugs.map((bug, index) => {
                        const sevColors = {
                          low: "bg-blue-500/10 border-blue-500/20 text-blue-400",
                          medium: "bg-yellow-500/10 border-yellow-500/20 text-yellow-400",
                          high: "bg-orange-500/10 border-orange-500/20 text-orange-400",
                          critical: "bg-red-500/10 border-red-500/20 text-red-400",
                        };
                        const sevClass = sevColors[bug.severity.toLowerCase()] || sevColors.low;

                        return (
                          <div key={index} className="bg-secondary/15 border border-default rounded-xl p-4 space-y-3 hover:border-purple-500/15 transition shadow-sm">
                            <div className="flex items-start justify-between gap-2.5">
                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border uppercase shrink-0 ${sevClass}`}>
                                {bug.severity}
                              </span>
                              {bug.lineRange && (
                                <span className="text-[9px] text-muted font-mono bg-secondary/40 px-1.5 py-0.5 border border-default rounded">
                                  Lines: {bug.lineRange}
                                </span>
                              )}
                            </div>

                            <div className="space-y-1">
                              <h4 className="text-xs font-bold text-primary leading-tight">{bug.title}</h4>
                              <p className="text-[11px] text-muted leading-relaxed">{bug.description}</p>
                            </div>

                            {bug.fixRecommendation && (
                              <div className="bg-gray-950/40 p-2.5 rounded-lg border border-default/5 font-mono text-[10px] text-purple-400/90 whitespace-pre-wrap select-all">
                                {bug.fixRecommendation}
                              </div>
                            )}

                            <button
                              onClick={() => handleOpenReportBug(bug)}
                              className="w-full py-1.5 bg-purple-600/10 hover:bg-purple-600/20 border border-purple-500/20 text-purple-400 rounded-lg font-bold text-[10px] transition cursor-pointer flex items-center justify-center gap-1"
                            >
                              <Plus className="h-3 w-3" />
                              <span>Report as Ticket</span>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {!isScanning && detectedBugs.length === 0 && (
                  <div className="flex-1 flex flex-col items-center justify-center py-16 text-center space-y-3">
                    <div className="p-3 bg-green-500/5 rounded-full text-green-400 border border-green-500/10">
                      <CheckCircle size={28} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-primary">No Bugs Detected</h4>
                      <p className="text-[10px] text-muted max-w-xs mt-1">This file looks clean! No syntax errors or logical bottlenecks found by Gemini.</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center py-20 text-center space-y-3">
                <Bug size={32} className="text-muted/30" />
                <p className="text-xs text-muted max-w-xs">Select any file from the explorer workspace and scan it using Gemini AI.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ================= TICKET AUTO-REPORTER MODAL ================= */}
      {activeReportBug && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-3xl bg-card border border-default rounded-2xl shadow-2xl p-6 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-default">
              <h3 className="text-base font-bold text-primary flex items-center gap-2">
                <Bug className="h-5 w-5 text-purple-400 animate-pulse" />
                Report Code Bug as Ticket
              </h3>
              <button
                onClick={() => setActiveReportBug(null)}
                className="p-1.5 rounded-lg hover:bg-secondary text-muted hover:text-primary transition cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleReportBugSubmit} className="space-y-5">
              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-secondary mb-1.5">Ticket Title</label>
                <input
                  required
                  type="text"
                  value={reportForm.title}
                  onChange={(e) => setReportForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full outline-none border rounded-xl border-default px-4 py-2.5 bg-secondary text-primary text-xs focus:ring-2 focus:ring-purple-500/50 transition"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-secondary mb-1.5">Description &amp; Fix recommendation</label>
                <textarea
                  required
                  rows={10}
                  value={reportForm.description}
                  onChange={(e) => setReportForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full outline-none border rounded-xl border-default px-4 py-3 bg-secondary text-primary text-xs resize-y font-mono leading-relaxed focus:ring-2 focus:ring-purple-500/50 transition"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Assignee selector */}
                <div>
                  <label className="block text-xs font-semibold text-secondary mb-1.5">Assign User (Optional)</label>
                  <select
                    value={reportForm.assignedTo}
                    onChange={(e) => setReportForm(prev => ({ ...prev, assignedTo: e.target.value }))}
                    className="w-full outline-none border rounded-xl border-default px-4 py-2.5 bg-secondary text-primary text-xs cursor-pointer focus:ring-2 focus:ring-purple-500/50 transition"
                  >
                    <option value="">-- Unassigned --</option>
                    {allUserProfiles?.map(u => (
                      <option key={u._id} value={u._id}>{u.firstName} {u.lastName} (@{u.username})</option>
                    ))}
                  </select>
                </div>

                {/* Priority */}
                <div>
                  <label className="block text-xs font-semibold text-secondary mb-1.5">Priority</label>
                  <select
                    value={reportForm.priority}
                    onChange={(e) => setReportForm(prev => ({ ...prev, priority: e.target.value }))}
                    className="w-full outline-none border rounded-xl border-default px-4 py-2.5 bg-secondary text-primary text-xs cursor-pointer focus:ring-2 focus:ring-purple-500/50 transition"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-default">
                <button
                  type="button"
                  onClick={() => setActiveReportBug(null)}
                  className="px-5 py-2.5 border border-default bg-secondary hover:bg-hover rounded-xl text-primary text-xs font-semibold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 btn-gradient text-white rounded-xl text-xs font-bold shadow-md hover:opacity-95 transition cursor-pointer"
                >
                  File Bug Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};



export default CodeEditor;
