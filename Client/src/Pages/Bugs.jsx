import React, { useState, useEffect, useContext } from "react";
import { TrackForgeContextAPI } from "../ContextAPI/TrackForgeContextAPI";
import axios from "axios";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import {
  AlertTriangle,
  Calendar,
  CheckCircle,
  Clock,
  FileText,
  MessageSquare,
  Send,
  Tag,
  User,
  AlignLeft,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  FolderKanban,
  Sparkles,
  Bot,
  Flag,
  AlertCircle,
  Copy,
} from "lucide-react";
import { toast } from "react-toastify";
import { PaginationControls } from "../Components/PaginationControls";
import CreateActivityModal from "../Components/CreateActivityModal";

// Helper components for parsing/rendering AI Markdown suggestions
const parseInlineStyles = (text) => {
  if (!text) return "";
  const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);
  return parts.map((part, idx) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={idx} className="font-bold text-primary">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return <code key={idx} className="px-1.5 py-0.5 bg-secondary border border-default rounded text-[10.5px] font-mono text-neon">{part.slice(1, -1)}</code>;
    }
    return part;
  });
};

const AIAnalysisRenderer = ({ text }) => {
  if (!text) return null;

  // Split by code blocks
  const parts = text.split(/(```[\s\S]*?```)/g);

  return (
    <div className="space-y-4 text-xs text-secondary leading-relaxed">
      {parts.map((part, index) => {
        if (part.startsWith("```")) {
          const match = part.match(/```(\w*)\n([\s\S]*?)```/);
          const lang = match ? match[1] : "javascript";
          const code = match ? match[2] : part.slice(3, -3);

          return (
            <div key={index} className="relative group my-4 rounded-xl overflow-hidden border border-default shadow-sm bg-[#0f0f13]">
              <div className="flex items-center justify-between px-4 py-2 bg-[#1a1a24] border-b border-default">
                <span className="text-[10px] font-bold text-secondary uppercase tracking-wider">{lang}</span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(code.trim());
                    toast.success("Code copied!");
                  }}
                  className="text-xs text-secondary hover:text-primary transition flex items-center gap-1 cursor-pointer bg-transparent border-none outline-none"
                >
                  <Copy size={12} /> Copy Code
                </button>
              </div>
              <div className="p-4 text-xs font-mono overflow-x-auto">
                <SyntaxHighlighter
                  language={lang}
                  style={vscDarkPlus}
                  customStyle={{
                    margin: 0,
                    background: "transparent",
                    padding: 0,
                  }}
                >
                  {code.trim()}
                </SyntaxHighlighter>
              </div>
            </div>
          );
        } else {
          return (
            <div key={index} className="space-y-2">
              {part.split("\n").map((line, lIdx) => {
                const trimmed = line.trim();
                if (!trimmed) return <div key={lIdx} className="h-2" />;

                if (trimmed.startsWith("### ")) {
                  return (
                    <h4 key={lIdx} className="text-sm font-bold text-primary mt-4 mb-2 flex items-center gap-2">
                      {trimmed.slice(4)}
                    </h4>
                  );
                }
                if (trimmed.startsWith("## ")) {
                  return (
                    <h3 key={lIdx} className="text-sm font-bold text-neon mt-6 mb-3 flex items-center gap-2 border-b border-default pb-1">
                      {trimmed.slice(3)}
                    </h3>
                  );
                }
                if (trimmed.startsWith("# ")) {
                  return (
                    <h2 key={lIdx} className="text-base font-bold text-neon mt-6 mb-4 flex items-center gap-2">
                      {trimmed.slice(2)}
                    </h2>
                  );
                }

                if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
                  return (
                    <div key={lIdx} className="flex items-start gap-2 pl-4 text-xs text-secondary">
                      <span className="text-neon mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-neon shadow-[0_0_6px_var(--border-neon)]" />
                      <span>{parseInlineStyles(trimmed.slice(2))}</span>
                    </div>
                  );
                }

                const numMatch = trimmed.match(/^(\d+)\.\s(.*)/);
                if (numMatch) {
                  return (
                    <div key={lIdx} className="flex items-start gap-2 pl-4 text-xs text-secondary">
                      <span className="text-neon font-bold mt-0.5 shrink-0 text-[11px]">{numMatch[1]}.</span>
                      <span>{parseInlineStyles(numMatch[2])}</span>
                    </div>
                  );
                }

                return <p key={lIdx} className="text-xs text-secondary leading-relaxed">{parseInlineStyles(line)}</p>;
              })}
            </div>
          );
        }
      })}
    </div>
  );
};

