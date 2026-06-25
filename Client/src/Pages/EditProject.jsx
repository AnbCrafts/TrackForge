import React, { useContext, useEffect, useState } from "react";
import { TrackForgeContextAPI } from "../ContextAPI/TrackForgeContextAPI";
import { useNavigate, useParams } from "react-router-dom";
import {
  Archive,
  Clock,
  Crown,
  Database,
  Group,
  StepBack,
  Text,
  Users,
} from "lucide-react";
import SearchTeam from "../Components/SearchTeams";
import SearchUser from "../Components/SearchUser";

const EditProject = () => {
  const { updateProject, projectById, project } = useContext(TrackForgeContextAPI);
  const { projectId, hash, username } = useParams();
  const navigate = useNavigate();

  const [selectedMemberIds, setSelectedMembersIds] = useState([]);
  const [selectedTeamIds, setSelectedTeamIds] = useState([]);
  const [activeTab, setActiveTab] = useState("details");

  const [updateProjectForm, setUpdateProjectForm] = useState({
    name: "",
    description: "",
    owner: "",
    members: [],
    teams: [],
    activity: [],
    startedOn: "",
    deadline: "",
    archived: false,
  });

  useEffect(() => {
    projectById(projectId);
  }, [projectId]);

  useEffect(() => {
    if (project && Object.keys(project).length > 0) {
      setUpdateProjectForm((prev) => ({
        ...prev,
        name: project?.project?.name || "",
        description: project?.project?.description || "",
        owner: project?.project?.owner || "",
        members: project?.members || [],
        teams: project?.teams || [],
        activity: project?.project?.activity || [],
        startedOn: project?.project?.startedOn || "",
        deadline: project?.project?.deadline || "",
        archived: project?.project?.archived || false,
      }));

      setSelectedMembersIds((prev) =>
        prev.length > 0 ? prev : (project.members ? project.members.map((m) => m._id) : [])
      );
      setSelectedTeamIds((prev) =>
        prev.length > 0 ? prev : (project.teams ? project.teams.map((t) => t._id) : [])
      );
    }
  }, [project]);

  const submitUpdateForm = async (e) => {
    e.preventDefault();
    const id = localStorage.getItem("userId");
    const payload = {
      ...updateProjectForm,
      teams: selectedTeamIds,
      members: selectedMemberIds,
    };
    setUpdateProjectForm(payload);
    updateProject(projectId, id, payload);
  };

  const tabs = [
    { id: "details", label: "Project Details", icon: Database },
    { id: "members", label: "Members", icon: Users },
    { id: "teams", label: "Teams", icon: Group },
  ];

  return (
    <div className="min-h-[100vh] bg-primary text-primary">
      {/* Header */}
      <div className="px-6 py-4 w-full bg-card border-b border-default flex items-center gap-4 shadow-sm sticky top-0 z-20">
        <button
          type="button"
          onClick={() => navigate(`/auth/${hash}/${username}/workspace/projects/${projectId}`)}
          className="p-2 cursor-pointer rounded-xl bg-secondary hover:bg-hover border border-default text-secondary hover:text-primary transition-all"
        >
          <StepBack className="h-5 w-5" />
        </button>
        <div>
          <h1 className="font-bold text-xl text-primary">Edit Project</h1>
          <p className="text-xs text-muted">Update project details, members, and teams</p>
        </div>
      </div>

      <div className="p-6 max-w-6xl mx-auto">
        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-secondary/40 rounded-xl border border-default mb-6 w-fit">
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

        <form onSubmit={submitUpdateForm}>
          {/* ─── DETAILS TAB ─── */}
          {activeTab === "details" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left: Project Info */}
              <div className="bg-card border border-default rounded-2xl p-6 shadow-xl space-y-5">
                <h2 className="text-lg font-bold text-primary border-b border-default/50 pb-3">
                  Project Information
                </h2>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="name" className="text-xs font-semibold text-secondary flex items-center gap-1.5">
                    <Database className="h-3.5 w-3.5 text-neon" /> Project Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={updateProjectForm.name}
                    onChange={(e) => setUpdateProjectForm((p) => ({ ...p, name: e.target.value }))}
                    placeholder="Enter project name..."
                    className="outline-none focus:ring-2 focus:ring-[var(--border-neon)]/40 transition rounded-xl px-3 py-2.5 bg-secondary border border-default text-primary text-sm"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="description" className="text-xs font-semibold text-secondary flex items-center gap-1.5">
                    <Text className="h-3.5 w-3.5 text-neon" /> Description
                  </label>
                  <textarea
                    id="description"
                    rows={6}
                    value={updateProjectForm.description}
                    onChange={(e) => setUpdateProjectForm((p) => ({ ...p, description: e.target.value }))}
                    placeholder="Describe this project..."
                    className="outline-none focus:ring-2 focus:ring-[var(--border-neon)]/40 transition rounded-xl px-3 py-2.5 bg-secondary border border-default text-primary text-sm resize-none noScroll"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="archived" className="text-xs font-semibold text-secondary flex items-center gap-1.5">
                    <Archive className="h-3.5 w-3.5 text-neon" /> Status
                  </label>
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                        updateProjectForm.archived
                          ? "bg-red-500/10 text-red-400 border-red-500/20"
                          : "bg-green-500/10 text-green-400 border-green-500/20"
                      }`}
                    >
                      Currently: {updateProjectForm.archived ? "Archived" : "Active"}
                    </span>
                    <select
                      id="archived"
                      value={String(updateProjectForm.archived)}
                      onChange={(e) =>
                        setUpdateProjectForm((p) => ({ ...p, archived: e.target.value === "true" }))
                      }
                      className="flex-1 outline-none focus:ring-2 focus:ring-[var(--border-neon)]/40 transition rounded-xl px-3 py-2.5 bg-secondary border border-default text-primary text-sm cursor-pointer"
                    >
                      <option value="false">Active</option>
                      <option value="true">Archived</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Right: Dates */}
              <div className="bg-card border border-default rounded-2xl p-6 shadow-xl space-y-5">
                <h2 className="text-lg font-bold text-primary border-b border-default/50 pb-3">
                  Dates &amp; Timeline
                </h2>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="startedOn" className="text-xs font-semibold text-secondary flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-neon" /> Started On
                  </label>
                  <div className="px-3 py-2 bg-secondary/40 border border-default rounded-xl text-xs text-muted font-mono">
                    Current:{" "}
                    {updateProjectForm.startedOn
                      ? new Date(updateProjectForm.startedOn).toLocaleDateString()
                      : "Not set"}
                  </div>
                  <input
                    type="date"
                    id="startedOn"
                    value={
                      updateProjectForm.startedOn
                        ? String(updateProjectForm.startedOn).split("T")[0]
                        : ""
                    }
                    onChange={(e) => setUpdateProjectForm((p) => ({ ...p, startedOn: e.target.value }))}
                    className="w-full outline-none focus:ring-2 focus:ring-[var(--border-neon)]/40 transition rounded-xl px-3 py-2.5 bg-secondary border border-default text-primary text-sm cursor-pointer"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="deadline" className="text-xs font-semibold text-secondary flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-neon" /> Deadline
                  </label>
                  <div className="px-3 py-2 bg-secondary/40 border border-default rounded-xl text-xs text-muted font-mono">
                    Current:{" "}
                    {updateProjectForm.deadline
                      ? new Date(updateProjectForm.deadline).toLocaleDateString()
                      : "Not set"}
                  </div>
                  <input
                    type="date"
                    id="deadline"
                    value={
                      updateProjectForm.deadline
                        ? String(updateProjectForm.deadline).split("T")[0]
                        : ""
                    }
                    onChange={(e) => setUpdateProjectForm((p) => ({ ...p, deadline: e.target.value }))}
                    className="w-full outline-none focus:ring-2 focus:ring-[var(--border-neon)]/40 transition rounded-xl px-3 py-2.5 bg-secondary border border-default text-primary text-sm cursor-pointer"
                  />
                </div>

                {/* Quick stats */}
                <div className="pt-3 border-t border-default/50 space-y-2">
                  <p className="text-xs font-bold text-secondary uppercase tracking-wider">Quick Summary</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-3 bg-secondary/35 border border-default rounded-xl text-center">
                      <p className="text-[10px] text-muted">Members</p>
                      <p className="text-2xl font-extrabold text-primary">{updateProjectForm.members?.length || 0}</p>
                    </div>
                    <div className="p-3 bg-secondary/35 border border-default rounded-xl text-center">
                      <p className="text-[10px] text-muted">Teams</p>
                      <p className="text-2xl font-extrabold text-primary">{updateProjectForm.teams?.length || 0}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ─── MEMBERS TAB ─── */}
          {activeTab === "members" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-card border border-default rounded-2xl p-6 shadow-xl space-y-4">
                <h2 className="text-lg font-bold text-primary border-b border-default/50 pb-3">
                  Current Members ({updateProjectForm.members?.length || 0})
                </h2>
                <div className="flex flex-wrap gap-2 max-h-72 overflow-y-auto noScroll">
                  {updateProjectForm.members?.length > 0 ? (
                    updateProjectForm.members.map((m, i) => {
                      const initials = `${m.firstName?.[0] || ""}${m.lastName?.[0] || ""}`.toUpperCase();
                      return (
                        <span
                          key={i}
                          className="inline-flex items-center gap-2 px-2.5 py-1.5 bg-secondary/40 border border-default rounded-full text-xs font-semibold text-primary"
                        >
                          <span className="w-5 h-5 rounded-full bg-purple-500/10 text-[9px] flex items-center justify-center font-bold text-[var(--text-neon)]">
                            {initials}
                          </span>
                          {m.username}
                          <span className="px-1.5 py-0.5 bg-card border border-default rounded text-[9px] text-secondary">
                            {m.role}
                          </span>
                          {(m.role === "Admin" || m.role === "Owner") && (
                            <Crown className="h-3 w-3 text-amber-400" />
                          )}
                        </span>
                      );
                    })
                  ) : (
                    <p className="text-xs text-muted py-4">No members added yet</p>
                  )}
                </div>
              </div>

              <div className="bg-card border border-default rounded-2xl p-6 shadow-xl space-y-4">
                <h2 className="text-lg font-bold text-primary border-b border-default/50 pb-3">
                  Search &amp; Select Members
                </h2>
                <p className="text-xs text-muted">
                  Search for users created by you and select them to add as members:
                </p>
                <SearchUser
                  selectedUserIds={selectedMemberIds}
                  setSelectedUserIds={setSelectedMembersIds}
                  initialSelected={project?.members || []}
                />
                <p className="text-[10px] text-muted pt-1">
                  ✅ {selectedMemberIds.length} member(s) selected
                </p>
              </div>
            </div>
          )}

          {/* ─── TEAMS TAB ─── */}
          {activeTab === "teams" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-card border border-default rounded-2xl p-6 shadow-xl space-y-4">
                <h2 className="text-lg font-bold text-primary border-b border-default/50 pb-3">
                  Linked Teams ({updateProjectForm.teams?.length || 0})
                </h2>
                <div className="flex flex-wrap gap-2 max-h-72 overflow-y-auto noScroll">
                  {updateProjectForm.teams?.length > 0 ? (
                    updateProjectForm.teams.map((t, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-secondary/40 border border-default rounded-full text-xs font-semibold text-primary"
                      >
                        <Group className="h-3.5 w-3.5 text-neon" />
                        {t.name}
                      </span>
                    ))
                  ) : (
                    <p className="text-xs text-muted py-4">No teams linked yet</p>
                  )}
                </div>
              </div>

              <div className="bg-card border border-default rounded-2xl p-6 shadow-xl space-y-4">
                <h2 className="text-lg font-bold text-primary border-b border-default/50 pb-3">
                  Search &amp; Select Teams
                </h2>
                <p className="text-xs text-muted">
                  Search for teams you created and link them to this project:
                </p>
                <SearchTeam
                  selectedTeamIds={selectedTeamIds}
                  setSelectedTeamIds={setSelectedTeamIds}
                  initialSelected={project?.teams || []}
                />
                <p className="text-[10px] text-muted pt-1">
                  ✅ {selectedTeamIds.length} team(s) selected
                </p>
              </div>
            </div>
          )}

          {/* Save button */}
          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              className="px-8 py-2.5 btn-gradient text-white rounded-xl shadow-lg font-bold text-sm cursor-pointer hover:opacity-90 transition-all flex items-center gap-2"
            >
              <Database className="h-4 w-4" />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProject;
