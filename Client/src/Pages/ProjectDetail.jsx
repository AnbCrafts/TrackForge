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
  ChevronRight
} from "lucide-react";
import SearchUser from "../Components/SearchUser";
import SearchTeam from "../Components/SearchTeams";
import { toast } from "react-toastify";
import RestrictedProjectCard from "../Components/RestrictedProjectCard";

const ProjectDetail = () => {
  const navigate = useNavigate();
  const {
    project,
    projectById,
    getProjectStats,
    addMember,
    addTeam,
    getProjectComments,
    createTicket,
    deleteProject,
    getThisProjectTickets, thisProjectTickets,
    uploadProjectFILES, uploadedFolders,
    fetchProjectFiles, thisProjectFiles,
    patchProjectJoinRequest, sendProjectJoinRequest, checkAuthorityToViewProject, hasAuthToSeeProject, reqStatus, getPendingProjectRequests, pendingProjectReqLists
  } = useContext(TrackForgeContextAPI);

  const { projectId, username, hash } = useParams();

  const [ticketForm, setTicketForm] = useState({
    title: "",
    description: "",
    assignedTo: "",
    projectId: projectId || "",
    createdBy: "",
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
      setTicketForm({
        title: "",
        description: "",
        assignedTo: "",
        projectId: projectId || "",
        createdBy: username || "",
        priority: "",
        stepsToReproduce: [],
        attachments: [],
      });
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

    const formData = new FormData();

    formData.append(
      "folder",
      JSON.stringify({
        name: folderForm.name,
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
        formData.append("files", f.fileObj);
      }
    });

    await uploadProjectFILES(projectId, formData);

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

 

    

  return (
    <div className="min-h-screen p-6 bg-gray-50 text-gray-900">

      {/* HERO / HEADER */}
      {hasAuthToSeeProject !== null && hasAuthToSeeProject ? (
        <div className="space-y-6">

          <div className="bg-white rounded-lg shadow-sm p-6 flex flex-col lg:flex-row lg:items-center gap-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-800">{projectInfo?.name}</h1>
              <p className="text-sm text-gray-500 mt-1">{projectInfo?.description}</p>

              <div className="mt-4 flex flex-wrap gap-4 items-center">
                <div className="inline-flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-sm">
                  <Pin className="w-4 h-4 text-gray-500" /> ID: <span className="font-medium ml-1">{projectInfo?._id}</span>
                </div>

                <div className="inline-flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-sm">
                  <CalendarIconFallback />
                  Started: <span className="font-medium ml-1">{projectInfo?.startedOn ? new Date(projectInfo.startedOn).toLocaleDateString() : "N/A"}</span>
                </div>

                <div className="inline-flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-sm">
                  <Clock className="w-4 h-4 text-gray-500" /> Deadline: <span className="font-medium ml-1">{projectInfo?.deadline ? new Date(projectInfo.deadline).toLocaleDateString() : "N/A"}</span>
                </div>

                <div className="inline-flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-sm">
                  <span className={`${projectInfo?.archived ? "bg-red-100 text-red-700 px-2 py-0.5 rounded" : "bg-green-100 text-green-700 px-2 py-0.5 rounded"}`}>{projectInfo?.archived ? "Archived" : "Active"}</span>
                </div>
              </div>
            </div>

            <div className="flex-shrink-0 flex items-center gap-3">
              <button
                onClick={() => {
                  deleteProject(projectId);
                }}
                className="flex items-center gap-2 bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 transition"
              >
                <Trash className="w-4 h-4" /> Delete
              </button>

              <Link to={"edit"} className="inline-flex items-center gap-2 px-3 py-2 bg-gray-900 text-white rounded hover:bg-gray-800">
                <Edit className="w-4 h-4" /> Edit
              </Link>
            </div>
          </div>

          {/* OWNER + STATS */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow p-5">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Owner</h3>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 font-semibold">
                  {owner?.firstName?.[0] || "U"}
                </div>
                <div>
                  <div className="text-md font-semibold">{owner?.firstName} {owner?.lastName}</div>
                  <div className="text-sm text-gray-500">@{owner?.username}</div>
                  <div className="text-sm text-gray-500 mt-1">{owner?.email}</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-5">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Project Stats</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-sm text-gray-500">Tickets</div>
                  <div className="text-xl font-semibold">{thisProjectTickets?.totalTickets || 0}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-500">Members</div>
                  <div className="text-xl font-semibold">{members?.length || 0}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-500">Files</div>
                  <div className="text-xl font-semibold">{thisProjectFiles?.length || 0}</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-5">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Quick Actions</h3>
              <div className="flex flex-col gap-3">
                <button className="text-left px-3 py-2 bg-green-600 text-white rounded flex items-center gap-2 hover:bg-green-700 transition" onClick={() => window.scrollTo({ top: 9999, behavior: "smooth" })}>
                  <Ticket /> Create Ticket
                </button>
                <button className="text-left px-3 py-2 bg-gray-100 rounded flex items-center gap-2 hover:bg-gray-200 transition" onClick={() => document.getElementById("upload-folder-input")?.scrollIntoView({ behavior: "smooth" })}>
                  <Folder /> Upload Files
                </button>
                <button className="text-left px-3 py-2 bg-gray-100 rounded flex items-center gap-2 hover:bg-gray-200 transition" onClick={() => document.getElementById("add-members-section")?.scrollIntoView({ behavior: "smooth" })}>
                  <User /> Add Members
                </button>
              </div>
            </div>
          </div>

          {/* MEMBERS */}
          <section className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-2xl font-semibold">Members ({members.length})</h2>
              <div>
                <button className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 rounded hover:bg-gray-200" onClick={() => document.getElementById("add-members-section")?.scrollIntoView({ behavior: "smooth" })}>
                  <PersonStanding /> Manage
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {members.map((member) => (
                <div key={member._id} className="p-4 rounded border border-gray-100 bg-gray-50 flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 font-semibold">
                    {member.firstName?.[0] || member.username?.[0] || "U"}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-gray-800">{member.firstName} {member.lastName}</div>
                        <div className="text-sm text-gray-500">@{member.username}</div>
                      </div>
                      <div className="text-sm">{member.role}</div>
                    </div>
                    <div className="text-xs text-gray-500 mt-2">{member.email}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* TICKETS (Grid of issue-cards) */}
          <section className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold">Tickets ({thisProjectTickets?.totalTickets || 0})</h2>
              <div className="flex items-center gap-3">
                <div className="text-sm text-gray-500">Page {thisProjectTickets?.currentPage || ticketPage} / {thisProjectTickets?.totalPages || 1}</div>
                <button className="p-2 rounded bg-gray-100 hover:bg-gray-200" onClick={() => {
                  if (ticketPage > 1) setTicketPage(ticketPage - 1);
                  else toast.warn("Already on first page");
                }}>
                  <ChevronLeft />
                </button>
                <button className="p-2 rounded bg-gray-100 hover:bg-gray-200" onClick={() => {
                  if (ticketPage < (thisProjectTickets?.totalPages || 1)) setTicketPage(ticketPage + 1);
                  else toast.warn("Already on last page");
                }}>
                  <ChevronRight />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {thisProjectTickets?.tickets && thisProjectTickets.tickets.length > 0 ? (
                thisProjectTickets.tickets.map((t) => (
                  <article key={t?._id} className="border rounded-lg p-4 bg-gray-50 shadow-sm hover:shadow-md transition flex flex-col">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                          <Flag className="w-4 h-4 text-blue-500" /> {t?.title}
                        </h3>
                        <div className="text-xs text-gray-500 mt-1">#{t?._id?.slice(0, 8)} • {new Date(t?.assignedOn).toLocaleDateString()}</div>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${t.priority === "High" ? "bg-red-100 text-red-700" : t.priority === "Medium" ? "bg-yellow-100 text-yellow-700" : t.priority === "Critical" ? "bg-red-200 text-red-800" : "bg-green-100 text-green-700"}`}>
                          {t.priority}
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs ${t.status === "Open" ? "bg-blue-100 text-blue-700" : t.status === "In Progress" ? "bg-yellow-100 text-yellow-700" : t.status === "Closed" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>
                          {t.status}
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-gray-700 mb-3 truncate">{t?.description}</p>

                    <div className="mt-auto flex items-center justify-end gap-3">
                      <button onClick={() => handleViewDetails(t._id)} className="px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition flex items-center gap-2">
                        <Eye className="w-4 h-4" /> View
                      </button>
                      <button onClick={() => handleDeleteTicket(t._id)} className="px-3 py-1.5 bg-red-600 text-white rounded hover:bg-red-700 transition flex items-center gap-2">
                        <Trash2 className="w-4 h-4" /> Delete
                      </button>
                    </div>
                  </article>
                ))
              ) : (
                <p className="text-gray-500">No tickets have been created for this project yet.</p>
              )}
            </div>
          </section>

          {/* ACTIVITY LOG */}
          <section className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold mb-4">Activity Log ({activities.length})</h2>
            <div className="space-y-4">
              {activities.map((a, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="w-2.5 h-2.5 bg-blue-600 rounded-full mt-2" />
                  <div>
                    <div className="text-sm text-gray-800"><strong>{a?.performedBy?.username}</strong> — {a.actionType || "action"}</div>
                    <div className="text-xs text-gray-500 mt-1">On ticket: <strong>{a?.job?.title}</strong> • {a?.detail}</div>
                    <div className="text-xs text-gray-400 mt-1">Project: {a?.project?.name}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* FILES (explorer) */}
          <section className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold">Uploaded files</h2>
              <Link to={`code-editor/view-project`} className="text-sm bg-gray-900 text-white px-4 py-1 rounded">Open in Code Editor</Link>
            </div>

            {thisProjectFiles && thisProjectFiles.length ? (
              <ul className="space-y-4">
                {thisProjectFiles.map((f, i) => (
                  <li key={i} className="border rounded-lg overflow-hidden">
                    <div className="flex items-center justify-between bg-gray-900 text-white px-4 py-2 cursor-pointer" onClick={() => setOpenedFolder({ key: i, open: openedFolder.key === i ? !openedFolder.open : true })}>
                      <div className="flex items-center gap-3">
                        <span className="text-lg">📂</span>
                        <span className="font-medium">{f.name}</span>
                      </div>
                      <div>{openedFolder.key === i && openedFolder.open ? <ChevronDown /> : <ChevronRight />}</div>
                    </div>

                    {openedFolder.key === i && openedFolder.open && (
                      <div className="p-4 bg-white">
                        {f.files && f.files.length > 0 ? (
                          <ul className="space-y-2">
                            {f.files.map((file, idx) => (
                              <li key={idx} className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                  <span className="text-lg">📄</span>
                                  <a href={file.path} target="_blank" rel="noreferrer" className="text-gray-800 hover:underline">{file.filename}</a>
                                  <span className="text-xs text-gray-500">({Math.round(file.size / 1024)} KB)</span>
                                </div>
                                <div className="text-xs text-gray-500">{new Date(file.uploadedAt || Date.now()).toLocaleDateString()}</div>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <div className="text-gray-500">No files in this folder</div>
                        )}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-gray-500">No Files for this project</div>
            )}

            {/* upload folder area */}
            <div id="upload-folder-input" className="mt-6 border rounded-lg p-4 bg-gray-50">
              <h3 className="font-semibold mb-3">Upload Project files</h3>
              <div className="flex items-center gap-4">
                <input id="new-folder-name" value={folderForm.name} onChange={(e) => setFolderForm((prev) => ({ ...prev, name: e.target.value }))} placeholder="Folder name or choose existing" className="flex-1 p-2 border rounded" />
                <select value={folderForm.name} onChange={(e) => setFolderForm((prev) => ({ ...prev, name: e.target.value }))} className="p-2 border rounded">
                  <option value="">Select existing folder</option>
                  {thisProjectFiles && thisProjectFiles.length ? thisProjectFiles.map((f, idx) => <option key={idx} value={f.name}>{f.name}</option>) : <option>No folders</option>}
                </select>
              </div>

              <div className="mt-4">
                <input type="file" multiple onChange={(e) => {
                  const selectedFiles = Array.from(e.target.files);
                  const mappedFiles = selectedFiles.map((f) => ({
                    filename: f.name, size: f.size, fileType: f.type, uploadedAt: new Date().toISOString(), uploadedBy: localStorage.getItem("userId"), fileObj: f
                  }));
                  setFolderForm((prev) => ({ ...prev, files: [...(prev.files || []), ...mappedFiles] }));
                  e.target.value = null;
                }} className="w-full" />
              </div>

              {folderForm.files.length > 0 && (
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {folderForm.files.map((fileItem, idx) => {
                    const isImage = fileItem.fileType?.startsWith("image/") || fileItem.filename?.match(/\.(png|jpe?g|gif|webp)$/i);
                    const previewUrl = isImage && fileItem.fileObj ? URL.createObjectURL(fileItem.fileObj) : null;

                    return (
                      <div key={idx} className="p-3 border rounded flex items-center gap-3">
                        <div className="w-14 h-14 rounded bg-gray-100 flex items-center justify-center">
                          {isImage && previewUrl ? <img src={previewUrl} alt={fileItem.filename} className="w-full h-full object-cover rounded" /> : <FileCode className="text-gray-600" />}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-sm">{fileItem.filename}</div>
                          <div className="text-xs text-gray-500">{(fileItem.size / 1024).toFixed(2)} KB</div>
                        </div>
                        <button onClick={() => setFolderForm((prev) => ({ ...prev, files: prev.files.filter((_, i) => i !== idx) }))} className="text-red-500">Remove</button>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="mt-4">
                <button onClick={uploadProjectFolder} className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700">Upload Folder</button>
              </div>
            </div>
          </section>

          {/* CREATE TICKET FORM */}
          <section className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold mb-4">Create a Ticket</h2>

            <form className="grid grid-cols-1 lg:grid-cols-2 gap-6" onSubmit={handleTicketCreation}>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Title</label>
                <input value={ticketForm.title} onChange={(e) => setTicketForm((prev) => ({ ...prev, title: e.target.value }))} className="w-full p-2 border rounded" placeholder="Short summary of the issue" />

                <label className="block text-sm text-gray-600 mt-4 mb-1">Description</label>
                <textarea value={ticketForm.description} onChange={(e) => setTicketForm((prev) => ({ ...prev, description: e.target.value }))} className="w-full p-2 border rounded h-40" placeholder="Detailed description" />

                <label className="block text-sm text-gray-600 mt-4 mb-1">Assign to</label>
                <select value={ticketForm.assignedTo} onChange={(e) => setTicketForm((prev) => ({ ...prev, assignedTo: e.target.value }))} className="w-full p-2 border rounded">
                  <option value="">-- Select Member --</option>
                  {members && members.map((m, i) => <option key={i} value={m._id}>{m.username} - {m.role}</option>)}
                </select>

                <label className="block text-sm text-gray-600 mt-4 mb-1">Created By</label>
                <input value={ticketForm.createdBy} readOnly className="w-full p-2 border rounded bg-gray-100" />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">Priority</label>
                <select value={ticketForm.priority} onChange={(e) => setTicketForm((prev) => ({ ...prev, priority: e.target.value }))} className="w-full p-2 border rounded">
                  <option value="">-- Select Priority --</option>
                  {["Low", "Medium", "High", "Critical"].map((m, i) => <option key={i} value={m}>{m}</option>)}
                </select>

                <label className="block text-sm text-gray-600 mt-4 mb-1">Steps to Reproduce</label>
                <textarea value={ticketForm.stepsToReproduceInput || ""} onChange={(e) => setTicketForm((prev) => ({ ...prev, stepsToReproduceInput: e.target.value }))} onKeyDown={(e) => {
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
                }} className="w-full p-2 border rounded h-28" placeholder="Press Enter to add each step" />

                <div className="mt-3 space-y-2">
                  {ticketForm.stepsToReproduce?.map((step, i) => (
                    <div key={i} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <div className="text-sm">{step}</div>
                      <button type="button" onClick={() => setTicketForm((prev) => ({ ...prev, stepsToReproduce: prev.stepsToReproduce.filter((_, idx) => idx !== i) }))} className="text-red-500">
                        <X />
                      </button>
                    </div>
                  ))}
                </div>

                <label className="block text-sm text-gray-600 mt-4 mb-1">Attachments</label>
                <input type="file" multiple onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  if (files.length > 0) setTicketForm((prev) => ({ ...prev, attachments: [...(prev.attachments || []), ...files] }));
                }} className="w-full" />
                <div className="flex flex-wrap gap-2 mt-3">
                  {ticketForm.attachments?.map((file, i) => (
                    <div key={i} className="p-2 border rounded bg-gray-50">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium">{file.name}</span>
                        <button onClick={() => setTicketForm((prev) => ({ ...prev, attachments: prev.attachments.filter((_, idx) => idx !== i) }))} className="text-red-500 ml-2">
                          <X />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="col-span-full flex justify-end mt-4">
                <button type="submit" onClick={handleTicketCreation} className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700">Create Ticket</button>
              </div>
            </form>
          </section>

          {/* ADD MEMBERS / TEAMS */}
          <section id="add-members-section" className="bg-white rounded-lg shadow p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold mb-3">Add Members</h3>
                <SearchUser selectedUserIds={selectedUserIds} setSelectedUserIds={setSelectedUserIds} />
                <div className="mt-4 flex flex-wrap gap-2">
                  {selectedUserIds.length > 0 ? selectedUserIds.map((u, i) => (
                    <div key={i} className="px-3 py-1 rounded bg-gray-100 flex items-center gap-2">
                      <span>{u}</span>
                      <button onClick={() => setSelectedUserIds((prev) => prev.filter((id) => id !== u))} className="text-red-500"><X /></button>
                    </div>
                  )) : <div className="text-gray-500">No users selected</div>}
                </div>
                <div className="mt-4">
                  <button onClick={addUser} className="px-6 py-2 bg-green-600 text-white rounded">Add User(s)</button>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">Add Teams</h3>
                <SearchTeam selectedTeamIds={selectedTeamIds} setSelectedTeamIds={setSelectedTeamIds} />
                <div className="mt-4 flex flex-wrap gap-2">
                  {selectedTeamIds.length > 0 ? selectedTeamIds.map((t, i) => (
                    <div key={i} className="px-3 py-1 rounded bg-gray-100 flex items-center gap-2">
                      <span>{t}</span>
                      <button onClick={() => setSelectedTeamIds((prev) => prev.filter((id) => id !== t))} className="text-red-500"><X /></button>
                    </div>
                  )) : <div className="text-gray-500">No teams selected</div>}
                </div>
                <div className="mt-4">
                  <button onClick={addGroup} className="px-6 py-2 bg-green-600 text-white rounded">Add Team(s)</button>
                </div>
              </div>
            </div>
          </section>

          {/* PENDING REQUESTS */}
          <section className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-3">Pending Join Requests</h3>
            {pendingProjectReqLists && pendingProjectReqLists.length ? (
              <ul className="space-y-2">
                {pendingProjectReqLists.map((r) => (
                  <li key={r._id} className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <div className="font-medium">{r.username}</div>
                      <div className="text-xs text-gray-500">{r.email}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="px-3 py-1 rounded bg-green-600 text-white">Approve</button>
                      <button className="px-3 py-1 rounded bg-red-100 text-red-600">Reject</button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-gray-500">No pending requests</div>
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
