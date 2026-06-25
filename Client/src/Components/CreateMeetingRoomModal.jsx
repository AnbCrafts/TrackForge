import React, { useContext, useEffect, useState } from "react";
import { TrackForgeContextAPI } from "../ContextAPI/TrackForgeContextAPI";
import { X, Calendar, MessageSquare, Info, Shield, Users, FolderKanban } from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";

export default function CreateMeetingRoomModal({ isOpen, onClose }) {
  const {
    allProjects,
    getAllProjects,
    userTeams,
    getUsersTeam,
    allUserProfiles,
    searchUserProfiles,
    serverURL,
  } = useContext(TrackForgeContextAPI);

  const myUserId = localStorage.getItem("userId");

  // Form States
  const [title, setTitle] = useState("");
  const [purpose, setPurpose] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      getAllProjects();
      if (myUserId) {
        getUsersTeam(myUserId);
      }
      searchUserProfiles("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTeamCheckbox = (teamId) => {
    setSelectedTeams((prev) =>
      prev.includes(teamId) ? prev.filter((id) => id !== teamId) : [...prev, teamId]
    );
  };

  const handleUserCheckbox = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !purpose.trim() || !scheduledDate) {
      toast.warn("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post(`${serverURL}/meeting/create`, {
        title: title.trim(),
        purpose: purpose.trim(),
        scheduledDate,
        projectId: selectedProjectId || null,
        teams: selectedTeams,
        users: selectedUsers,
        creator: myUserId,
      });

      if (response.data.success) {
        toast.success("🎉 Meeting room scheduled and invitations sent!");
        // Reset form
        setTitle("");
        setPurpose("");
        setScheduledDate("");
        setSelectedProjectId("");
        setSelectedTeams([]);
        setSelectedUsers([]);
        onClose();
      } else {
        toast.error(response.data.message || "Failed to create meeting room.");
      }
    } catch (err) {
      console.error("Error creating meeting room:", err);
      toast.error("Failed to create meeting room.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-2xl bg-card border border-default rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-default flex items-center justify-between bg-secondary/10">
          <h2 className="text-lg font-bold text-primary flex items-center gap-2">
            <Calendar className="h-5 w-5 text-neon" />
            Schedule Event / Meeting Room
          </h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-secondary text-muted hover:text-primary transition cursor-pointer">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body / Scrollable Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto noScroll p-6 space-y-6">
          <div className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-secondary mb-1.5">Meeting Title *</label>
              <input
                required
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Weekly Sync, Conflict Resolution"
                className="w-full outline-none border rounded-xl focus:ring-2 focus:ring-[var(--border-neon)]/50 border-default px-4 py-2.5 bg-secondary text-primary text-xs"
              />
            </div>

            {/* Purpose */}
            <div>
              <label className="block text-xs font-semibold text-secondary mb-1.5">Event Purpose / Agenda *</label>
              <textarea
                required
                rows={3}
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="Agenda, conflict topics, or details about the event..."
                className="w-full outline-none border rounded-xl focus:ring-2 focus:ring-[var(--border-neon)]/50 border-default px-4 py-2.5 bg-secondary text-primary text-xs resize-none"
              />
            </div>

            {/* Scheduled Date */}
            <div>
              <label className="block text-xs font-semibold text-secondary mb-1.5">Scheduled Date &amp; Time *</label>
              <input
                required
                type="datetime-local"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="w-full outline-none border rounded-xl focus:ring-2 focus:ring-[var(--border-neon)]/50 border-default px-4 py-2.5 bg-secondary text-primary text-xs cursor-pointer"
              />
              <p className="text-[10px] text-muted mt-1.5 flex items-center gap-1">
                <Info className="h-3 w-3 text-neon" />
                Messaging will only be active on the scheduled date.
              </p>
            </div>

            {/* Project Selection */}
            <div>
              <label className="block text-xs font-semibold text-secondary mb-1.5">Associated Project (Optional)</label>
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="w-full outline-none border rounded-xl focus:ring-2 focus:ring-[var(--border-neon)]/50 border-default px-4 py-2.5 bg-secondary text-primary text-xs cursor-pointer"
              >
                <option value="">-- General Body Meeting (None) --</option>
                {allProjects?.projects && allProjects.projects.length > 0 &&
                  allProjects.projects.map((proj) => (
                    <option key={proj._id} value={proj._id}>
                      {proj.name}
                    </option>
                  ))}
              </select>
            </div>

            {/* Invite Teams */}
            <div>
              <label className="block text-xs font-semibold text-secondary mb-1">Invite Teams (Optional)</label>
              <p className="text-[10px] text-muted mb-2">Members of selected teams will automatically get links in their feed.</p>
              <div className="border border-default bg-secondary/20 rounded-xl p-3.5 max-h-32 overflow-y-auto noScroll space-y-2">
                {userTeams && userTeams.length > 0 ? (
                  userTeams.map((item) => {
                    const team = item.team;
                    return (
                      <label key={team._id} className="flex items-center gap-2.5 text-xs text-primary cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={selectedTeams.includes(team._id)}
                          onChange={() => handleTeamCheckbox(team._id)}
                          className="accent-purple-600 cursor-pointer h-3.5 w-3.5"
                        />
                        <span>{team.name}</span>
                      </label>
                    );
                  })
                ) : (
                  <p className="text-[10px] text-muted">No teams found</p>
                )}
              </div>
            </div>

            {/* Invite Individual Users */}
            <div>
              <label className="block text-xs font-semibold text-secondary mb-1">Invite Individual Members (Optional)</label>
              <p className="text-[10px] text-muted mb-2">Selected members will get direct links sent to their workspace chat.</p>
              <div className="border border-default bg-secondary/20 rounded-xl p-3.5 max-h-40 overflow-y-auto noScroll space-y-2">
                {allUserProfiles && allUserProfiles.length > 0 ? (
                  allUserProfiles
                    .filter((u) => u._id !== myUserId)
                    .map((user) => (
                      <label key={user._id} className="flex items-center gap-2.5 text-xs text-primary cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(user._id)}
                          onChange={() => handleUserCheckbox(user._id)}
                          className="accent-purple-600 cursor-pointer h-3.5 w-3.5"
                        />
                        <span>
                          {user.firstName} {user.lastName} (@{user.username}) — <span className="text-[10px] font-bold text-neon">{user.role}</span>
                        </span>
                      </label>
                    ))
                ) : (
                  <p className="text-[10px] text-muted">No other members found</p>
                )}
              </div>
            </div>
          </div>
        </form>

        {/* Modal Footer */}
        <div className="p-5 border-t border-default bg-secondary/10 flex items-center justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 border border-default rounded-xl bg-secondary hover:bg-hover text-primary text-xs font-semibold cursor-pointer transition shadow-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !title.trim() || !purpose.trim() || !scheduledDate}
            className="px-5 py-2 btn-gradient text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1.5"
          >
            {isSubmitting ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Scheduling...
              </>
            ) : (
              <>
                <Calendar className="h-3.5 w-3.5" />
                <span>Schedule Event</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
