import {
  Clock,
  Group,
  Leaf,
  Link2,
  Rocket,
  Skull,
  StepBack,
  Trash,
  Trophy,
  Users,
} from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { TrackForgeContextAPI } from "../ContextAPI/TrackForgeContextAPI";
import SearchProjects from "../Components/SearchProjects";
import SearchUser from "../Components/SearchUser";
import { toast } from "react-toastify";

const EditTeam = () => {
  const { username, hash, teamId } = useParams();
  const { teamData, getTeamByID, formatDateTime, updateTeam } =
    useContext(TrackForgeContextAPI);

  const [selectedProjectIds, setSelectedProjectIds] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState([]);

  useEffect(() => {
    teamId && getTeamByID(teamId);
  }, [teamId]);

  const [activeTab, setActiveTab] = useState("info");
  const [customUrl, setCustomUrl] = useState("");
  const [newValidity, setNewValidity] = useState("");

  const [teamUpdateForm, setTeamUpdateForm] = useState({
    name: "",
    projects: [],
    members: [{ participant: "", joinedAt: Date.now() }],
    link: {
      url: "",
      createdAt: "",
      validTill: "",
      createdBy: "",
      status: "Active",
    },
  });

  // Sync teamData into local form state
  useEffect(() => {
    if (teamData?.raw) {
      setTeamUpdateForm((prev) => ({
        ...prev,
        name: teamData.raw.name ?? prev.name,
        projects: Array.isArray(teamData.raw.projects) ? teamData.raw.projects : prev.projects,
        members: Array.isArray(teamData.raw.members) ? teamData.raw.members : prev.members,
        link: { ...prev.link, ...(teamData.raw.link ? teamData.raw.link : {}) },
      }));
      if (Array.isArray(teamData.raw.projects)) {
        setSelectedProjectIds(teamData.raw.projects);
      }
      if (Array.isArray(teamData.raw.members)) {
        const ids = teamData.raw.members.map((m) => m.participant ?? m._id ?? m);
        setSelectedUserIds(ids.filter(Boolean));
      }
    }
  }, [teamData]);

  // Sync selected projects
  useEffect(() => {
    setTeamUpdateForm((prev) => ({ ...prev, projects: selectedProjectIds }));
  }, [selectedProjectIds]);

  // Sync selected members
  useEffect(() => {
    if (selectedUserIds && selectedUserIds.length > 0) {
      const memberSchema = selectedUserIds.map((id) => {
        const existing = teamData?.raw?.members?.find(
          (m) => m.participant === id || m._id === id
        );
        return { participant: id, joinedAt: existing?.joinedAt ?? new Date().toISOString() };
      });
      setTeamUpdateForm((prev) => ({ ...prev, members: memberSchema }));
    }
  }, [selectedUserIds, teamData]);

  const isEmpty = (form) => {
    if (!form || typeof form !== "object") return true;
    if (!form.name || String(form.name).trim() === "") return true;
    if (!Array.isArray(form.projects) || form.projects.length === 0) return true;
    if (!Array.isArray(form.members) || form.members.length === 0) return true;
    for (const m of form.members) {
      if (!m || (!m.participant && m.participant !== 0)) return true;
      if (typeof m.participant === "string" && m.participant.trim() === "") return true;
    }
    if (!form.link) return true;
    if (!form.link.url || String(form.link.url).trim() === "") return true;
    if (!form.link.createdBy || String(form.link.createdBy).trim() === "") return true;
    if (!form.link.validTill) return true;
    return false;
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const payload = { ...teamUpdateForm };

    if (customUrl && customUrl.trim() !== "") {
      const id = localStorage.getItem("userId");
      payload.link = {
        url: `https://track-forge/invite/team/${teamId}/creator-${id}-${customUrl}`,
        createdAt: Date.now() + 3 * 60 * 1000,
        createdBy: id,
        validTill:
          newValidity && newValidity !== ""
            ? new Date(newValidity).getTime()
            : Date.now() + 7 * 24 * 60 * 60 * 1000,
        status: payload.link?.status ?? "Active",
      };
    } else {
      if ((!payload.link || !payload.link.url) && teamData?.raw?.link) {
        payload.link = { ...teamData.raw.link };
      } else {
        if (payload.link?.validTill && typeof payload.link.validTill === "string") {
          const t = new Date(payload.link.validTill).getTime();
          if (!Number.isNaN(t)) payload.link.validTill = t;
        }
      }
    }

    const path = `/auth/${hash}/${username}/workspace/team/${teamId}`;

    if (isEmpty(payload)) {
      toast.warn("Some fields are empty");
      return;
    }

    try {
      await updateTeam(teamId, payload, path);
      toast.success("Team updated successfully");
    } catch (err) {
      console.error("updateTeam error:", err);
      toast.error("Failed to update team");
    }
  };

  const isLinkExpired = Date.now() > (new Date(teamUpdateForm?.link?.validTill).getTime() || 0);

  const tabs = [
    { id: "info", label: "Team Info", icon: Group },
    { id: "members", label: "Members", icon: Users },
    { id: "projects", label: "Projects", icon: Leaf },
    { id: "link", label: "Invite Link", icon: Link2 },
  ];

  return (
    <div className="min-h-[100vh] bg-primary text-primary">
      {/* Header */}
      <div className="px-6 py-4 w-full bg-card border-b border-default flex items-center gap-4 shadow-sm sticky top-0 z-20">
        <Link
          to={`/auth/${hash}/${username}/workspace/team/${teamId}`}
          className="p-2 rounded-xl bg-secondary hover:bg-hover border border-default text-secondary hover:text-primary transition-all"
        >
          <StepBack className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="font-bold text-xl text-primary">Edit Team</h1>
          <p className="text-xs text-muted">Manage team information, members, projects, and invite links</p>
        </div>
      </div>

      <div className="p-6 max-w-5xl mx-auto">
        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-secondary/40 rounded-xl border border-default mb-6 flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? "bg-card border border-default text-primary shadow-sm"
                  : "text-muted hover:text-primary"
              }`}
            >
              <tab.icon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleUpdate}>
          {/* ─── INFO TAB ─── */}
          {activeTab === "info" && (
            <div className="bg-card border border-default rounded-2xl p-6 shadow-xl space-y-5 max-w-2xl">
              <h2 className="text-lg font-bold text-primary border-b border-default/50 pb-3">Team Name</h2>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="teamName" className="text-xs font-semibold text-secondary flex items-center gap-1.5">
                  <Group className="h-3.5 w-3.5 text-neon" /> Team Name
                </label>
                <input
                  id="teamName"
                  type="text"
                  value={teamUpdateForm.name}
                  onChange={(e) => setTeamUpdateForm((p) => ({ ...p, name: e.target.value }))}
                  placeholder="e.g. Tech Knights..."
                  className="outline-none focus:ring-2 focus:ring-[var(--border-neon)]/40 transition rounded-xl px-3 py-2.5 bg-secondary border border-default text-primary text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-default/50">
                <div className="p-3 bg-secondary/35 border border-default rounded-xl text-center">
                  <p className="text-[10px] text-muted">Members</p>
                  <p className="text-2xl font-extrabold text-primary">{teamData?.members?.length || 0}</p>
                </div>
                <div className="p-3 bg-secondary/35 border border-default rounded-xl text-center">
                  <p className="text-[10px] text-muted">Projects</p>
                  <p className="text-2xl font-extrabold text-primary">{teamData?.projects?.length || 0}</p>
                </div>
              </div>
            </div>
          )}

          {/* ─── MEMBERS TAB ─── */}
          {activeTab === "members" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Current members list */}
              <div className="bg-card border border-default rounded-2xl p-6 shadow-xl space-y-4">
                <h2 className="text-lg font-bold text-primary border-b border-default/50 pb-3">
                  Current Members ({teamData?.members?.length || 0})
                </h2>
                <div className="space-y-2 max-h-72 overflow-y-auto noScroll">
                  {teamData?.members?.length > 0 ? (
                    teamData.members.map((m) => (
                      <div
                        key={m._id}
                        className="flex items-center justify-between px-3 py-2 bg-secondary/40 border border-default rounded-xl"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-7 h-7 rounded-full bg-purple-500/10 flex items-center justify-center text-[10px] font-bold text-[var(--text-neon)]">
                            {`${m.firstName?.[0] || ""}${m.lastName?.[0] || ""}`.toUpperCase()}
                          </span>
                          <div>
                            <p className="text-xs font-semibold text-primary">{m.firstName} {m.lastName}</p>
                            <p className="text-[10px] text-muted">@{m.username}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] px-2 py-0.5 bg-card border border-default rounded-full text-secondary">
                            {m.role}
                          </span>
                          {m.role === "Admin" || m.role === "Owner" ? (
                            <Trophy className="h-4 w-4 text-amber-400" />
                          ) : (
                            <Trash className="h-4 w-4 text-red-400 cursor-pointer" />
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-muted py-4">No members found for this team</p>
                  )}
                </div>
              </div>

              {/* Add members */}
              <div className="bg-card border border-default rounded-2xl p-6 shadow-xl space-y-4">
                <h2 className="text-lg font-bold text-primary border-b border-default/50 pb-3">
                  Search &amp; Add Members
                </h2>
                <SearchUser
                  selectedUserIds={selectedUserIds}
                  setSelectedUserIds={setSelectedUserIds}
                  initialSelected={teamData?.raw?.members?.map((m) => m.participant).filter(Boolean) || []}
                />
                <p className="text-[10px] text-muted">✅ {selectedUserIds.length} member(s) selected</p>
              </div>
            </div>
          )}

          {/* ─── PROJECTS TAB ─── */}
          {activeTab === "projects" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Current projects list */}
              <div className="bg-card border border-default rounded-2xl p-6 shadow-xl space-y-4">
                <h2 className="text-lg font-bold text-primary border-b border-default/50 pb-3">
                  Linked Projects ({teamData?.projects?.length || 0})
                </h2>
                <div className="space-y-2 max-h-72 overflow-y-auto noScroll">
                  {teamData?.projects?.length > 0 ? (
                    teamData.projects.map((p) => (
                      <div
                        key={p._id}
                        className="flex items-center justify-between px-3 py-2 bg-secondary/40 border border-default rounded-xl"
                      >
                        <div className="flex items-center gap-2">
                          <Leaf className="h-3.5 w-3.5 text-neon" />
                          <span className="text-xs font-semibold text-primary">{p.name}</span>
                        </div>
                        <Trash className="h-4 w-4 text-red-400 cursor-pointer" />
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-muted py-4">No projects linked — add some!</p>
                  )}
                </div>
              </div>

              {/* Add projects */}
              <div className="bg-card border border-default rounded-2xl p-6 shadow-xl space-y-4">
                <h2 className="text-lg font-bold text-primary border-b border-default/50 pb-3">
                  Search &amp; Add Projects
                </h2>
                <SearchProjects
                  selectedProjectIds={selectedProjectIds}
                  setSelectedProjectIds={setSelectedProjectIds}
                  initialSelected={teamData?.projects || []}
                />
                <p className="text-[10px] text-muted">✅ {selectedProjectIds.length} project(s) selected</p>
              </div>
            </div>
          )}

          {/* ─── LINK TAB ─── */}
          {activeTab === "link" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Current link status */}
              <div className="bg-card border border-default rounded-2xl p-6 shadow-xl space-y-4">
                <h2 className="text-lg font-bold text-primary border-b border-default/50 pb-3">
                  Current Invite Link
                </h2>

                <div className="space-y-3">
                  <div className="flex flex-col gap-1">
                    <p className="text-[10px] text-muted uppercase tracking-wider font-semibold">URL</p>
                    <div className="px-3 py-2 bg-secondary/40 border border-default rounded-xl text-xs text-primary font-mono break-all">
                      {teamUpdateForm.link?.url || "No link set"}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <p className="text-[10px] text-muted uppercase tracking-wider font-semibold">Validity</p>
                    <div className={`flex items-center gap-2 px-3 py-2 border rounded-xl text-xs font-semibold ${
                      isLinkExpired
                        ? "bg-red-500/10 border-red-500/20 text-red-400"
                        : "bg-green-500/10 border-green-500/20 text-green-400"
                    }`}>
                      {isLinkExpired ? (
                        <Skull className="h-4 w-4" />
                      ) : (
                        <Rocket className="h-4 w-4" />
                      )}
                      {isLinkExpired ? "Link Expired" : "Link Active"} —{" "}
                      {formatDateTime(teamUpdateForm?.link?.validTill)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Create new / update link */}
              <div className="bg-card border border-default rounded-2xl p-6 shadow-xl space-y-5">
                <h2 className="text-lg font-bold text-primary border-b border-default/50 pb-3">
                  {isLinkExpired ? "Renew Invite Link" : "Update Invite Link"}
                </h2>

                {isLinkExpired && (
                  <div className="px-3 py-2 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-400">
                    ⚠️ The current invite link has expired. Create a new one below.
                  </div>
                )}

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="customUrl" className="text-xs font-semibold text-secondary flex items-center gap-1.5">
                    <Link2 className="h-3.5 w-3.5 text-neon" /> Custom Link Suffix
                  </label>
                  <input
                    id="customUrl"
                    type="text"
                    value={customUrl}
                    onChange={(e) => setCustomUrl(e.target.value)}
                    placeholder="e.g. summer-invite-2025"
                    className="outline-none focus:ring-2 focus:ring-[var(--border-neon)]/40 transition rounded-xl px-3 py-2.5 bg-secondary border border-default text-primary text-sm"
                  />
                  {customUrl && (
                    <p className="text-[10px] text-muted font-mono px-1">
                      Will become: track-forge/invite/team/{teamId}/creator-…-{customUrl}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="validTill" className="text-xs font-semibold text-secondary flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-neon" /> Valid Until
                  </label>
                  <input
                    id="validTill"
                    type="date"
                    value={newValidity}
                    onChange={(e) => setNewValidity(e.target.value)}
                    className="outline-none focus:ring-2 focus:ring-[var(--border-neon)]/40 transition rounded-xl px-3 py-2.5 bg-secondary border border-default text-primary text-sm cursor-pointer"
                  />
                  <p className="text-[10px] text-muted">Leave empty to default to 7 days from now</p>
                </div>
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              className="px-8 py-2.5 btn-gradient text-white rounded-xl shadow-lg font-bold text-sm cursor-pointer hover:opacity-90 transition-all flex items-center gap-2"
            >
              <Group className="h-4 w-4" />
              Save Team Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTeam;