export default function Bugs() {
  const {
    getUserProjects,
    userProjects,
    getThisProjectTickets,
    thisProjectTickets,
    getTicketComments,
    ticketComments,
    postComment,
    getThisTicketActivities,
    thisTicketActivities,
    serverURL,
  } = useContext(TrackForgeContextAPI);

  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [currPage, setCurrPage] = useState(1);
  const [commentForm, setCommentForm] = useState({ message: "", type: "Text" });
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);

  const [leftOpen, setLeftOpen] = useState(false);
  const [rightOpen, setRightOpen] = useState(false);

  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [loadingAi, setLoadingAi] = useState(false);

  const [recommendations, setRecommendations] = useState([]);
  const [loadingSuggestion, setLoadingSuggestion] = useState(false);

  const userId = localStorage.getItem("userId");

  // Load user's projects on mount
  useEffect(() => {
    if (userId) {
      getUserProjects(userId);
    }
  }, [userId]);

  // Load tickets when project or page changes
  useEffect(() => {
    if (selectedProject?._id) {
      getThisProjectTickets(selectedProject?._id, currPage, 10);
    }
  }, [selectedProject, currPage]);

  // Auto-select first ticket or update selected ticket details
  useEffect(() => {
    if (!selectedProject) {
      setSelectedTicket(null);
      return;
    }

    const ticketsList = thisProjectTickets?.tickets || [];

    if (ticketsList.length > 0) {
      const currentSelectedId = selectedTicket?._id;
      const found = ticketsList.find((t) => t._id === currentSelectedId);
      if (found) {
        setSelectedTicket(found);
      } else {
        const first = ticketsList[0];
        setSelectedTicket(first);
        if (first?._id) {
          getTicketComments(first._id, 1);
          getThisTicketActivities(first._id);
        }
      }
    } else {
      setSelectedTicket(null);
    }
  }, [thisProjectTickets, selectedProject]);

  // Reset suggestions when switching tickets
  useEffect(() => {
    setAiAnalysis(null);
    setRecommendations([]);
  }, [selectedTicket?._id]);

  const handleAnalyzeBug = async () => {
    if (!selectedTicket?._id || !serverURL) {
      return toast.error("Unable to resolve ticket parameters.");
    }
    setLoadingAi(true);
    try {
      const response = await axios.post(`${serverURL}/ai/bug/${selectedTicket._id}/analyze`);
      if (response.data.success) {
        setAiAnalysis(response.data.analysis);
        toast.success("AI Bug analysis completed!");
      } else {
        toast.error(response.data.message || "Failed to analyze bug.");
      }
    } catch (err) {
      console.error("AI Bug analysis error:", err);
      toast.error(err.response?.data?.message || "Failed to analyze bug.");
    } finally {
      setLoadingAi(false);
    }
  };

  const handleSuggestAssignee = async () => {
    if (!selectedTicket?._id || !serverURL) {
      return toast.error("Unable to resolve ticket parameters.");
    }
    setLoadingSuggestion(true);
    setRecommendations([]);
    try {
      const response = await axios.post(`${serverURL}/ai/ticket/suggest-assignee`, { ticketId: selectedTicket._id });
      if (response.data.success && response.data.recommendations) {
        setRecommendations(response.data.recommendations);
        if (response.data.recommendations.length > 0) {
          toast.success("AI Assignee suggestions retrieved!");
        } else {
          toast.warn("No suitable candidates found for this bug.");
        }
      } else {
        toast.warn(response.data.message || "Failed to retrieve AI suggestion.");
      }
    } catch (err) {
      console.error("AI Suggest Assignee error:", err);
      toast.error(err.response?.data?.message || "Failed to retrieve AI suggestion.");
    } finally {
      setLoadingSuggestion(false);
    }
  };

  const handleAssignUser = async (targetUserId) => {
    if (!selectedTicket?._id || !serverURL) return;
    try {
      const response = await axios.put(`${serverURL}/ticket/${selectedTicket._id}/user/${targetUserId}`);
      if (response.data.success) {
        toast.success("Ticket successfully assigned!");
        setRecommendations([]);
        getThisProjectTickets(selectedProject?._id, currPage, 10);
      } else {
        toast.error(response.data.message || "Failed to assign ticket.");
      }
    } catch (err) {
      console.error("Assign ticket error:", err);
      toast.error(err.response?.data?.message || "Failed to assign ticket.");
    }
  };

  const shortId = (id) =>
    id ? id.slice(0, 6) + "..." + id.slice(-4) : "-";

  const copyID = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const daysLeft = (() => {
    if (!selectedTicket?.validFor) return null;
    const today = new Date();
    const expiry = new Date(selectedTicket.validFor);
    today.setHours(0, 0, 0, 0);
    expiry.setHours(0, 0, 0, 0);
    return Math.round((expiry - today) / (1000 * 60 * 60 * 24));
  })();

  const handleSelectTicket = (t) => {
    if (!t?._id) return;
    setSelectedTicket(t);
    getTicketComments(t._id, 1);
    getThisTicketActivities(t._id);
    setLeftOpen(false);
  };

  const submitComment = async (e) => {
    e.preventDefault();
    if (!selectedTicket?._id) return toast.error("No ticket selected");
    if (!commentForm.message.trim()) return toast.warn("Comment cannot be empty");

    await postComment({
      ...commentForm,
      userId,
      ticket: selectedTicket._id,
      projectId: selectedProject?._id,
    });
    setCommentForm((prev) => ({ ...prev, message: "" }));
    getTicketComments(selectedTicket._id, 1);
  };

  const handleSelectProject = (proj) => {
    const flat = proj?.project ? proj.project : proj;
    setSelectedProject(flat);
    setCurrPage(1);
    setSelectedTicket(null);
  };

  // Render Project Selection Grid (Landing View)
  if (!selectedProject) {
    return (
      <div className="bg-primary min-h-screen p-6 md:p-10 space-y-8 text-primary shadow-inner">
        <div className="max-w-6xl mx-auto space-y-2">
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
            Bugs & Tickets
          </h1>
          <p className="text-secondary text-sm">
            Select a project below to view and manage its bug reports and issue tickets.
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
          {userProjects?.projects && userProjects.projects.length > 0 ? (
            userProjects.projects.map((proj) => {
              const p = proj?.project || proj;
              return (
                <div
                  key={p._id}
                  onClick={() => handleSelectProject(proj)}
                  className="bg-card border border-default rounded-2xl p-6 cursor-pointer shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all hover:border-[var(--border-neon)]/60 flex flex-col justify-between min-h-[12rem] group"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <FolderKanban className="h-5 w-5 text-neon group-hover:scale-110 transition-transform shrink-0" />
                      <h3 className="font-bold text-base text-primary truncate">
                        {p.name || "Unnamed Project"}
                      </h3>
                    </div>
                    <p className="text-secondary text-xs line-clamp-3 mb-3">
                      {p.description || "No description provided."}
                    </p>
                    {proj.members && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-secondary/40 border border-default rounded-full text-[10px] text-muted font-semibold">
                        <User className="w-3 h-3" /> {proj.members.length} member{proj.members.length !== 1 ? "s" : ""}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-default/20 text-[10px] text-muted font-mono mt-3">
                    <span>ID: {shortId(p._id)}</span>
                    {p.deadline ? (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-neon" />
                        {new Date(p.deadline).toLocaleDateString()}
                      </span>
                    ) : (
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                        p.archived
                          ? "bg-red-500/10 text-red-400"
                          : "bg-green-500/10 text-green-400"
                      }`}>
                        {p.archived ? "Archived" : "Active"}
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full py-20 text-center bg-card border border-default rounded-2xl shadow-sm">
              <FolderKanban className="h-12 w-12 text-muted mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-bold text-primary">No Projects Found</h3>
              <p className="text-secondary text-sm mt-1">
                You must be added to a project by an administrator to see tickets.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  const ticketsList = thisProjectTickets?.tickets || [];

  return (
    <div className="bg-primary text-primary">
      <div className="w-full min-h-screen bg-primary flex">
        {/* LEFT SIDEBAR (Tickets list) */}
        <div className="w-[320px] bg-card border-r border-default p-6 space-y-6 hidden md:block overflow-y-auto shadow-sm">
          <button
            onClick={() => setSelectedProject(null)}
            className="flex items-center gap-2 text-xs font-semibold text-secondary hover:text-primary transition cursor-pointer mb-2"
          >
            <ArrowLeft className="w-4 h-4 text-neon" />
            Back to Projects
          </button>

          <div className="space-y-1">
            <h1 className="text-xs uppercase tracking-wider font-bold text-muted">Project</h1>
            <h2 className="text-lg font-bold text-primary truncate">{selectedProject?.name || selectedProject?.project?.name}</h2>
            <p className="text-[10px] text-muted flex items-center gap-1.5 font-mono">
              ID: {shortId(selectedProject?._id || selectedProject?.project?._id)}
              <button
                onClick={() => copyID(selectedProject?._id || selectedProject?.project?._id)}
                className="px-1.5 py-0.5 text-[9px] bg-secondary border border-default text-secondary rounded hover:text-primary transition cursor-pointer"
              >
                Copy
              </button>
            </p>
          </div>

          <div className="pt-4 border-t border-default/20 space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-muted uppercase tracking-wider">
              <span>Tickets</span>
              <span className="font-mono lowercase">({thisProjectTickets?.totalTickets || 0})</span>
            </div>

            <div className="space-y-1 max-h-[55vh] overflow-y-auto pr-1 scrollbar-thin">
              {ticketsList.length > 0 ? (
                ticketsList.map((t, index) => {
                  const isSelected = t?._id === selectedTicket?._id;
                  return (
                    <button
                      key={t?._id || index}
                      onClick={() => handleSelectTicket(t)}
                      className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center justify-between transition border cursor-pointer ${
                        isSelected
                          ? "bg-secondary border-[var(--border-neon)]/30 text-primary font-semibold shadow-sm"
                          : "border-transparent hover:bg-hover hover:text-primary text-secondary"
                      }`}
                    >
                      <div className="flex-1 min-w-0 pr-2">
                        <div className="text-xs font-bold truncate">
                          {t?.title || "Untitled Issue"}
                        </div>
                        <div className="text-[10px] text-muted flex items-center gap-1.5 mt-0.5 font-mono">
                          <span>{shortId(t?._id)}</span>
                          <span>•</span>
                          <span className={t?.status === "Open" ? "text-green-500" : "text-amber-500"}>
                            {t?.status}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-muted shrink-0" />
                    </button>
                  );
                })
              ) : (
                <div className="text-xs text-muted py-4 text-center">
                  No tickets in this project.
                </div>
              )}
            </div>

            {/* Pagination */}
            {thisProjectTickets?.totalPages > 1 && (
              <div className="pt-2 border-t border-default/10">
                <PaginationControls
                  currPage={currPage}
                  setCurrPage={setCurrPage}
                  totalPages={thisProjectTickets.totalPages}
                />
              </div>
            )}
          </div>
        </div>

        {/* MAIN TICKET DETAIL PANEL */}
        <div className="flex-1 p-6 md:p-10 space-y-6 overflow-y-auto bg-primary relative">
          {/* MOBILE NAVIGATION BAR */}
          <div className="flex items-center justify-between md:hidden mb-4">
            <button
              onClick={() => setSelectedProject(null)}
              className="flex items-center gap-1.5 text-xs bg-card border border-default px-2.5 py-1 text-primary rounded-lg shadow-sm"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-neon" />
              Projects
            </button>

            <button
              onClick={() => setLeftOpen(true)}
              className="text-xs bg-card border border-default px-2.5 py-1 text-primary rounded-lg shadow-sm"
            >
              Tickets ({ticketsList.length})
            </button>

            {selectedTicket && (
              <button
                onClick={() => setRightOpen(true)}
                className="text-xs bg-card border border-default px-2.5 py-1 text-primary rounded-lg shadow-sm"
              >
                Issue Info
              </button>
            )}
          </div>

          {!selectedTicket ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-20 bg-card border border-default rounded-2xl shadow-sm">
              <ClipboardList className="h-14 w-14 text-muted mb-4 opacity-40 animate-pulse" />
              <h3 className="text-lg font-bold text-primary">No Ticket Selected</h3>
              <p className="text-secondary text-sm mt-1 max-w-sm">
                Choose a ticket from the left sidebar to view issue logs, timeline, and comment threads.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Ticket Title Box */}
              <div className="bg-card p-6 rounded-2xl shadow-sm border border-default space-y-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <h1 className="text-2xl font-extrabold text-primary max-w-3xl leading-snug">
                    {selectedTicket.title}
                  </h1>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase border ${
                        selectedTicket.status === "Open"
                          ? "bg-green-500/10 text-green-500 border-green-500/20"
                          : "bg-purple-500/10 text-[var(--text-neon)] border-purple-500/20"
                      }`}
                    >
                      {selectedTicket.status}
                    </span>

                    <span className="flex items-center gap-1.5 px-3 py-1 bg-secondary rounded-full border text-[11px] text-secondary border-default font-semibold">
                      <Tag size={13} className="text-neon" /> {selectedTicket.priority}
                    </span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="bg-card p-6 rounded-2xl shadow-sm border border-default space-y-3">
                <h2 className="text-md font-bold flex items-center gap-2 text-primary">
                  <FileText className="text-neon h-4 w-4" /> Description
                </h2>
                <p className="text-secondary text-sm leading-relaxed whitespace-pre-wrap">
                  {selectedTicket.description || "No description provided."}
                </p>
              </div>

              {/* Steps to reproduce */}
              <div className="bg-card p-6 rounded-2xl shadow-sm border border-default space-y-3">
                <h2 className="text-md font-bold flex items-center gap-2 text-primary">
                  <AlertTriangle className="text-neon h-4 w-4" /> Steps to Reproduce
                </h2>
                <ul className="space-y-2 text-secondary text-sm">
                  {selectedTicket.stepsToReproduce && selectedTicket.stepsToReproduce.length > 0 ? (
                    selectedTicket.stepsToReproduce.map((step, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-secondary border border-default text-[10px] font-bold text-primary font-mono mt-0.5 shrink-0">
                          {idx + 1}
                        </span>
                        <span className="pt-0.5">{step}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-muted text-xs italic">No specific steps to reproduce recorded.</li>
                  )}
                </ul>
              </div>

              {/* AI Bug Analyst Section */}
              <div className="bg-card p-6 rounded-2xl shadow-xl space-y-4 border border-purple-500/20 backdrop-blur-md shadow-purple-500/5">
                <div className="flex items-center justify-between border-b border-default/20 pb-3">
                  <h2 className="text-md font-bold flex items-center gap-2 bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                    <Sparkles className="text-purple-400 shrink-0" size={16} /> AI Bug Analyst
                  </h2>
                  {aiAnalysis && !loadingAi && (
                    <button
                      type="button"
                      onClick={handleAnalyzeBug}
                      className="px-3 py-1 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Sparkles size={12} className="animate-pulse" /> Re-Analyze Bug
                    </button>
                  )}
                </div>

                {loadingAi ? (
                  <div className="flex flex-col items-center justify-center py-10 space-y-3">
                    <div className="w-8 h-8 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
                    <p className="text-xs text-secondary animate-pulse">Gemini is analyzing issue, root causes &amp; proposing a patch...</p>
                  </div>
                ) : aiAnalysis ? (
                  <div className="bg-purple-950/20 border border-purple-500/25 p-5 rounded-2xl">
                    <AIAnalysisRenderer text={aiAnalysis} />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-6 text-center space-y-4 animate-fade-in">
                    <div className="p-2.5 bg-purple-500/10 rounded-full text-purple-400 border border-purple-500/20">
                      <Sparkles size={24} />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-xs font-bold text-primary">Need help resolving this issue?</h3>
                      <p className="text-[11px] text-secondary max-w-sm">Get instant code recommendations, root cause analysis, and patch steps from Gemini AI.</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAnalyzeBug}
                      className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl font-bold text-xs shadow-lg hover:scale-[1.02] flex items-center gap-2 transition-all cursor-pointer"
                    >
                      <Sparkles size={13} /> Analyze Bug with AI
                    </button>
                  </div>
                )}
              </div>

              {/* Activity Log */}
              <div className="bg-card p-6 rounded-2xl shadow-sm border border-default space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-default/20">
                  <h2 className="text-md font-bold flex items-center gap-2 text-primary">
                    <CheckCircle className="text-neon h-4 w-4" /> Activity Log Timeline
                  </h2>
                  <button
                    onClick={() => setIsActivityModalOpen(true)}
                    className="px-3.5 py-1.5 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white rounded-lg text-xs font-bold cursor-pointer transition shadow-sm"
                  >
                    + Log Activity
                  </button>
                </div>

                <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-default/30">
                  {thisTicketActivities && thisTicketActivities.length > 0 ? (
                    thisTicketActivities.map((act, idx) => (
                      <div key={act._id || idx} className="relative group">
                        <div className="absolute -left-6 top-1.5 w-4 h-4 rounded-full bg-card border-2 border-[var(--border-neon)] shadow-sm z-10 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <div className="w-1.5 h-1.5 rounded-full bg-neon"></div>
                        </div>

                        <div className="bg-secondary/40 p-4 rounded-xl border border-default/45 shadow-sm transition hover:border-[var(--border-neon)]/30 hover:bg-secondary/60">
                          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                            <h4 className="font-bold text-xs text-primary bg-purple-500/10 px-2.5 py-0.5 rounded-md text-[var(--text-neon)]">
                              {act.actionType}
                            </h4>
                            <div className="flex items-center gap-1.5 text-[10px] text-muted font-mono">
                              <Calendar size={12} className="text-neon" />
                              {new Date(act.doneOn).toLocaleDateString()}
                            </div>
                          </div>

                          <p className="text-secondary text-xs leading-relaxed mb-3">
                            {act.details}
                          </p>

                          <div className="flex items-center gap-1 text-[10px] text-muted italic">
                            <User size={12} className="text-neon" />
                            <span>Logged by: @{act.performedBy?.username || "unknown"}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-muted italic py-2 pl-2">
                      No activities recorded for this ticket yet.
                    </div>
                  )}
                </div>
              </div>

              {/* Comments Thread */}
              <div className="bg-card p-6 rounded-2xl shadow-sm border border-default space-y-6">
                <h2 className="text-md font-bold flex items-center gap-2 text-primary pb-3 border-b border-default/20">
                  <MessageSquare className="text-neon h-4 w-4" /> Discussion Thread
                </h2>

                <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1.5 scrollbar-thin">
                  {ticketComments?.comments && ticketComments.comments.length > 0 ? (
                    ticketComments.comments.map((comment) => (
                      <div
                        key={comment._id}
                        className="p-4 bg-secondary/35 border border-default/50 rounded-xl space-y-2 hover:bg-secondary/50 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[var(--text-neon)]">
                            @{comment?.userId?.username || "unknown"}
                          </span>
                          <span className="text-[10px] text-muted font-mono">
                            {new Date(comment.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        <p className="text-primary text-xs leading-relaxed">
                          {comment.message}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-muted italic text-center py-6">
                      No comments have been posted to this thread yet.
                    </div>
                  )}
                </div>

                <form onSubmit={submitComment} className="pt-4 border-t border-default/20 space-y-3">
                  <textarea
                    rows={2}
                    value={commentForm.message}
                    onChange={(e) =>
                      setCommentForm((prev) => ({
                        ...prev,
                        message: e.target.value,
                      }))
                    }
                    placeholder="Write a message in this discussion..."
                    className="w-full p-3 text-xs bg-secondary border border-default rounded-xl outline-none focus:ring-2 focus:ring-[var(--border-neon)]/40 transition text-primary resize-none"
                  />

                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <select
                      value={commentForm.type}
                      onChange={(e) =>
                        setCommentForm((prev) => ({
                          ...prev,
                          type: e.target.value,
                        }))
                      }
                      className="border rounded-lg px-2.5 py-1.5 text-xs bg-secondary text-primary border-default outline-none cursor-pointer focus:ring-2 focus:ring-[var(--border-neon)]/40"
                    >
                      <option>Text</option>
                      <option>Status Change</option>
                      <option>System</option>
                    </select>

                    <button
                      type="submit"
                      className="flex items-center gap-1.5 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white px-4 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition shadow-sm"
                    >
                      <Send size={12} /> Send Message
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT SIDEBAR (Desktop details info panel) */}
        {selectedTicket && (
          <div className="w-[300px] bg-card border-l border-default p-6 space-y-6 hidden lg:block shadow-sm">
            <h3 className="text-xs uppercase tracking-wider font-bold text-muted">Issue Details</h3>

            <div className="space-y-4 pt-4 border-t border-default/10 text-xs">
              <div className="space-y-1">
                <span className="text-muted block">Ticket ID</span>
                <span className="font-mono text-primary flex items-center gap-1 text-[10px]">
                  {selectedTicket._id}
                  <button
                    type="button"
                    onClick={() => copyID(selectedTicket._id)}
                    className="px-1.5 py-0.5 bg-secondary text-secondary hover:text-primary rounded text-[9px] border border-default transition cursor-pointer shrink-0"
                  >
                    Copy
                  </button>
                </span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-default/10">
                <span className="text-muted">Priority</span>
                <span className="font-bold text-primary">{selectedTicket.priority}</span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-default/10">
                <span className="text-muted">Creator</span>
                <span className="font-bold text-primary">@{selectedTicket.giver?.username || "unknown"}</span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-default/10">
                <span className="text-muted">Assigned To</span>
                <span className="font-bold text-primary">
                  {selectedTicket.doer ? `@${selectedTicket.doer.username}` : "Unassigned"}
                </span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-default/10">
                <span className="text-muted">Assigned On</span>
                <span className="font-bold text-primary">
                  {new Date(selectedTicket.assignedOn).toLocaleDateString()}
                </span>
              </div>

              {/* AI Assignee Suggestion Section */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleSuggestAssignee}
                  disabled={loadingSuggestion}
                  className="w-full py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl font-bold text-xs shadow-md hover:scale-[1.02] flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                >
                  <Sparkles size={12} className={loadingSuggestion ? "animate-spin" : "animate-pulse"} />
                  {loadingSuggestion ? "Finding best match..." : "Suggest Assignee (AI)"}
                </button>
              </div>

              {recommendations && recommendations.length > 0 && (
                <div className="space-y-3 mt-3">
                  <div className="flex items-center gap-1.5 text-purple-400 font-bold">
                    <Bot size={14} className="animate-pulse" /> AI Matches (Ranked):
                  </div>
                  
                  {recommendations.map((rec) => (
                    <div key={rec.suggestedUserId} className="p-3 bg-purple-950/20 border border-purple-500/30 rounded-xl text-xs space-y-2">
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="font-bold text-primary">{rec.suggestedName}</span>{" "}
                          <span className="text-secondary text-[10px]">(@{rec.suggestedUsername})</span>
                        </div>
                        <span className="px-2 py-0.5 bg-purple-500/25 border border-purple-500/40 text-[9px] font-bold text-purple-300 rounded-full">
                          Rank #{rec.rank}
                        </span>
                      </div>
                      <p className="text-secondary leading-normal italic">"{rec.reasoning}"</p>
                      <button
                        type="button"
                        onClick={() => handleAssignUser(rec.suggestedUserId)}
                        className="w-full py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg transition cursor-pointer text-[10px] shadow"
                      >
                        Assign to {rec.suggestedUsername}
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="pt-2 border-t border-default/10">
                {daysLeft === 0 && (
                  <div className="p-3 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-xl flex items-center gap-2 text-xs font-bold">
                    <AlertTriangle size={14} /> Expires today!
                  </div>
                )}
                {daysLeft === 1 && (
                  <div className="p-3 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-xl flex items-center gap-2 text-xs font-bold">
                    <Clock size={14} /> Expires tomorrow
                  </div>
                )}
                {daysLeft > 1 && (
                  <div className="p-3 bg-green-500/10 text-green-500 border border-green-500/20 rounded-xl flex items-center gap-2 text-xs font-bold">
                    <CheckCircle size={14} /> Valid for {daysLeft} days
                  </div>
                )}
                {daysLeft !== null && daysLeft < 0 && (
                  <div className="p-3 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl flex items-center gap-2 text-xs font-bold">
                    <AlertTriangle size={14} /> Ticket expired
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MOBILE LEFT SLIDEOVER (Tickets panel toggle) */}
      {leftOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={() => setLeftOpen(false)}
          ></div>
          <div className="fixed inset-y-0 left-0 z-50 w-[80%] max-w-xs bg-card p-6 border-r border-default shadow-2xl flex flex-col space-y-6">
            <div className="flex items-center justify-between">
              <button
                onClick={() => {
                  setSelectedProject(null);
                  setLeftOpen(false);
                }}
                className="flex items-center gap-1.5 text-xs text-secondary hover:text-primary transition"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-neon" />
                Back to Projects
              </button>
              <button
                onClick={() => setLeftOpen(false)}
                className="px-2 py-1 text-xs bg-secondary border border-default rounded-lg text-primary"
              >
                Close
              </button>
            </div>

            <div className="space-y-1">
              <h2 className="text-md font-bold text-primary truncate">{selectedProject?.name}</h2>
              <span className="text-[10px] text-muted font-mono block">ID: {shortId(selectedProject?._id)}</span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              <h3 className="text-xs uppercase font-bold text-muted tracking-wider mb-2">Tickets</h3>
              {ticketsList.map((t, idx) => (
                <button
                  key={t?._id || idx}
                  onClick={() => handleSelectTicket(t)}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-hover hover:text-primary text-secondary border border-transparent hover:border-default/30 transition text-xs truncate"
                >
                  {t?.title}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* MOBILE RIGHT SLIDEOVER (Info detail toggle) */}
      {rightOpen && selectedTicket && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={() => setRightOpen(false)}
          ></div>
          <div className="fixed inset-y-0 right-0 z-50 w-[80%] max-w-xs bg-card p-6 border-l border-default shadow-2xl flex flex-col space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-muted">Issue Details</h2>
              <button
                onClick={() => setRightOpen(false)}
                className="px-2 py-1 text-xs bg-secondary border border-default rounded-lg text-primary"
              >
                Close
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="space-y-1">
                <span className="text-muted block">Ticket ID</span>
                <span className="font-mono text-primary flex items-center gap-1 text-[10px]">
                  {selectedTicket._id}
                  <button
                    type="button"
                    onClick={() => copyID(selectedTicket._id)}
                    className="px-1.5 py-0.5 bg-secondary text-secondary hover:text-primary rounded text-[9px] border border-default transition"
                  >
                    Copy
                  </button>
                </span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-default/10">
                <span className="text-muted">Priority</span>
                <span className="font-bold text-primary">{selectedTicket.priority}</span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-default/10">
                <span className="text-muted">Creator</span>
                <span className="font-bold text-primary">@{selectedTicket.giver?.username || "unknown"}</span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-default/10">
                <span className="text-muted">Assigned To</span>
                <span className="font-bold text-primary">
                  {selectedTicket.doer ? `@${selectedTicket.doer.username}` : "Unassigned"}
                </span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-default/10">
                <span className="text-muted">Assigned On</span>
                <span className="font-bold text-primary">
                  {new Date(selectedTicket.assignedOn).toLocaleDateString()}
                </span>
              </div>

              {/* AI Assignee Suggestion for Mobile */}
              <div className="pt-2 border-t border-default/20">
                <button
                  type="button"
                  onClick={handleSuggestAssignee}
                  disabled={loadingSuggestion}
                  className="w-full py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl font-bold text-xs shadow-md hover:scale-[1.02] flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                >
                  <Sparkles size={12} className={loadingSuggestion ? "animate-spin" : "animate-pulse"} />
                  {loadingSuggestion ? "Finding..." : "Suggest Assignee (AI)"}
                </button>
              </div>

              {recommendations && recommendations.length > 0 && (
                <div className="space-y-3 mt-3">
                  <div className="flex items-center gap-1.5 text-purple-400 font-bold">
                    <Bot size={14} className="animate-pulse" /> AI Matches (Ranked):
                  </div>
                  
                  {recommendations.map((rec) => (
                    <div key={rec.suggestedUserId} className="p-3 bg-purple-950/20 border border-purple-500/30 rounded-xl text-xs space-y-2">
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="font-bold text-primary">{rec.suggestedName}</span>{" "}
                          <span className="text-secondary text-[10px]">(@{rec.suggestedUsername})</span>
                        </div>
                        <span className="px-2 py-0.5 bg-purple-500/25 border border-purple-500/40 text-[9px] font-bold text-purple-300 rounded-full">
                          Rank #{rec.rank}
                        </span>
                      </div>
                      <p className="text-secondary leading-normal italic">"{rec.reasoning}"</p>
                      <button
                        type="button"
                        onClick={() => handleAssignUser(rec.suggestedUserId)}
                        className="w-full py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg transition cursor-pointer text-[10px] shadow"
                      >
                        Assign to {rec.suggestedUsername}
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="pt-2 border-t border-default/10">
                {daysLeft === 0 && (
                  <div className="p-3 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-xl flex items-center gap-2 text-xs font-bold">
                    <AlertTriangle size={14} /> Expires today!
                  </div>
                )}
                {daysLeft === 1 && (
                  <div className="p-3 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-xl flex items-center gap-2 text-xs font-bold">
                    <Clock size={14} /> Expires tomorrow
                  </div>
                )}
                {daysLeft > 1 && (
                  <div className="p-3 bg-green-500/10 text-green-500 border border-green-500/20 rounded-xl flex items-center gap-2 text-xs font-bold">
                    <CheckCircle size={14} /> Valid for {daysLeft} days
                  </div>
                )}
                {daysLeft !== null && daysLeft < 0 && (
                  <div className="p-3 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl flex items-center gap-2 text-xs font-bold">
                    <AlertTriangle size={14} /> Ticket expired
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* CREATE ACTIVITY MODAL */}
      <CreateActivityModal
        isOpen={isActivityModalOpen}
        onClose={() => setIsActivityModalOpen(false)}
        ticketId={selectedTicket?._id}
        projectId={selectedProject?._id}
      />
    </div>
  );
}
