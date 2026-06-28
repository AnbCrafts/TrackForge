import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { TrackForgeContextAPI } from "../ContextAPI/TrackForgeContextAPI";
import { toast } from "react-toastify";
import axios from "axios";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import {
  Text,
  ActivityIcon,
  AlertCircle,
  AlertTriangle,
  Calendar,
  CheckCircle,
  Clock,
  Copy,
  FileText,
  Hash,
  MessageSquare,
  MessageSquareOff,
  Send,
  User,
  AlignLeft,
  Flag,
  Flame,
  Sparkles,
  Bot,
} from "lucide-react";
import { CreateActivityForm } from "../Components/ActivityForm";

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

  // Split by code blocks: ```lang\ncode\n```
  const parts = text.split(/(```[\s\S]*?```)/g);

  return (
    <div className="space-y-4 text-xs text-secondary leading-relaxed">
      {parts.map((part, index) => {
        if (part.startsWith("```")) {
          // Parse code block
          const match = part.match(/```(\w*)\n([\s\S]*?)```/);
          const lang = match ? match[1] : "javascript";
          const code = match ? match[2] : part.slice(3, -3);

          return (
            <div key={index} className="relative group my-4 rounded-xl overflow-hidden border border-default shadow-sm bg-[#0f0f13]">
              <div className="flex items-center justify-between px-4 py-2 bg-[#1a1a24] border-b border-default">
                <span className="text-[10px] font-bold text-secondary uppercase tracking-wider">{lang}</span>
                <button
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
          // Parse standard text lines, format headings and lists
          return (
            <div key={index} className="space-y-2">
              {part.split("\n").map((line, lIdx) => {
                const trimmed = line.trim();
                if (!trimmed) return <div key={lIdx} className="h-2" />;

                // Headings
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

                // Bullet points
                if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
                  return (
                    <div key={lIdx} className="flex items-start gap-2 pl-4 text-xs text-secondary">
                      <span className="text-neon mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-neon shadow-[0_0_6px_var(--border-neon)]" />
                      <span>{parseInlineStyles(trimmed.slice(2))}</span>
                    </div>
                  );
                }

                // Ordered lists
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

const ViewDetailedBug = () => {
  const { ticketId } = useParams();
  const {
    updateTicket,
    getSingleTicket,
    singleTicket,
    createActivity,
    getTicketComments,
    ticketComments,
    postComment,
    getThisTicketActivities,
    thisTicketActivities,
    serverURL,
  } = useContext(TrackForgeContextAPI);

  const [currTickPage, setCurrTickPage] = useState(1);
  const [userId, setUserId] = useState(null);
  const [leftOpen, setLeftOpen] = useState(false);
  const [rightOpen, setRightOpen] = useState(false);

  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [loadingAi, setLoadingAi] = useState(false);

  const handleAnalyzeBug = async () => {
    if (!ticketId || !serverURL) {
      return toast.error("Unable to resolve ticket parameters.");
    }
    setLoadingAi(true);
    try {
      const response = await axios.post(`${serverURL}/ai/bug/${ticketId}/analyze`);
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

  const [recommendations, setRecommendations] = useState([]);
  const [loadingSuggestion, setLoadingSuggestion] = useState(false);

  const handleSuggestAssignee = async () => {
    if (!ticketId || !serverURL) {
      return toast.error("Unable to resolve ticket parameters.");
    }
    setLoadingSuggestion(true);
    setRecommendations([]);
    try {
      const response = await axios.post(`${serverURL}/ai/ticket/suggest-assignee`, { ticketId });
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
    try {
      const response = await axios.put(`${serverURL}/ticket/${ticketId}/user/${targetUserId}`);
      if (response.data.success) {
        toast.success("Ticket successfully assigned!");
        setRecommendations([]);
        getSingleTicket(ticketId);
      } else {
        toast.error(response.data.message || "Failed to assign ticket.");
      }
    } catch (err) {
      console.error("Assign ticket error:", err);
      toast.error(err.response?.data?.message || "Failed to assign ticket.");
    }
  };

  const [activityForm, setActivityForm] = useState({
    actionType: "",
    ticketId: "",
    performedBy: "",
    performedOn: "",
    details: "",
    doneOn: "",
  });

  const [commentForm, setCommentForm] = useState({
    message: "",
    userId: "",
    projectId: "",
    ticket: "",
    type: "Text",
  });

  useEffect(() => {
    const uid = localStorage.getItem("userId");
    setUserId(uid);
  }, []);

  useEffect(() => {
    if (ticketId) {
      getSingleTicket(ticketId);
      getTicketComments(ticketId, currTickPage);
      getThisTicketActivities(ticketId);
    }
  }, [ticketId]);

  useEffect(() => {
    const tId = localStorage.getItem("currTicketId") || ticketId;
    const pId =
      localStorage.getItem("currProjectId") ||
      (singleTicket && singleTicket.project?._id);

    if (pId && tId) {
      setCommentForm((prev) => ({
        ...prev,
        projectId: pId,
        ticket: tId,
      }));
    }
  }, [ticketComments, singleTicket]);

  useEffect(() => {
    if (userId) {
      setActivityForm((prev) => ({
        ...prev,
        performedBy: userId,
      }));

      setCommentForm((prev) => ({
        ...prev,
        userId: userId,
      }));
    }
  }, [userId]);

  /** PRIORITY STYLES */
  const priorityStyles = {
    low: { className: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20", icon: Flag },
    medium: { className: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20", icon: AlertTriangle },
    high: { className: "bg-orange-500/10 text-orange-400 border border-orange-500/20", icon: Flame },
    critical: { className: "bg-red-500/10 text-red-400 border border-red-500/20 shadow-[0_0_8px_rgba(239,68,68,0.2)]", icon: AlertCircle },
  };

  const PriorityBadge = ({ priority }) => {
    const p = priorityStyles[priority?.toLowerCase()] || priorityStyles.low;
    const Icon = p.icon;
    return (
      <span className={`px-2 py-1 rounded-lg flex items-center gap-1 text-xs font-semibold ${p.className}`}>
        <Icon size={12} /> {priority}
      </span>
    );
  };

  const hideTicketID = (id) => {
    if (!id) return "";
    if (id.length <= 10) return id;
    return id.slice(0, 10) + "*".repeat(id.length - 10);
  };

  /** Copy helpers */
  const copyToClipboard = (value) => {
    if (!value) return toast.info("Nothing to copy");
    navigator.clipboard.writeText(value);
    toast.success("Copied to clipboard!");
  };

  /** Submit Activity */
  const submitActivity = async (e) => {
    e.preventDefault && e.preventDefault();

    const hasEmpty = Object.values(activityForm).some(
      (x) => x === "" || x === null || x === undefined
    );
    if (hasEmpty) return toast.warn("Please fill all fields!");

    await createActivity(activityForm);
    setActivityForm({
      actionType: "",
      ticketId: "",
      performedBy: userId,
      performedOn: "",
      details: "",
      doneOn: "",
    });
  };

  /** Submit Comment */
  const submitComment = async (e) => {
    e.preventDefault && e.preventDefault();
    const hasEmpty = Object.values(commentForm).some(
      (x) => x === "" || x === null || x === undefined
    );
    if (hasEmpty) return toast.warn("Please fill all fields!");

    await postComment(commentForm);

    setCommentForm((prev) => ({ ...prev, message: "" }));
  };

  /** Ticket expiry logic */
  useEffect(() => {
    if (!singleTicket?.validFor) return;
    const today = new Date();
    const expiry = new Date(singleTicket.validFor);
    today.setHours(0, 0, 0, 0);
    expiry.setHours(0, 0, 0, 0);

    if (expiry < today && singleTicket.status !== "Closed") {
      updateTicket(singleTicket._id, "Closed");
    }
  }, [singleTicket]);

  /** days left */
  const daysLeft = (() => {
    if (!singleTicket?.validFor) return null;
    const today = new Date();
    const expiry = new Date(singleTicket.validFor);
    today.setHours(0, 0, 0, 0);
    expiry.setHours(0, 0, 0, 0);
    return Math.round((expiry - today) / (1000 * 60 * 60 * 24));
  })();

  return (
    <div className="min-h-screen bg-primary text-primary flex flex-col md:flex-row">
      {/* small animation style */}
      <style>{`
        @keyframes slideIn { from { transform: translateX(-100%);} to { transform: translateX(0);} }
        .animate-slideIn { animation: slideIn 0.22s ease-out; }
        @keyframes slideInRight { from { transform: translateX(100%);} to { transform: translateX(0);} }
        .animate-slideInRight { animation: slideInRight 0.22s ease-out; }
      `}</style>

      <div className="w-full min-h-screen bg-primary flex text-primary">

        {/* LEFT SIDEBAR (desktop) */}
        <div className="w-[260px] bg-card border-r border-[var(--border-default)]/40 p-6 space-y-6 hidden md:block shadow-xl backdrop-blur-md">
          <h1 className="text-xl font-bold bg-gradient-to-r from-neon via-purple-400 to-indigo-400 bg-clip-text text-transparent">Project</h1>

          <div className="space-y-1">
            <span className="text-[10px] text-secondary font-bold uppercase tracking-wider block">Project ID</span>
            <div className="flex items-center gap-1.5 bg-secondary border border-default p-2 rounded-xl text-xs text-primary max-w-full">
              <span className="truncate flex-1 font-mono text-[11px]">{singleTicket?.project?._id}</span>
              <button
                onClick={() => copyToClipboard(singleTicket?.project?._id)}
                className="px-2 py-1 text-[10px] bg-card border border-default hover:bg-hover rounded-lg text-primary transition shrink-0 cursor-pointer"
              >
                Copy
              </button>
            </div>
          </div>

          <div className="pt-4 space-y-2 text-sm border-t border-[var(--border-default)]/20">
            <p className="uppercase text-secondary text-[10px] font-bold tracking-wider mb-2">Sections</p>
            <button
              onClick={() => document.getElementById("overview-section")?.scrollIntoView({ behavior: "smooth" })}
              className="block w-full text-left hover:text-neon text-secondary font-medium transition cursor-pointer bg-transparent border-none p-0 outline-none"
            >
              Overview
            </button>
            <button
              onClick={() => document.getElementById("ai-analyst-section")?.scrollIntoView({ behavior: "smooth" })}
              className="block w-full text-left hover:text-neon text-neon font-bold transition cursor-pointer bg-transparent border-none p-0 outline-none"
            >
              ✨ AI Analyst
            </button>
            <button
              onClick={() => document.getElementById("activity-section")?.scrollIntoView({ behavior: "smooth" })}
              className="block w-full text-left hover:text-neon text-secondary font-medium transition cursor-pointer bg-transparent border-none p-0 outline-none"
            >
              Activity Log
            </button>
            <button
              onClick={() => document.getElementById("comments-section")?.scrollIntoView({ behavior: "smooth" })}
              className="block w-full text-left hover:text-neon text-secondary font-medium transition cursor-pointer bg-transparent border-none p-0 outline-none"
            >
              Comments
            </button>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="flex-1 p-6 md:p-10 space-y-8 overflow-y-auto bg-primary/20 scrollbar-thin">

          {/* MOBILE Header Controls */}
          <div className="md:hidden flex items-center justify-between mb-4 bg-card border border-default p-3 rounded-2xl shadow-md">
            <button onClick={() => setLeftOpen(true)} className="px-3 py-1.5 bg-secondary hover:bg-hover border border-default rounded-xl text-xs text-primary transition cursor-pointer">
              Ticket
            </button>

            <div className="flex items-center gap-2">
              <button onClick={() => copyToClipboard(singleTicket?._id)} className="px-3 py-1.5 bg-secondary hover:bg-hover border border-default rounded-xl text-xs text-primary transition cursor-pointer">
                Copy ID
              </button>

              <button onClick={() => setRightOpen(true)} className="px-3 py-1.5 bg-secondary hover:bg-hover border border-default rounded-xl text-xs text-primary transition cursor-pointer">
                Info
              </button>
            </div>
          </div>

          {/* TITLE + STATUS */}
          <div id="overview-section" className="bg-card p-6 rounded-2xl shadow-xl space-y-4 border border-default/40 backdrop-blur-md">
            <h1 className="text-3xl font-extrabold text-primary leading-tight">{singleTicket?.title}</h1>

            <div className="flex items-center gap-3">
              <span
                className={`px-3 py-1 rounded-lg text-white text-xs font-bold shadow-sm ${
                  singleTicket?.status === "Open"
                    ? "bg-emerald-600"
                    : singleTicket?.status === "Closed"
                    ? "bg-rose-600"
                    : "bg-amber-500"
                }`}
              >
                {singleTicket?.status}
              </span>

              <PriorityBadge priority={singleTicket?.priority} />
            </div>
          </div>

          {/* DESCRIPTION */}
          <div className="bg-card p-6 rounded-2xl shadow-xl space-y-4 border border-default/40 backdrop-blur-md">
            <h2 className="text-xl font-bold flex items-center gap-2 text-primary">
              <FileText className="text-neon" /> Description
            </h2>
            <p className="text-secondary text-xs leading-relaxed whitespace-pre-wrap">{singleTicket?.description}</p>
          </div>

          {/* STEPS */}
          <div className="bg-card p-6 rounded-2xl shadow-xl space-y-4 border border-default/40 backdrop-blur-md">
            <h2 className="text-xl font-bold flex items-center gap-2 text-rose-400 border-b border-default/20 pb-2">
              <AlertTriangle className="text-rose-400" /> Steps to Reproduce
            </h2>

            <ul className="space-y-2 text-secondary text-xs">
              {singleTicket?.stepsToReproduce?.map((s, i) => (
                <li key={i} className="flex items-start gap-3">
                  <AlignLeft className="text-secondary mt-0.5 shrink-0" size={14} />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* AI Bug Analyst Section */}
          <div id="ai-analyst-section" className="bg-card p-6 rounded-2xl shadow-xl space-y-4 border border-purple-500/20 backdrop-blur-md shadow-purple-500/5">
            <div className="flex items-center justify-between border-b border-default/20 pb-3">
              <h2 className="text-xl font-bold flex items-center gap-2 bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                <Sparkles className="text-purple-400 shrink-0" /> AI Bug Analyst
              </h2>
              {aiAnalysis && !loadingAi && (
                <button
                  onClick={handleAnalyzeBug}
                  disabled={loadingAi}
                  className="px-3 py-1.5 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
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
              <div className="flex flex-col items-center justify-center py-10 text-center space-y-4">
                <div className="p-3 bg-purple-500/10 rounded-full text-purple-400 border border-purple-500/20">
                  <Sparkles size={28} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-primary">Need help resolving this issue?</h3>
                  <p className="text-xs text-secondary max-w-sm">Get instant code recommendations, root cause analysis, and prevention guidelines directly from Gemini AI.</p>
                </div>
                <button
                  onClick={handleAnalyzeBug}
                  className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl font-bold text-xs shadow-lg hover:scale-[1.02] flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Sparkles size={14} /> Analyze Bug with AI
                </button>
              </div>
            )}
          </div>

          {/* ACTIVITY LOG */}
          <div id="activity-section" className="bg-card p-6 rounded-2xl shadow-xl space-y-4 border border-default/40 backdrop-blur-md">
            <h2 className="text-xl font-bold flex items-center gap-2 text-emerald-400 border-b border-default/20 pb-2">
              <CheckCircle /> Activity Log
            </h2>

            <div className="space-y-4 pt-2">
              {thisTicketActivities?.map((a, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="flex flex-col items-center mt-1">
                    <div className="w-3 h-3 bg-neon rounded-full shadow-[0_0_8px_var(--border-neon)] shrink-0"></div>
                    {i !== thisTicketActivities.length - 1 && (
                      <div className="w-px h-16 bg-default my-1" />
                    )}
                  </div>

                  <div className="flex-1 bg-secondary border border-default p-4 rounded-2xl shadow-sm hover:shadow-md transition text-primary">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-bold text-xs text-primary">{a.actionType}</div>
                      <div className="flex items-center gap-1 text-[10px] text-secondary">
                        <Calendar size={12} /> {new Date(a.doneOn).toLocaleDateString()}
                      </div>
                    </div>

                    <p className="text-secondary text-xs mb-3 leading-normal">{a.details}</p>

                    <div className="flex items-center gap-1.5 text-secondary text-[10px]">
                      <User size={12} />
                      <span>{a.performedBy?.username}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* COMMENTS */}
          <div id="comments-section" className="bg-card p-6 rounded-2xl shadow-xl space-y-4 border border-default/40 backdrop-blur-md">
            <h2 className="text-xl font-bold flex items-center gap-2 text-primary border-b border-default/20 pb-2">
              <MessageSquare /> Comments
            </h2>

            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin">
              {ticketComments?.comments?.length ? (
                ticketComments.comments.map((c) => (
                  <div
                    key={c._id}
                    className="p-4 rounded-xl bg-secondary border border-default shadow-sm text-primary"
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-xs text-primary leading-normal">{c.message}</p>
                      <span className="text-[10px] text-secondary">
                        {new Date(c.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <p className="text-[10px] text-secondary mt-2 font-medium">— @{c.userId?.username}</p>
                  </div>
                ))
              ) : (
                <div className="flex items-center gap-2 bg-secondary border border-default p-3 rounded-xl text-secondary text-xs">
                  <MessageSquareOff size={16} />
                  <span>No comments yet.</span>
                </div>
              )}
            </div>

            {/* COMMENT FORM */}
            <form onSubmit={submitComment} className="space-y-3 pt-2">
              <input
                value={commentForm.message}
                onChange={(e) =>
                  setCommentForm((prev) => ({
                    ...prev,
                    message: e.target.value,
                  }))
                }
                className="w-full p-3 rounded-xl border border-default bg-secondary text-primary outline-none focus:ring-1 focus:ring-neon text-xs"
                placeholder="Type a comment..."
              />

              <div className="flex items-center gap-3">
                <select
                  className="border border-default bg-secondary text-primary rounded-xl px-3 py-1.5 outline-none focus:ring-1 focus:ring-neon text-xs cursor-pointer"
                  value={commentForm.type}
                  onChange={(e) =>
                    setCommentForm((prev) => ({
                      ...prev,
                      type: e.target.value,
                    }))
                  }
                >
                  <option>Text</option>
                  <option>Status Change</option>
                  <option>System</option>
                </select>

                <button className="ml-auto flex items-center gap-2 btn-gradient text-white font-bold px-4 py-2 rounded-xl text-xs shadow-md hover:scale-[1.02] transition cursor-pointer">
                  <Send size={14} />
                  Send
                </button>
              </div>
            </form>
          </div>

          {/* Activity Form */}
          <div className="pt-2">
            <CreateActivityForm
              activityForm={activityForm}
              setActivityForm={setActivityForm}
              onSubmit={submitActivity}
              performedBy={userId}
              defaultTicketId={singleTicket?._id}
              projectId={singleTicket?.project?._id}
           />
          </div>
          
        </div>

        {/* RIGHT SIDEBAR (desktop) */}
        <div className="w-[300px] bg-card border-l border-[var(--border-default)]/40 p-6 space-y-6 hidden lg:block shadow-xl backdrop-blur-md text-primary">
          <h3 className="text-lg font-bold text-primary border-b border-default/20 pb-2">Issue Info</h3>

          <div className="space-y-3 text-xs leading-relaxed">
            <div className="space-y-1">
              <span className="text-[10px] text-secondary font-bold uppercase tracking-wider block">Ticket ID</span>
              <div className="flex items-center gap-1.5 bg-secondary border border-default p-2 rounded-xl text-xs text-primary max-w-full">
                <span className="truncate flex-1 font-mono text-[11px]">{singleTicket?._id}</span>
                <button
                  onClick={() => copyToClipboard(singleTicket?._id)}
                  className="px-2 py-1 text-[10px] bg-card border border-default hover:bg-hover rounded-lg text-primary transition shrink-0 cursor-pointer"
                >
                  Copy
                </button>
              </div>
            </div>

            <p className="flex items-center gap-2 text-secondary">
              <User size={14} className="text-neon" /> <span className="font-semibold text-primary">Issued By:</span> {singleTicket?.giver?.username}
            </p>

            <p className="flex items-center gap-2 text-secondary">
              <User size={14} className="text-neon" /> <span className="font-semibold text-primary">Assigned To:</span> {singleTicket?.doer ? `@${singleTicket.doer.username}` : "Unassigned"}
            </p>

            <p className="flex items-center gap-2 text-secondary">
              <Calendar size={14} className="text-neon" /> <span className="font-semibold text-primary">Assigned On:</span>{" "}
              {singleTicket ? new Date(singleTicket.assignedOn).toLocaleDateString() : ""}
            </p>

            {/* AI Assignee Suggestion Section */}
            <div className="pt-2">
              <button
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
                      onClick={() => handleAssignUser(rec.suggestedUserId)}
                      className="w-full py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg transition cursor-pointer text-[10px] shadow"
                    >
                      Assign to {rec.suggestedUsername}
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4 pt-4 border-t border-default/20">
              {daysLeft === 0 && (
                <div className="p-2.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl flex gap-2 text-xs font-semibold">
                  <AlertTriangle size={16} /> Expires Today
                </div>
              )}
              {daysLeft === 1 && (
                <div className="p-2.5 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 rounded-xl flex gap-2 text-xs font-semibold">
                  <Clock size={16} /> Expires Tomorrow
                </div>
              )}
              {daysLeft > 1 && (
                <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl flex gap-2 text-xs font-semibold">
                  <CheckCircle size={16} /> Valid for {daysLeft} days
                </div>
              )}
              {daysLeft < 0 && (
                <div className="p-2.5 bg-secondary border border-default text-secondary rounded-xl flex gap-2 text-xs font-semibold">
                  <AlertTriangle size={16} /> Ticket Expired
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE LEFT SIDEBAR */}
      {leftOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setLeftOpen(false)}></div>
          <div className="fixed inset-y-0 left-0 w-[80%] max-w-xs bg-card border-r border-default z-50 p-6 shadow-xl rounded-r-2xl animate-slideIn text-primary backdrop-blur-md">
            <div className="flex items-center justify-between mb-4 border-b border-default/20 pb-2">
              <h2 className="font-bold text-lg">Ticket</h2>
              <button onClick={() => setLeftOpen(false)} className="px-3 py-1.5 rounded-xl bg-secondary border border-default hover:bg-hover text-xs text-primary transition cursor-pointer">
                Close
              </button>
            </div>

            <p className="font-bold text-sm text-primary mb-4 leading-snug">{singleTicket?.title}</p>
            
            <div className="space-y-1">
              <span className="text-[10px] text-secondary font-bold uppercase tracking-wider block">Project ID</span>
              <div className="flex items-center gap-1.5 bg-secondary border border-default p-2 rounded-xl text-xs text-primary max-w-full">
                <span className="truncate flex-1 font-mono text-[11px]">{singleTicket?.project?._id}</span>
                <button
                  onClick={() => copyToClipboard(singleTicket?.project?._id)}
                  className="px-2 py-1 text-[10px] bg-card border border-default hover:bg-hover rounded-lg text-primary transition shrink-0 cursor-pointer"
                >
                  Copy
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* MOBILE RIGHT SIDEBAR */}
      {rightOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setRightOpen(false)}></div>

          <div className="fixed inset-y-0 right-0 w-[80%] max-w-xs bg-card border-l border-default z-50 p-6 shadow-xl rounded-l-2xl animate-slideInRight text-primary backdrop-blur-md">
            <div className="flex items-center justify-between mb-4 border-b border-default/20 pb-2">
              <h2 className="font-bold text-lg">Issue Info</h2>
              <button onClick={() => setRightOpen(false)} className="px-3 py-1.5 rounded-xl bg-secondary border border-default hover:bg-hover text-xs text-primary transition cursor-pointer">
                Close
              </button>
            </div>

            <div className="space-y-4 text-xs leading-relaxed">
              <div className="space-y-1">
                <span className="text-[10px] text-secondary font-bold uppercase tracking-wider block">Ticket ID</span>
                <div className="flex items-center gap-1.5 bg-secondary border border-default p-2 rounded-xl text-xs text-primary max-w-full">
                  <span className="truncate flex-1 font-mono text-[11px]">{singleTicket?._id}</span>
                  <button
                    onClick={() => copyToClipboard(singleTicket?._id)}
                    className="px-2 py-1 text-[10px] bg-card border border-default hover:bg-hover rounded-lg text-primary transition shrink-0 cursor-pointer"
                  >
                    Copy
                  </button>
                </div>
              </div>

              <p className="flex items-center gap-2 text-secondary">
                <User size={14} className="text-neon" /> <span className="font-semibold text-primary">Issued By:</span> {singleTicket?.giver?.username}
              </p>

              <p className="flex items-center gap-2 text-secondary">
                <User size={14} className="text-neon" /> <span className="font-semibold text-primary">Assigned To:</span> {singleTicket?.doer ? `@${singleTicket.doer.username}` : "Unassigned"}
              </p>

              <p className="flex items-center gap-2 text-secondary">
                <Calendar size={14} className="text-neon" /> <span className="font-semibold text-primary">Assigned On:</span>{" "}
                {singleTicket ? new Date(singleTicket.assignedOn).toLocaleDateString() : ""}
              </p>

              {/* AI Assignee Suggestion for Mobile */}
              <div className="pt-2 border-t border-default/20">
                <button
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
                        onClick={() => handleAssignUser(rec.suggestedUserId)}
                        className="w-full py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg transition cursor-pointer text-[10px] shadow"
                      >
                        Assign to {rec.suggestedUsername}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ViewDetailedBug;
