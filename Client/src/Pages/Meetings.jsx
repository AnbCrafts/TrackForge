import React, { useContext, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { TrackForgeContextAPI } from "../ContextAPI/TrackForgeContextAPI";
import {
  Calendar,
  Trash2,
  Edit,
  Copy,
  Check,
  ExternalLink,
  Plus,
  Search,
  Info,
  FolderKanban,
  X
} from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";
import CreateMeetingRoomModal from "../Components/CreateMeetingRoomModal";

export default function Meetings() {
  const { hash, username } = useParams();
  const { serverURL, allProjects, getAllProjects } = useContext(TrackForgeContextAPI);
  const myUserId = localStorage.getItem("userId");

  const [meetings, setMeetings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  
  // Rescheduling/Editing States
  const [editingMeeting, setEditingMeeting] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editPurpose, setEditPurpose] = useState("");
  const [editDate, setEditDate] = useState("");
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  const fetchMeetings = async () => {
    if (!myUserId || !serverURL) return;
    try {
      const response = await axios.get(`${serverURL}/meeting/list/creator/${myUserId}`);
      if (response.data.success) {
        setMeetings(response.data.meetings || []);
      }
    } catch (err) {
      console.error("Error fetching creator meetings:", err);
      toast.error("Failed to load meetings list.");
    }
  };

  useEffect(() => {
    fetchMeetings();
    getAllProjects();
  }, [myUserId, serverURL]);

  const handleCopyLink = (roomId) => {
    const fullLink = `${window.location.origin}/auth/${hash}/${username}/workspace/meeting-room/${roomId}`;
    navigator.clipboard.writeText(fullLink);
    setCopiedId(roomId);
    toast.success("📋 Meeting room join link copied!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (roomId) => {
    if (!window.confirm("⚠️ Are you sure you want to delete this meeting room and all its chat logs?")) {
      return;
    }
    try {
      const response = await axios.delete(`${serverURL}/meeting/delete/${roomId}`);
      if (response.data.success) {
        toast.success("Meeting deleted successfully");
        setMeetings((prev) => prev.filter((m) => m.roomId !== roomId));
      } else {
        toast.error(response.data.message || "Failed to delete meeting.");
      }
    } catch (err) {
      console.error("Delete meeting error:", err);
      toast.error("Failed to delete meeting.");
    }
  };

  const startEdit = (meeting) => {
    setEditingMeeting(meeting);
    setEditTitle(meeting.title);
    setEditPurpose(meeting.purpose);
    
    // Format date for datetime-local input
    if (meeting.scheduledDate) {
      const dateObj = new Date(meeting.scheduledDate);
      const tzOffset = dateObj.getTimezoneOffset() * 60000; // offset in milliseconds
      const localISOTime = (new Date(dateObj - tzOffset)).toISOString().slice(0, 16);
      setEditDate(localISOTime);
    } else {
      setEditDate("");
    }
  };

  const cancelEdit = () => {
    setEditingMeeting(null);
    setEditTitle("");
    setEditPurpose("");
    setEditDate("");
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editTitle.trim() || !editPurpose.trim() || !editDate) {
      toast.warn("Please fill in all required fields.");
      return;
    }

    setIsSavingEdit(true);
    try {
      const response = await axios.patch(`${serverURL}/meeting/update/${editingMeeting.roomId}`, {
        title: editTitle.trim(),
        purpose: editPurpose.trim(),
        scheduledDate: editDate,
      });

      if (response.data.success) {
        toast.success("🎉 Meeting rescheduled and updated successfully!");
        setEditingMeeting(null);
        fetchMeetings(); // reload updated info
      } else {
        toast.error(response.data.message || "Failed to reschedule meeting.");
      }
    } catch (err) {
      console.error("Reschedule error:", err);
      toast.error("Failed to update meeting.");
    } finally {
      setIsSavingEdit(false);
    }
  };

  const getStatus = (scheduledDate) => {
    const meetingDate = new Date(scheduledDate);
    const today = new Date();
    
    if (today.toDateString() === meetingDate.toDateString()) {
      return { label: "Active Today", bg: "bg-green-500 text-white animate-pulse" };
    } else if (meetingDate > today) {
      return { label: "Upcoming", bg: "bg-blue-500/10 text-blue-400 border border-blue-500/20" };
    } else {
      return { label: "Past / Closed", bg: "bg-gray-500/10 text-muted border border-default" };
    }
  };

  const getProjectName = (projId) => {
    const projectList = allProjects?.projects || [];
    const proj = projectList.find((p) => p._id === projId);
    return proj ? proj.name : "General Body Meeting";
  };

  const filteredMeetings = meetings.filter((m) =>
    m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.purpose.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen p-6 bg-primary text-primary">
      {/* HEADER ACTION BAR */}
      <div className="p-5 flex items-center justify-between gap-5 flex-wrap w-full bg-card border border-default rounded-2xl shadow-xl mb-8">
        <div className="flex items-center gap-3">
          <Calendar className="h-7 w-7 text-neon" />
          <h1 className="text-2xl font-bold text-primary">Manage Scheduled Meetings</h1>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 btn-gradient text-white rounded-xl shadow-md hover:shadow-lg font-bold transition-all transform hover:-translate-y-0.5 cursor-pointer text-sm"
        >
          <Plus className="h-4 w-4" />
          <span>Schedule New Meeting</span>
        </button>
      </div>

      {/* SEARCH BAR */}
      <div className="bg-card border border-default rounded-2xl p-4 flex items-center relative mb-6 shadow-md max-w-md">
        <input
          type="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search meetings by title or agenda..."
          className="w-full outline-none border border-default rounded-xl bg-secondary text-primary px-4 py-2 text-xs focus:ring-2 focus:ring-[var(--border-neon)]/50"
        />
        <Search className="absolute right-7 h-4 w-4 text-neon pointer-events-none" />
      </div>

      {/* MEETINGS LISTING */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMeetings.length > 0 ? (
          filteredMeetings.map((meeting) => {
            const status = getStatus(meeting.scheduledDate);
            const isEditing = editingMeeting?.roomId === meeting.roomId;
            const fullPath = `/auth/${hash}/${username}/workspace/meeting-room/${meeting.roomId}`;

            return (
              <div
                key={meeting._id}
                className="bg-card border border-default rounded-2xl p-5 shadow-lg flex flex-col justify-between hover:border-[var(--border-neon)]/30 transition-all duration-300 relative group overflow-hidden"
              >
                {/* Visual Glow Ornament */}
                <div className="absolute -right-16 -top-16 w-32 h-32 bg-purple-600/5 rounded-full blur-2xl group-hover:bg-purple-600/10 transition-all duration-300" />

                {isEditing ? (
                  /* INLINE EDIT FORM */
                  <form onSubmit={handleSaveEdit} className="space-y-4 w-full">
                    <h3 className="text-sm font-bold text-neon flex items-center gap-1.5 border-b border-default pb-2">
                      <Edit className="h-4 w-4" /> Edit Meeting Details
                    </h3>
                    
                    <div>
                      <label className="block text-[10px] font-semibold text-secondary mb-1">Title</label>
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="w-full outline-none border border-default rounded-lg bg-secondary text-primary px-3 py-1.5 text-xs focus:ring-1 focus:ring-[var(--border-neon)]"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold text-secondary mb-1">Purpose / Agenda</label>
                      <textarea
                        rows={2}
                        value={editPurpose}
                        onChange={(e) => setEditPurpose(e.target.value)}
                        className="w-full outline-none border border-default rounded-lg bg-secondary text-primary px-3 py-1.5 text-xs resize-none focus:ring-1 focus:ring-[var(--border-neon)]"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold text-secondary mb-1">Date &amp; Time</label>
                      <input
                        type="datetime-local"
                        value={editDate}
                        onChange={(e) => setEditDate(e.target.value)}
                        className="w-full outline-none border border-default rounded-lg bg-secondary text-primary px-3 py-1.5 text-xs focus:ring-1 focus:ring-[var(--border-neon)]"
                        required
                      />
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-default">
                      <button
                        type="button"
                        onClick={cancelEdit}
                        className="px-3 py-1.5 border border-default bg-secondary hover:bg-hover rounded-lg text-primary text-[10px] font-semibold transition"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSavingEdit}
                        className="px-3 py-1.5 btn-gradient text-white rounded-lg text-[10px] font-bold shadow-md hover:shadow-lg disabled:opacity-50 flex items-center gap-1"
                      >
                        {isSavingEdit ? (
                          <span className="w-2.5 h-2.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        ) : "Save"}
                      </button>
                    </div>
                  </form>
                ) : (
                  /* STANDARD MEETING CARD VIEW */
                  <>
                    <div className="space-y-3.5 z-10 flex-1 flex flex-col justify-start">
                      {/* Badge and Title */}
                      <div className="flex items-start justify-between gap-2.5">
                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wide shadow-sm border border-transparent ${status.bg}`}>
                          {status.label}
                        </span>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => startEdit(meeting)}
                            className="p-1.5 border border-default rounded-lg bg-secondary/80 hover:bg-hover text-muted hover:text-primary transition shadow-sm cursor-pointer"
                            title="Reschedule / Edit"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(meeting.roomId)}
                            className="p-1.5 border border-default rounded-lg bg-secondary/80 hover:bg-red-500/10 text-muted hover:text-red-400 transition shadow-sm cursor-pointer"
                            title="Delete Meeting"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-base font-bold text-primary tracking-tight leading-tight mb-1 truncate">{meeting.title}</h3>
                        <p className="text-xs text-muted flex items-center gap-1">
                          <FolderKanban className="h-3 w-3 text-neon shrink-0" />
                          <span>{getProjectName(meeting.projectId)}</span>
                        </p>
                      </div>

                      <div className="bg-secondary/20 border border-default/50 rounded-xl p-3 space-y-1.5 shadow-inner">
                        <p className="text-xs text-secondary leading-relaxed line-clamp-3">
                          <strong className="text-[10px] font-extrabold uppercase text-muted block mb-0.5">Agenda:</strong>
                          {meeting.purpose}
                        </p>
                      </div>

                      <div className="text-[11px] text-muted space-y-1 mt-auto">
                        <p className="flex items-center gap-1.5">
                          <span className="font-semibold text-secondary">Scheduled Date:</span>
                          <span className="font-mono">{new Date(meeting.scheduledDate).toLocaleDateString()}</span>
                        </p>
                        <p className="flex items-center gap-1.5">
                          <span className="font-semibold text-secondary">Scheduled Time:</span>
                          <span className="font-mono">{new Date(meeting.scheduledDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </p>
                      </div>
                    </div>

                    {/* Actions panel */}
                    <div className="grid grid-cols-2 gap-2 mt-5 border-t border-default/60 pt-4 z-10 shrink-0">
                      <button
                        onClick={() => handleCopyLink(meeting.roomId)}
                        className="flex items-center justify-center gap-1 px-3 py-2 border border-default bg-secondary hover:bg-hover text-primary rounded-xl text-xs font-semibold transition cursor-pointer shadow-sm"
                      >
                        {copiedId === meeting.roomId ? (
                          <Check className="h-3.5 w-3.5 text-green-400" />
                        ) : (
                          <Copy className="h-3.5 w-3.5 text-neon" />
                        )}
                        <span>{copiedId === meeting.roomId ? "Copied" : "Copy Link"}</span>
                      </button>

                      <Link
                        to={fullPath}
                        className="flex items-center justify-center gap-1.5 px-3 py-2 btn-gradient text-white rounded-xl text-xs font-bold transition shadow-md hover:shadow-lg text-center"
                      >
                        <span>Join Room</span>
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </>
                )}
              </div>
            );
          })
        ) : (
          <div className="col-span-full bg-card border border-default rounded-2xl p-12 text-center shadow-md">
            <Info className="h-12 w-12 text-muted/30 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-primary mb-1">No Meetings Found</h3>
            <p className="text-xs text-muted max-w-sm mx-auto">
              You haven't scheduled any meeting rooms yet, or no meetings match your current search.
            </p>
          </div>
        )}
      </div>

      {/* Create Event Modal */}
      <CreateMeetingRoomModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          fetchMeetings(); // Refresh list after schedule
        }}
      />
    </div>
  );
}
