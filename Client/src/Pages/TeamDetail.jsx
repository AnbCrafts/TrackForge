import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { TrackForgeContextAPI } from "../ContextAPI/TrackForgeContextAPI";
import { toast } from "react-toastify";
import axios from "axios";
import {
  Users,
  LinkIcon,
  Pen,
  Plus,
  MoreHorizontal,
  Copy,
  Check,
  Trash2,
  Calendar,
  FolderKanban,
} from "lucide-react";
import RestrictedTeamView from "./RestrictedTeamView";
import AddTeamMemberModal from "../Components/AddTeamMemberModal";

const TeamDetail = () => {
  const navigate = useNavigate();
  const { teamId, hash, username } = useParams();

  const {
    teamData,
    getTeamByID,
    formatDateTime,
    getCurrentUserData,
    currUserData,
    checkAuthorityToViewTeam,
    hasAuthToSeeTeam,
    getTeamJoinRequests,
    removeMemberFromTeam,
    serverURL,
  } = useContext(TrackForgeContextAPI);

  const [activeDropdown, setActiveDropdown] = useState(null);
  const [hasAuthority, setHasAuthority] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [meetings, setMeetings] = useState([]);

  const toggleDropdown = (memberId) => {
    setActiveDropdown(activeDropdown === memberId ? null : memberId);
  };

  useEffect(() => {
    const id = localStorage.getItem("userId");
    getCurrentUserData(id);
  }, []);

  useEffect(() => {
    getTeamByID(teamId);
    checkAuthorityToViewTeam(teamId);
    getTeamJoinRequests(teamId);
  }, [teamId]);

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const response = await axios.get(`${serverURL}/meeting/list/team/${teamId}`);
        if (response.data.success) {
          setMeetings(response.data.meetings || []);
        }
      } catch (err) {
        console.error("Error fetching team meetings:", err);
      }
    };
    if (teamId && serverURL) {
      fetchMeetings();
    }
  }, [teamId, serverURL]);

  useEffect(() => {
    if (currUserData && (currUserData.role === "Admin" || currUserData.role === "Owner")) {
      setHasAuthority(true);
    } else setHasAuthority(false);
  }, [currUserData]);

  const copyToClipboard = () => {
    if (teamData?.raw?.link?.url) {
      navigator.clipboard.writeText(teamData.raw.link.url);
      setCopied(true);
      toast.success("📋 Invite link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (window.confirm("Are you sure you want to remove this member from the team?")) {
      const success = await removeMemberFromTeam(teamId, memberId);
      if (success) {
        toast.success("Member removed successfully");
        setActiveDropdown(null);
      }
    }
  };

  if (!teamData || !teamData.raw)
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-center text-muted animate-pulse">Loading Team Details...</p>
      </div>
    );

  const { creator, members, projects, raw } = teamData;

  return (
    <div className="max-w-full mx-auto h-fit max-h-[100vh] overflow-y-scroll noScroll p-4 space-y-6">
      {/* PERMISSION CHECK */}
      {hasAuthToSeeTeam !== null && !hasAuthToSeeTeam ? (
        <RestrictedTeamView creator={creator} projects={projects} raw={raw} members={members} />
      ) : (
        <div className="space-y-6">
          {/* TEAM HEADER */}
          <div className="bg-card border border-default rounded-2xl px-6 py-5 flex items-start justify-between shadow-xl">
            <div>
              <h1 className="text-3xl font-extrabold text-primary flex items-center gap-3">
                <Users className="h-8 w-8 text-neon" />
                {raw.name}
              </h1>
              <p className="text-xs text-muted mt-1.5 flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                Created on {formatDateTime(raw.createdAt)}
              </p>
            </div>

            {hasAuthority && (
              <Link
                to={"edit"}
                className="flex items-center gap-2 px-4 py-2 rounded-xl btn-gradient text-white text-sm font-semibold shadow-lg hover:opacity-90 transition-all cursor-pointer"
              >
                <Pen className="h-4 w-4" />
                Edit Team
              </Link>
            )}
          </div>

          {/* CREATOR CARD */}
          <div className="bg-card border border-default rounded-2xl shadow-xl p-6 flex items-center gap-5">
            <div className="relative">
              {creator.picture ? (
                <img
                  src={creator.picture}
                  alt="creator"
                  className="w-16 h-16 rounded-full object-cover border border-default shadow-md"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-purple-500/10 text-xl flex items-center justify-center font-bold text-[var(--text-neon)] border border-default">
                  {`${creator.firstName?.[0] || ""}${creator.lastName?.[0] || ""}`.toUpperCase()}
                </div>
              )}
            </div>

            <div className="flex-1">
              <p className="text-lg font-bold text-primary flex items-center gap-2.5">
                {creator.firstName} {creator.lastName}
                <span className="px-2 py-0.5 bg-purple-500/10 text-[var(--text-neon)] rounded-md text-xs font-semibold border border-purple-500/20 shadow-sm">
                  {creator.role}
                </span>
              </p>
              <p className="text-xs text-muted mt-1">
                @{creator.username} • {creator.email}
              </p>
            </div>

            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20 shadow-sm">
              {creator.status}
            </span>
          </div>

          {/* TWO COLUMN CONTENT */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* PROJECTS */}
            <div className="bg-card border border-default rounded-2xl shadow-xl p-6 space-y-4">
              <h2 className="text-xl font-bold text-primary flex items-center gap-2">
                Active Projects
              </h2>

              <div className="space-y-3">
                {projects?.length > 0 ? (
                  projects.map((project) => (
                    <div
                      key={project._id}
                      className="border border-default bg-secondary/35 rounded-xl p-4 hover:bg-hover transition-all flex flex-col justify-between gap-3 shadow-inner"
                    >
                      <div>
                        <h3 className="text-base font-bold text-primary">{project.name}</h3>
                        <p className="text-xs text-muted mt-1 line-clamp-2">{project.description}</p>
                      </div>
                      <Link
                        to={`/auth/${raw.createdBy}/workspace/projects/${project._id}`}
                        className="w-fit text-xs font-bold text-[var(--text-neon)] hover:underline flex items-center gap-1"
                      >
                        <FolderKanban className="h-3.5 w-3.5" /> View Project
                      </Link>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-muted py-4">No projects associated with this team yet.</p>
                )}
              </div>
            </div>

            {/* MEMBERS */}
            <div className="bg-card border border-default rounded-2xl shadow-xl p-6 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-primary">Team Members ({members.length})</h2>

                {hasAuthority && (
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-default rounded-xl bg-secondary hover:bg-hover text-primary text-xs font-semibold cursor-pointer shadow-sm transition"
                  >
                    <Plus className="h-4 w-4 text-neon" />
                    Invite Member
                  </button>
                )}
              </div>

              <div className="flex flex-wrap gap-2.5 overflow-visible">
                {members.map((member) => {
                  const initials = `${member.firstName?.[0] || ""}${member.lastName?.[0] || ""}`.toUpperCase();
                  return (
                    <div
                      key={member._id}
                      className="flex items-center gap-2 bg-secondary/40 px-3.5 py-1.5 rounded-full relative shadow-sm border border-default group hover:border-[var(--border-neon)]/30 transition-all"
                    >
                      <div className="w-5 h-5 rounded-full bg-purple-500/10 text-[9px] flex items-center justify-center font-bold text-[var(--text-neon)]">
                        {initials}
                      </div>

                      <p className="text-xs font-semibold text-primary">
                        {member.firstName} {member.lastName}
                      </p>

                      <span className="text-[10px] opacity-75 font-mono ml-1 px-1.5 py-0.2 bg-card border border-default rounded text-secondary">
                        {member.role}
                      </span>

                      {hasAuthority && member._id !== raw.createdBy && (
                        <div className="relative flex items-center">
                          <MoreHorizontal
                            onClick={() => toggleDropdown(member._id)}
                            className="cursor-pointer ml-1.5 h-3.5 w-3.5 text-muted hover:text-primary transition"
                          />

                          {activeDropdown === member._id && (
                            <div className="absolute left-1/2 -translate-x-1/2 top-6 bg-card border border-default rounded-xl shadow-2xl p-1.5 flex flex-col w-32 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                              <button
                                onClick={() => handleRemoveMember(member._id)}
                                className="text-left text-xs font-semibold text-red-400 hover:bg-red-500/10 px-2.5 py-1.5 rounded-lg transition flex items-center gap-1.5 w-full cursor-pointer"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                                Remove
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* SCHEDULED MEETINGS */}
          <div className="bg-card border border-default rounded-2xl shadow-xl p-6 space-y-4">
            <h2 className="text-xl font-bold text-primary flex items-center gap-2">
              <Calendar className="h-6 w-6 text-neon" />
              Scheduled Team Meetings / Events
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {meetings.length > 0 ? (
                meetings.map((meeting) => {
                  const meetingDate = new Date(meeting.scheduledDate);
                  const isToday = new Date().toDateString() === meetingDate.toDateString();
                  const fullPath = `/auth/${hash}/${username}/workspace/meeting-room/${meeting.roomId}`;
                  return (
                    <div
                      key={meeting._id}
                      className="border border-default bg-secondary/35 rounded-xl p-4 hover:bg-hover transition-all flex flex-col justify-between gap-3 shadow-inner"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="text-base font-bold text-primary">{meeting.title}</h3>
                          {isToday && (
                            <span className="px-2 py-0.5 text-[9px] font-extrabold text-white bg-green-500 rounded-full uppercase tracking-wider animate-pulse">
                              Active Today
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted mt-1.5 line-clamp-2">
                          <strong>Purpose:</strong> {meeting.purpose}
                        </p>
                        <p className="text-xs text-muted mt-1">
                          <strong>Scheduled:</strong> {new Date(meeting.scheduledDate).toLocaleString()}
                        </p>
                      </div>
                      <Link
                        to={fullPath}
                        className="w-full text-center px-4 py-2 border border-default bg-secondary hover:bg-hover text-primary rounded-xl text-xs font-semibold transition cursor-pointer shadow-sm flex items-center justify-center gap-1.5"
                      >
                        <Calendar className="h-3.5 w-3.5 text-neon" />
                        Join Meeting Room
                      </Link>
                    </div>
                  );
                })
              ) : (
                <p className="text-xs text-muted col-span-2 py-4">No scheduled meetings for this team.</p>
              )}
            </div>
          </div>

          {/* INVITE LINK */}
          <div className="bg-card border border-default rounded-2xl shadow-xl p-6 space-y-3.5">
            <h2 className="text-xl font-bold text-primary flex items-center gap-2">
              Invite Code & Share Link
            </h2>

            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-secondary/20 p-3.5 rounded-xl border border-default shadow-inner">
              <div className="flex items-center gap-3 overflow-hidden">
                <LinkIcon className="w-5 h-5 text-neon shrink-0" />
                <span className="text-xs font-mono text-secondary truncate select-all">
                  {raw.link?.url}
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={copyToClipboard}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-secondary hover:bg-hover border border-default text-primary rounded-xl text-xs font-semibold transition cursor-pointer shadow-sm"
                >
                  {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4 text-neon" />}
                  <span>{copied ? "Copied!" : "Copy Link"}</span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-muted pt-1">
              <p>
                Valid Till: <span className="text-secondary font-medium">{formatDateTime(raw.link?.validTill)}</span>
              </p>
              <span className="px-2.5 py-0.5 bg-purple-500/10 text-[var(--text-neon)] border border-purple-500/20 rounded-full text-[10px] font-bold shadow-sm">
                {raw.link?.status || "Active"}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Add Member Modal */}
      <AddTeamMemberModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          getTeamByID(teamId); // Refresh team info after modal operations
        }}
        teamId={teamId}
        existingMembers={members}
      />
    </div>
  );
};

export default TeamDetail;
