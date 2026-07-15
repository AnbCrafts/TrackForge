import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { TrackForgeContextAPI } from "../ContextAPI/TrackForgeContextAPI";
import {
  Book,
  Clock,
  Edit,
  PersonStanding,
  Pin,
  Scale,
  Sticker,
  Text,
  Ticket,
  Trash,
  User,
  WavesLadder,
  X,
  Flag, CheckCircle, Eye, Trash2,
  MoveLeft,
  MoveRight,
  File,
  Folder,
  FileIcon,
  FileCode,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Github
} from "lucide-react";
import SearchUser from "../Components/SearchUser";
import SearchTeam from "../Components/SearchTeams";
import { toast } from "react-toastify";
import RestrictedProjectCard from "../Components/RestrictedProjectCard";
import { TreeNode, buildFileTree } from "../Components/TreeNode";
import LinkGithubButton from "../Components/LinkGithubButton";

const ProjectDetail = () => {
  const navigate = useNavigate();
  const {
    project,
    projectById,
    getProjectStats,
    projectStats,
    addMember,
    addTeam,
    getProjectComments,
    createTicket,
    deleteProject,
    getThisProjectTickets, thisProjectTickets,
    uploadProjectFILES, uploadedFolders,
    fetchProjectFiles, thisProjectFiles,
    patchProjectJoinRequest, sendProjectJoinRequest, checkAuthorityToViewProject, hasAuthToSeeProject, reqStatus, getPendingProjectRequests, pendingProjectReqLists,
    authUserData, getUserDataById, getThisUserGithubRepo, githubRepo, importGithubRepo
  } = useContext(TrackForgeContextAPI);

  const { projectId, username, hash } = useParams();

  const [ticketForm, setTicketForm] = useState({
    title: "",
    description: "",
    assignedTo: "",
    projectId: projectId || "",
    createdBy: localStorage.getItem("userId"),
    priority: "",
    stepsToReproduce: [],
    attachments: [],
  });

  const [page, setPage] = useState(1);
  useEffect(() => {
    if (projectId) {
      projectById(projectId);
      getProjectStats(projectId);
      getProjectComments(projectId, page);
      fetchProjectFiles(projectId);
      checkAuthorityToViewProject(projectId);
      getPendingProjectRequests(projectId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      setTicketForm((prev) => ({
        ...prev,
        createdBy: userId,
      }));
    }
  }, []);

  const data = project || {};
  const projectInfo = data.project || {};
  const owner = data.owner || {};
  const members = data.members || [];
  const activities = data.activity || [];

  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [selectedTeamIds, setSelectedTeamIds] = useState([]);
  const [uploadMode, setUploadMode] = useState("files"); // "files" or "directory"
  const [isUploading, setIsUploading] = useState(false);

  const [selectedRepo, setSelectedRepo] = useState("");
  const [repoBranch, setRepoBranch] = useState("main");
  const [isImporting, setIsImporting] = useState(false);

  // Fetch current user details to check GitHub connection status
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      getUserDataById(userId);
    }
  }, []);

  // Fetch GitHub repos if linked
  useEffect(() => {
    if (authUserData && authUserData.githubAccessToken !== null) {
      getThisUserGithubRepo();
    }
  }, [authUserData]);

  const addUser = async (e) => {
    e.preventDefault();
    if (selectedUserIds.length === 0) {
      toast.warn("You need to select members first");
    } else {
      await Promise.all(
        selectedUserIds.map(async (u) => {
          await addMember(projectId, u);
        })
      );
      setSelectedUserIds([]);
    }
  };

  const addGroup = async (e) => {
    e.preventDefault();
    if (selectedTeamIds.length === 0) {
      toast.warn("You need to select teams first");
    } else {
      await Promise.all(
        selectedTeamIds.map(async (t) => {
          await addTeam(projectId, t);
        })
      );
      setSelectedTeamIds([]);
    }
  };

  const isFormValid = () => {
    const { title, description, assignedTo, projectId: pid, createdBy, priority } =
      ticketForm;

    if (
      !title?.trim() ||
      !description?.trim() ||
      !assignedTo?.trim() ||
      !pid?.trim() ||
      !createdBy?.trim() ||
      !priority?.trim()
    ) {
      return false;
    }

    return true;
  };

  const handleTicketCreation = async (e) => {
    e.preventDefault();

    if (!isFormValid()) {
      toast.warn("All required fields must be filled!");
      return;
    } else {
      await createTicket(ticketForm);
      getThisProjectTickets(projectId,1);

      setTimeout(() => {
         setTicketForm({
        title: "",
        description: "",
        assignedTo: "",
        projectId: projectId || "",
        createdBy: localStorage.getItem("userId") || "",
        priority: "",
        stepsToReproduce: [],
        attachments: [],
      });
      }, 800);
     
    }
  };

  const [ticketPage, setTicketPage] = useState(1);

  // fixed: react when ticketPage changes
  useEffect(() => {
    if (projectId) getThisProjectTickets(projectId, ticketPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId, ticketPage]);

  const handleDeleteTicket = async (id) => {
    // placeholder: your function exists above; call it if available
    if (!id) return;
    // You can implement a delete API call here if available.
    toast.info("Delete ticket handler called");
  };

  const handleViewDetails = async (id) => {
    navigate(`/auth/${hash}/${username}/workspace/ticket-detail/${id}`);
  };

  const [file, setFile] = useState({
    filename: "",
    size: 0,
    path: "",
    fileType: "",
    uploadedAt: Date.now(),
    uploadedBy: localStorage.getItem("userId")
  });

  const [folderForm, setFolderForm] = useState({
    name: "",
    files: [
      file
    ]
  });

  const uploadProjectFolder = async (e) => {
    e.preventDefault();
    if (isUploading) return;

    if (folderForm.files.length === 0) {
      toast.warn("Please choose files to upload first");
      return;
    }

    const targetFolderName = folderForm.name.trim() || projectInfo?.name || "root";
    setIsUploading(true);

    try {
      const formData = new FormData();

      formData.append(
        "folder",
        JSON.stringify({
          name: targetFolderName,
          files: folderForm.files.map((f) => ({
            filename: f.filename,
            size: f.size,
            fileType: f.fileType,
            path: f.path,
            uploadedAt: f.uploadedAt,
            uploadedBy: f.uploadedBy,
          })),
        })
      );

      folderForm.files.forEach((f) => {
        if (f.fileObj) {
          formData.append("files", f.fileObj, f.filename);
        }
      });

      await uploadProjectFILES(projectId, formData);
      await fetchProjectFiles(projectId);

      setFile({
        filename: "",
        size: 0,
        path: "",
        fileType: "",
        uploadedAt: Date.now(),
        uploadedBy: localStorage.getItem("userId"),
      });

      setFolderForm({
        name: "",
        files: [],
      });
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Failed to upload folder/files");
    } finally {
      setIsUploading(false);
    }
  };

  const handleImportGithubRepo = async () => {
    if (!selectedRepo) {
      toast.warn("Please select a repository to import");
      return;
    }
    const [owner, name] = selectedRepo.split("/");
    setIsImporting(true);
    try {
      await importGithubRepo(projectId, owner, name, repoBranch || "main");
    } catch (err) {
      console.error(err);
      toast.error("Failed to import repository");
    } finally {
      setIsImporting(false);
    }
  };

  const handleJoinRequest = () => {
    sendProjectJoinRequest(projectId);
  };

  useEffect(() => {
    // debug
    // console.log("thisProjectFiles", thisProjectFiles);
  }, [thisProjectFiles]);

  const [openedFolder, setOpenedFolder] = useState({
    key: 0,
    open: false
  });

  /* -----------------------
     Styles / helpers
  ------------------------*/
  const chips = "px-3 py-1 rounded-full text-sm font-medium";
  const metaItem = (label, value) => (
    <div className="flex flex-col">
      <span className="text-xs text-gray-500">{label}</span>
      <span className="text-sm font-medium text-gray-800">{value || "-"}</span>
    </div>
  );

 

    

  // Roles and Solo Members Calculation
  const allRoles = ["Owner", "Admin", "Tester", "Developer", "Debugger", "Member"];
  
  // 1. Gather all team member IDs from projectStats
  const teamMembersIds = new Set();
  projectStats?.project?.teams?.forEach(t => {
    t.members?.forEach(m => {
      if (m?._id) teamMembersIds.add(m._id.toString());
    });
  });

  // 2. Separate members into team-based and solo
  const soloMembers = members.filter(m => !teamMembersIds.has(m._id?.toString()));
  const teamMembers = members.filter(m => teamMembersIds.has(m._id?.toString()));

  // 3. Compute stats per role
  const roleStats = allRoles.map(role => {
    const totalCount = members.filter(m => m.role === role).length;
    const teamCount = teamMembers.filter(m => m.role === role).length;
    const soloCount = soloMembers.filter(m => m.role === role).length;
    return { role, totalCount, teamCount, soloCount };
  }).filter(stat => stat.totalCount > 0);

  const treeData = buildFileTree(thisProjectFiles, projectInfo?.name || "root");

  return (
    <div className="min-h-screen p-6 bg-primary text-primary">

      {/* HERO / HEADER */}
      {hasAuthToSeeProject !== null && hasAuthToSeeProject ? (
        <div className="space-y-6">

          <div className="bg-card border border-default rounded-2xl shadow-xl p-6 flex flex-col lg:flex-row lg:items-center gap-6">
            <div className="flex-1">
              <h1 className="text-3xl font-extrabold text-primary">{projectInfo?.name}</h1>
              <p className="text-sm text-muted mt-1">{projectInfo?.description}</p>

              <div className="mt-4 flex flex-wrap gap-3 items-center">
                <div className="inline-flex items-center gap-2 bg-secondary/40 border border-default px-3 py-1 rounded-full text-xs text-secondary">
                  <Pin className="w-3.5 h-3.5 text-neon" /> <span className="font-mono">{projectInfo?._id?.slice(0,12)}…</span>
                </div>

                <div className="inline-flex items-center gap-2 bg-secondary/40 border border-default px-3 py-1 rounded-full text-xs text-secondary">
                  <Clock className="w-3.5 h-3.5 text-neon" />
                  Started: <span className="font-semibold text-primary ml-1">{projectInfo?.startedOn ? new Date(projectInfo.startedOn).toLocaleDateString() : "N/A"}</span>
                </div>

                <div className="inline-flex items-center gap-2 bg-secondary/40 border border-default px-3 py-1 rounded-full text-xs text-secondary">
                  <Clock className="w-3.5 h-3.5 text-neon" /> Deadline: <span className="font-semibold text-primary ml-1">{projectInfo?.deadline ? new Date(projectInfo.deadline).toLocaleDateString() : "N/A"}</span>
                </div>

                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                  projectInfo?.archived
                    ? "bg-red-500/10 text-red-400 border-red-500/20"
                    : "bg-green-500/10 text-green-400 border-green-500/20"
                }`}>
                  {projectInfo?.archived ? "Archived" : "Active"}
                </span>
              </div>
            </div>

            <div className="flex-shrink-0 flex items-center gap-3">
              <button
                onClick={() => { deleteProject(projectId); }}
                className="flex items-center gap-2 bg-red-500/10 text-red-400 border border-red-500/20 px-3 py-2 rounded-xl hover:bg-red-500/20 transition text-sm font-semibold cursor-pointer"
              >
                <Trash className="w-4 h-4" /> Delete
              </button>

              <Link to={"edit"} className="inline-flex items-center gap-2 px-4 py-2 btn-gradient text-white rounded-xl font-semibold text-sm shadow-md hover:opacity-90 transition">
                <Edit className="w-4 h-4" /> Edit
              </Link>
            </div>
          </div>

          {/* OWNER + STATS */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Owner */}
            <div className="bg-card border border-default rounded-2xl shadow-xl p-5">
              <h3 className="text-sm font-bold text-secondary uppercase tracking-wider mb-4">Project Owner</h3>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-purple-500/10 flex items-center justify-center text-[var(--text-neon)] font-extrabold text-xl border border-default shadow-inner">
                  {owner?.firstName?.[0] || "U"}
                </div>
                <div>
                  <div className="text-sm font-bold text-primary">{owner?.firstName} {owner?.lastName}</div>
                  <div className="text-xs text-muted">@{owner?.username}</div>
                  <div className="text-xs text-muted mt-0.5">{owner?.email}</div>
                </div>
              </div>
            </div>

            {/* PROJECT STATS */}
            <div className="bg-card border border-default rounded-2xl shadow-xl p-5 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-secondary uppercase tracking-wider mb-4 font-bold">Project Stats</h3>
                <div className="grid grid-cols-2 gap-3 text-center mb-4">
                  <div className="p-3 bg-secondary/35 border border-default rounded-xl">
                    <div className="text-[10px] text-muted font-bold">Members</div>
                    <div className="text-2xl font-extrabold text-primary">{members?.length || 0}</div>
                  </div>
                  <div className="p-3 bg-secondary/35 border border-default rounded-xl">
                    <div className="text-[10px] text-muted font-bold font-bold">Teams</div>
                    <div className="text-2xl font-extrabold text-primary">{projectInfo?.teams?.length || 0}</div>
                  </div>
                  <div className="p-3 bg-secondary/35 border border-default rounded-xl">
                    <div className="text-[10px] text-muted font-bold">Tickets</div>
                    <div className="text-2xl font-extrabold text-primary">{thisProjectTickets?.totalTickets || 0}</div>
                  </div>
                  <div className="p-3 bg-secondary/35 border border-default rounded-xl">
                    <div className="text-[10px] text-muted font-bold">Files</div>
                    <div className="text-2xl font-extrabold text-primary">
                      {thisProjectFiles?.reduce((acc, folder) => acc + (folder.files?.length || 0), 0)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Roles Breakdown */}
              <div className="space-y-2 border-t border-default/50 pt-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-[10px] font-bold text-secondary uppercase tracking-wider font-bold">Roles Breakdown</h4>
                  <span className="text-[9px] text-muted font-bold uppercase">Total / Team / Solo</span>
                </div>
                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1 noScroll">
                  {roleStats.map(({ role, totalCount, teamCount, soloCount }) => (
                    <div key={role} className="flex items-center justify-between text-xs py-1 border-b border-default/5 hover:bg-hover/10 px-1 rounded transition">
                      <span className="font-semibold text-primary">{role}s</span>
                      <div className="flex items-center gap-2">
                        <span className="px-1.5 py-0.5 rounded bg-secondary text-primary font-extrabold text-[10px]">{totalCount}</span>
                        <span className="text-[10px] text-muted">{teamCount}t</span>
                        <span className="text-[10px] text-neon font-semibold">{soloCount}s 👤</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-card border border-default rounded-2xl shadow-xl p-5">
              <h3 className="text-sm font-bold text-secondary uppercase tracking-wider mb-4">Quick Actions</h3>
              <div className="flex flex-col gap-3">
                <button className="text-left px-3 py-2.5 btn-gradient text-white rounded-xl flex items-center gap-2 text-sm font-semibold shadow-md hover:opacity-90 transition cursor-pointer" onClick={() => window.scrollTo({ top: 9999, behavior: "smooth" })}>
                  <Ticket className="h-4 w-4" /> Create Ticket
                </button>
                <button className="text-left px-3 py-2.5 bg-secondary hover:bg-hover border border-default text-primary rounded-xl flex items-center gap-2 text-sm font-semibold transition cursor-pointer" onClick={() => document.getElementById("upload-folder-input")?.scrollIntoView({ behavior: "smooth" })}>
                  <Folder className="h-4 w-4 text-neon" /> Upload Files
                </button>
                <button className="text-left px-3 py-2.5 bg-secondary hover:bg-hover border border-default text-primary rounded-xl flex items-center gap-2 text-sm font-semibold transition cursor-pointer" onClick={() => document.getElementById("add-members-section")?.scrollIntoView({ behavior: "smooth" })}>
                  <User className="h-4 w-4 text-neon" /> Add Members
                </button>
              </div>
            </div>
          </div>

          {/* MEMBERS */}
          <section className="bg-card border border-default rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-primary">Members <span className="text-[var(--text-neon)]">({members.length})</span></h2>
              <button
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-secondary hover:bg-hover border border-default text-primary rounded-xl text-xs font-semibold transition cursor-pointer"
                onClick={() => document.getElementById("add-members-section")?.scrollIntoView({ behavior: "smooth" })}
              >
                <PersonStanding className="h-3.5 w-3.5" /> Manage
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {members.map((member) => (
                <div key={member._id} className="p-4 rounded-xl border border-default bg-secondary/35 flex items-center gap-3 shadow-inner">
                  <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center text-[var(--text-neon)] font-extrabold shrink-0">
                    {`${member.firstName?.[0] || ""}${member.lastName?.[0] || ""}`.toUpperCase() || member.username?.[0]?.toUpperCase() || "U"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-primary text-sm truncate">{member.firstName} {member.lastName}</div>
                    <div className="text-xs text-muted truncate">@{member.username}</div>
                    <span className="inline-block mt-1 px-2 py-0.5 bg-card border border-default rounded-full text-[10px] font-semibold text-secondary">{member.role}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* TICKETS */}
          <section className="bg-card border border-default rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-primary">Tickets <span className="text-[var(--text-neon)]">({thisProjectTickets?.totalTickets || 0})</span></h2>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted">Page {thisProjectTickets?.currentPage || ticketPage} / {thisProjectTickets?.totalPages || 1}</span>
                <button
                  className="p-1.5 rounded-lg bg-secondary hover:bg-hover border border-default text-primary transition cursor-pointer"
                  onClick={() => { if (ticketPage > 1) setTicketPage(ticketPage - 1); else toast.warn("Already on first page"); }}
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  className="p-1.5 rounded-lg bg-secondary hover:bg-hover border border-default text-primary transition cursor-pointer"
                  onClick={() => { if (ticketPage < (thisProjectTickets?.totalPages || 1)) setTicketPage(ticketPage + 1); else toast.warn("Already on last page"); }}
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {thisProjectTickets?.tickets && thisProjectTickets.tickets.length > 0 ? (
                thisProjectTickets.tickets.map((t) => (
                  <article key={t?._id} className="border border-default rounded-2xl p-4 bg-secondary/30 shadow-inner hover:shadow-xl hover:border-[var(--border-neon)]/30 transition-all flex flex-col gap-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-bold text-primary flex items-center gap-2 truncate">
                          <Flag className="w-3.5 h-3.5 text-neon shrink-0" /> {t?.title}
                        </h3>
                        <div className="text-[10px] text-muted mt-1 font-mono">#{t?._id?.slice(0, 8)} • {new Date(t?.assignedOn).toLocaleDateString()}</div>
                      </div>

                      <div className="flex flex-col items-end gap-1.5 ml-2 shrink-0">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          t.priority === "Critical" ? "bg-red-500/10 text-red-400 border-red-500/20" :
                          t.priority === "High" ? "bg-orange-500/10 text-orange-400 border-orange-500/20" :
                          t.priority === "Medium" ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" :
                          "bg-green-500/10 text-green-400 border-green-500/20"
                        }`}>{t.priority}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          t.status === "Open" ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                          t.status === "In Progress" ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" :
                          t.status === "Closed" ? "bg-green-500/10 text-green-400 border-green-500/20" :
                          "bg-secondary/40 text-secondary border-default"
                        }`}>{t.status}</span>
                      </div>
                    </div>

                    <p className="text-xs text-muted line-clamp-2">{t?.description}</p>

                    <div className="flex items-center justify-end gap-2 mt-auto">
                      <button onClick={() => handleViewDetails(t._id)} className="px-3 py-1.5 btn-gradient text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 hover:opacity-90 transition cursor-pointer shadow-md">
                        <Eye className="w-3.5 h-3.5" /> View
                      </button>
                      <button onClick={() => handleDeleteTicket(t._id)} className="px-3 py-1.5 bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer">
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    </div>
                  </article>
                ))
              ) : (
                <p className="text-xs text-muted py-4">No tickets have been created for this project yet.</p>
              )}
            </div>
          </section>

          {/* ACTIVITY LOG */}
          <section className="bg-card border border-default rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-bold text-primary mb-5">Activity Log <span className="text-[var(--text-neon)]">({activities.length})</span></h2>
            <div className="space-y-3 max-h-80 overflow-y-auto noScroll">
              {activities.map((a, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-secondary/30 border border-default/50 rounded-xl hover:bg-hover/20 transition">
                  <div className="w-2 h-2 bg-[var(--text-neon)] rounded-full mt-2 shrink-0" />
                  <div>
                    <div className="text-xs font-semibold text-primary"><span className="text-[var(--text-neon)]">{a?.performedBy?.username}</span> — {a.actionType || "action"}</div>
                    <div className="text-[10px] text-muted mt-0.5">On ticket: <span className="font-semibold text-secondary">{a?.job?.title}</span> • {a?.detail}</div>
                    <div className="text-[10px] text-muted mt-0.5">Project: {a?.project?.name}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* FILES */}
          <section className="bg-card border border-default rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-primary">Project Files</h2>
              <Link to={`/auth/${hash}/${username}/workspace/projects/${projectId}/code-editor/view-project`} className="text-xs font-semibold btn-gradient text-white px-4 py-2 rounded-xl shadow-md hover:opacity-90 transition">Open in Code Editor</Link>
            </div>

            {treeData ? (
              <div className="border border-default rounded-xl p-4 bg-secondary/15 flex flex-col gap-1 max-h-[500px] overflow-y-auto noScroll">
                <TreeNode node={treeData} depth={0} />
              </div>
            ) : (
              <div className="text-xs text-muted py-4">No files uploaded for this project yet</div>
            )}

            {/* Upload folder area */}
            <div id="upload-folder-input" className="mt-6 border border-default rounded-xl p-5 bg-secondary/30 space-y-4">
              <h3 className="text-sm font-bold text-primary">Upload Project Files</h3>
              
              <div className="flex bg-secondary p-1 rounded-lg border border-default/60 max-w-xs mb-3">
                <button
                  type="button"
                  onClick={() => {
                    setUploadMode("files");
                    setFolderForm(prev => ({ ...prev, files: [] }));
                  }}
                  className={`flex-1 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                    uploadMode === "files" ? "bg-card text-primary shadow-sm" : "text-secondary hover:text-primary"
                  }`}
                >
                  Upload Files
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setUploadMode("directory");
                    setFolderForm(prev => ({ ...prev, files: [] }));
                  }}
                  className={`flex-1 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                    uploadMode === "directory" ? "bg-card text-primary shadow-sm" : "text-secondary hover:text-primary"
                  }`}
                >
                  Upload Directory
                </button>
              </div>

              <div className="flex items-center gap-3">
                <input
                  id="new-folder-name"
                  value={folderForm.name}
                  onChange={(e) => setFolderForm((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder={uploadMode === "directory" ? "Folder name (auto-filled on directory select)..." : "Folder name (defaults to project root)..."}
                  className="flex-1 outline-none focus:ring-2 focus:ring-[var(--border-neon)]/45 transition rounded-xl px-3 py-2 bg-secondary border border-default text-primary text-xs"
                />
                {uploadMode === "files" && (
                  <select
                    value={folderForm.name}
                    onChange={(e) => setFolderForm((prev) => ({ ...prev, name: e.target.value }))}
                    className="px-3 py-2 bg-secondary border border-default text-primary rounded-xl text-xs outline-none cursor-pointer"
                  >
                    <option value="">Existing folder…</option>
                    {thisProjectFiles?.map((f, idx) => <option key={idx} value={f.name}>{f.name}</option>)}
                  </select>
                )}
              </div>

              <input
                type="file"
                multiple
                webkitdirectory={uploadMode === "directory" ? "" : undefined}
                directory={uploadMode === "directory" ? "" : undefined}
                onChange={(e) => {
                  const selectedFiles = Array.from(e.target.files);
                  let detectedFolderName = "";
                  const mappedFiles = selectedFiles.map((f) => {
                    let filename = f.name;
                    if (f.webkitRelativePath) {
                      const parts = f.webkitRelativePath.split("/");
                      if (parts.length > 1) {
                        detectedFolderName = parts[0];
                        filename = parts.slice(1).join("/");
                      }
                    }
                    return {
                      filename,
                      size: f.size,
                      fileType: f.type,
                      uploadedAt: new Date().toISOString(),
                      uploadedBy: localStorage.getItem("userId"),
                      fileObj: f
                    };
                  });
                  setFolderForm((prev) => ({
                    ...prev,
                    name: prev.name || detectedFolderName || "",
                    files: [...(prev.files || []), ...mappedFiles]
                  }));
                  e.target.value = null;
                }}
                className="w-full text-xs text-muted"
              />

              {folderForm.files.length > 0 && (
                <div className="grid grid-cols-2 gap-3">
                  {folderForm.files.map((fileItem, idx) => {
                    const isImage = fileItem.fileType?.startsWith("image/") || fileItem.filename?.match(/\.(png|jpe?g|gif|webp)$/i);
                    const previewUrl = isImage && fileItem.fileObj ? URL.createObjectURL(fileItem.fileObj) : null;
                    return (
                      <div key={idx} className="p-3 border border-default rounded-xl bg-card flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-secondary/40 flex items-center justify-center shrink-0">
                          {isImage && previewUrl ? <img src={previewUrl} alt={fileItem.filename} className="w-full h-full object-cover rounded-lg" /> : <FileCode className="text-secondary h-5 w-5" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-xs text-primary truncate">{fileItem.filename}</div>
                          <div className="text-[10px] text-muted">{(fileItem.size / 1024).toFixed(2)} KB</div>
                        </div>
                        <button
                          onClick={() => setFolderForm((prev) => ({ ...prev, files: prev.files.filter((_, i) => i !== idx) }))}
                          className="text-red-400 text-xs font-semibold hover:text-red-300 cursor-pointer"
                        >
                          <Trash className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              <button
                onClick={uploadProjectFolder}
                disabled={isUploading || folderForm.files.length === 0}
                className="px-6 py-2 btn-gradient text-white rounded-xl text-sm font-bold shadow-md hover:opacity-90 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isUploading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Uploading...
                  </>
                ) : (
                  "Upload"
                )}
              </button>
            </div>

            {/* GitHub Import Area */}
            <div className="mt-6 border border-default rounded-xl p-5 bg-secondary/30 space-y-4">
              <h3 className="text-sm font-bold text-primary flex items-center gap-2">
                <Github className="h-4 w-4 text-neon" /> Connect & Import from GitHub
              </h3>
              
              {authUserData && authUserData.githubAccessToken === null ? (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border border-dashed border-default rounded-xl bg-secondary/10">
                  <div className="text-xs text-muted">
                    Connect your GitHub account to import repositories directly.
                  </div>
                  <LinkGithubButton />
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="text-xs text-emerald-500 font-semibold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    Linked GitHub: <span className="underline font-bold">@{authUserData?.githubUsername}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <select
                      value={selectedRepo}
                      onChange={(e) => {
                        const repo = githubRepo?.find(r => r.full_name === e.target.value);
                        setSelectedRepo(e.target.value);
                        if (repo) {
                          setRepoBranch(repo.default_branch || "main");
                        }
                      }}
                      className="flex-1 px-3 py-2 bg-secondary border border-default text-primary rounded-xl text-xs outline-none cursor-pointer"
                    >
                      <option value="">Select a repository...</option>
                      {githubRepo?.map((repo) => (
                        <option key={repo.id} value={repo.full_name}>
                          {repo.full_name}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      value={repoBranch}
                      onChange={(e) => setRepoBranch(e.target.value)}
                      placeholder="Branch (e.g. main)"
                      className="w-full sm:w-36 outline-none focus:ring-2 focus:ring-[var(--border-neon)]/45 transition rounded-xl px-3 py-2 bg-secondary border border-default text-primary text-xs"
                    />
                  </div>
                  
                  <button
                    onClick={handleImportGithubRepo}
                    disabled={isImporting || !selectedRepo}
                    className="px-6 py-2 btn-gradient text-white rounded-xl text-sm font-bold shadow-md hover:opacity-90 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isImporting ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        Importing...
                      </>
                    ) : (
                      "Import Repository"
                    )}
                  </button>
                </div>
              )}
            </div>
          </section>

          {/* CREATE TICKET FORM */}
          <section className="bg-card border border-default rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-bold text-primary mb-5">Create a Ticket</h2>

            <form className="grid grid-cols-1 lg:grid-cols-2 gap-6" onSubmit={handleTicketCreation}>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-secondary mb-1.5">Title</label>
                  <input
                    value={ticketForm.title}
                    onChange={(e) => setTicketForm((prev) => ({ ...prev, title: e.target.value }))}
                    className="w-full outline-none focus:ring-2 focus:ring-[var(--border-neon)]/40 transition rounded-xl px-3 py-2.5 bg-secondary border border-default text-primary text-sm"
                    placeholder="Short summary of the issue"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-secondary mb-1.5">Description</label>
                  <textarea
                    value={ticketForm.description}
                    onChange={(e) => setTicketForm((prev) => ({ ...prev, description: e.target.value }))}
                    className="w-full outline-none focus:ring-2 focus:ring-[var(--border-neon)]/40 transition rounded-xl px-3 py-2.5 bg-secondary border border-default text-primary text-sm resize-none noScroll"
                    rows={5}
                    placeholder="Detailed description"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-secondary mb-1.5">Assign to</label>
                  <select
                    value={ticketForm.assignedTo}
                    onChange={(e) => setTicketForm((prev) => ({ ...prev, assignedTo: e.target.value }))}
                    className="w-full outline-none focus:ring-2 focus:ring-[var(--border-neon)]/40 transition rounded-xl px-3 py-2.5 bg-secondary border border-default text-primary text-sm cursor-pointer"
                  >
                    <option value="">-- Select Member --</option>
                    {members?.map((m, i) => <option key={i} value={m._id}>{m.username} — {m.role}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-secondary mb-1.5">Created By</label>
                  <input
                    value={ticketForm.createdBy}
                    readOnly
                    className="w-full rounded-xl px-3 py-2.5 bg-secondary/40 border border-default text-muted text-xs font-mono"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-secondary mb-1.5">Priority</label>
                  <select
                    value={ticketForm.priority}
                    onChange={(e) => setTicketForm((prev) => ({ ...prev, priority: e.target.value }))}
                    className="w-full outline-none focus:ring-2 focus:ring-[var(--border-neon)]/40 transition rounded-xl px-3 py-2.5 bg-secondary border border-default text-primary text-sm cursor-pointer"
                  >
                    <option value="">-- Select Priority --</option>
                    {["Low", "Medium", "High", "Critical"].map((m, i) => <option key={i} value={m}>{m}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-secondary mb-1.5">Steps to Reproduce</label>
                  <textarea
                    value={ticketForm.stepsToReproduceInput || ""}
                    onChange={(e) => setTicketForm((prev) => ({ ...prev, stepsToReproduceInput: e.target.value }))}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        if (ticketForm.stepsToReproduceInput?.trim()) {
                          setTicketForm((prev) => ({
                            ...prev,
                            stepsToReproduce: [...(prev.stepsToReproduce || []), prev.stepsToReproduceInput.trim()],
                            stepsToReproduceInput: ""
                          }));
                        }
                      }
                    }}
                    className="w-full outline-none focus:ring-2 focus:ring-[var(--border-neon)]/40 transition rounded-xl px-3 py-2.5 bg-secondary border border-default text-primary text-sm resize-none noScroll"
                    rows={4}
                    placeholder="Press Enter to add each step…"
                  />
                  <div className="mt-2 space-y-1.5">
                    {ticketForm.stepsToReproduce?.map((step, i) => (
                      <div key={i} className="flex items-center justify-between bg-secondary/40 border border-default px-3 py-1.5 rounded-lg">
                        <div className="text-xs text-primary">{step}</div>
                        <button
                          type="button"
                          onClick={() => setTicketForm((prev) => ({ ...prev, stepsToReproduce: prev.stepsToReproduce.filter((_, idx) => idx !== i) }))}
                          className="text-red-400 hover:text-red-300 cursor-pointer"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-secondary mb-1.5">Attachments</label>
                  <input
                    type="file"
                    multiple
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      if (files.length > 0) setTicketForm((prev) => ({ ...prev, attachments: [...(prev.attachments || []), ...files] }));
                    }}
                    className="w-full text-xs text-muted"
                  />
                  <div className="flex flex-wrap gap-2 mt-2">
                    {ticketForm.attachments?.map((file, i) => (
                      <div key={i} className="flex items-center gap-2 px-2.5 py-1.5 bg-secondary/40 border border-default rounded-lg">
                        <span className="text-xs font-semibold text-primary">{file.name}</span>
                        <button
                          type="button"
                          onClick={() => setTicketForm((prev) => ({ ...prev, attachments: prev.attachments.filter((_, idx) => idx !== i) }))}
                          className="text-red-400 cursor-pointer"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="col-span-full flex justify-end mt-2">
                <button
                  type="submit"
                  onClick={handleTicketCreation}
                  className="px-8 py-2.5 btn-gradient text-white rounded-xl shadow-lg font-bold text-sm cursor-pointer hover:opacity-90 transition-all flex items-center gap-2"
                >
                  <Ticket className="h-4 w-4" /> Create Ticket
                </button>
              </div>
            </form>
          </section>

          {/* ADD MEMBERS / TEAMS */}
          <section id="add-members-section" className="bg-card border border-default rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-bold text-primary mb-5">Add Members &amp; Teams</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-secondary">Search Members</h3>
                <SearchUser selectedUserIds={selectedUserIds} setSelectedUserIds={setSelectedUserIds} initialSelected={project?.members || []} />
                <button
                  onClick={addUser}
                  className="px-6 py-2 btn-gradient text-white rounded-xl shadow-md font-bold text-sm hover:opacity-90 transition cursor-pointer flex items-center gap-2"
                >
                  <User className="h-4 w-4" /> Add Member(s)
                </button>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-bold text-secondary">Search Teams</h3>
                <SearchTeam selectedTeamIds={selectedTeamIds} setSelectedTeamIds={setSelectedTeamIds} initialSelected={project?.teams || []} />
                <button
                  onClick={addGroup}
                  className="px-6 py-2 btn-gradient text-white rounded-xl shadow-md font-bold text-sm hover:opacity-90 transition cursor-pointer flex items-center gap-2"
                >
                  <WavesLadder className="h-4 w-4" /> Add Team(s)
                </button>
              </div>
            </div>
          </section>

          {/* PENDING REQUESTS */}
          <section className="bg-card border border-default rounded-2xl shadow-xl p-6">
            <h3 className="text-xl font-bold text-primary mb-4">Pending Join Requests <span className="text-[var(--text-neon)]">({pendingProjectReqLists?.length || 0})</span></h3>
            {pendingProjectReqLists && pendingProjectReqLists.length ? (
              <ul className="space-y-2">
                {pendingProjectReqLists.map((r) => (
                  <li key={r._id} className="flex items-center justify-between p-3 bg-secondary/35 border border-default rounded-xl">
                    <div>
                      <div className="text-sm font-bold text-primary">{r.username}</div>
                      <div className="text-xs text-muted">{r.email}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => patchProjectJoinRequest(projectId, "accept")}
                        className="px-3 py-1.5 rounded-xl bg-green-500/10 text-green-400 border border-green-500/20 text-xs font-bold hover:bg-green-500/20 transition cursor-pointer"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => patchProjectJoinRequest(projectId, "reject")}
                        className="px-3 py-1.5 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-bold hover:bg-red-500/20 transition cursor-pointer"
                      >
                        Reject
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-xs text-muted py-4">No pending join requests for this project</div>
            )}
          </section>

        </div>
      ) : (
        <RestrictedProjectCard project={projectInfo} onRequestJoin={handleJoinRequest} status={reqStatus} projectId={projectId} />
      )}
    </div>
  );
};

/* small fallback icon for calendar to avoid adding new import mismatch */
function CalendarIconFallback() {
  return <svg className="w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="none"><path d="M7 11h2v2H7zM11 11h2v2h-2zM15 11h2v2h-2zM7 15h2v2H7zM11 15h2v2h-2zM15 15h2v2h-2z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>;}



export default ProjectDetail;
