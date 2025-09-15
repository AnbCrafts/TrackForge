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
  FileCode
} from "lucide-react";
import SearchUser from "../Components/SearchUser";
import SearchTeam from "../Components/SearchTeams";
import { toast } from "react-toastify";
import RestrictedProjectCard from "../Components/RestrictedProjectCard";
// import { getFileIcon } from "../Components/Icons";

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
    getThisProjectTickets,thisProjectTickets,
    uploadProjectFILES,uploadedFolders,
    fetchProjectFiles,thisProjectFiles,
    patchProjectJoinRequest,sendProjectJoinRequest,checkAuthorityToViewProject,hasAuthToSeeProject,reqStatus,getPendingProjectRequests,pendingProjectReqLists
  } = useContext(TrackForgeContextAPI);

  const { projectId, username,hash } = useParams();

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
      // fetchProjectFiles(projectId)
      checkAuthorityToViewProject(projectId)
      getPendingProjectRequests(projectId);
    }
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
    // required fields
    const { title, description, assignedTo, projectId, createdBy, priority } =
      ticketForm;

    if (
      !title.trim() ||
      !description.trim() ||
      !assignedTo.trim() ||
      !projectId.trim() ||
      !createdBy.trim() ||
      !priority.trim()
    ) {
      return false;
    }

    return true;
  };

  const handleTicketCreation = async (e) => {
    e.preventDefault();

    console.log(ticketForm);

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


  const [ticketPage,setTicketPage] = useState(1);

  useEffect(()=>{
    getThisProjectTickets(projectId,ticketPage);
  },[projectId,page])


  
 



  
const handleDeleteTicket = async()=>{

}
const handleViewDetails = async(id)=>{
  navigate(`/auth/${hash}/${username}/workspace/ticket-detail/${id}`)

} 



const [file,setFile] = useState({
        filename:"",
        size: 0,  
        path:"",                     
        fileType: "",                  
        uploadedAt: Date.now(),
        uploadedBy: localStorage.getItem("userId")
      
});

const [folderForm,setFolderForm] = useState({
  name:"",
  files:[
    file
  ]
})


const uploadProjectFolder = async (e) => {
  e.preventDefault();

  const formData = new FormData();

  // ✅ Folder only has name + files (no path)
  formData.append(
    "folder",
    JSON.stringify({
      name: folderForm.name,
      files: folderForm.files.map((f) => ({
        filename: f.filename,
        size: f.size,
        fileType: f.fileType,
        path: f.path, // ✅ path stays at file level only
        uploadedAt: f.uploadedAt,
        uploadedBy: f.uploadedBy,
      })),
    })
  );

  // Attach actual file objects
  folderForm.files.forEach((f) => {
    if (f.fileObj) {
      formData.append("files", f.fileObj);
    }
  });

  // API call
  await uploadProjectFILES(projectId, formData);

  // Reset state
  setFile({
    filename: "",
    size: 0,
    path: "", // ✅ keep path for files
    fileType: "",
    uploadedAt: Date.now(),
    uploadedBy: localStorage.getItem("userId"),
  });

  setFolderForm({
    name: "",
    files: [],
  });
};



const handleJoinRequest = ()=>{
     
      sendProjectJoinRequest(projectId);

}






  return (
    <div className="min-h-screen p-6 bg-white text-gray-900 space-y-8">
     

      {
        (hasAuthToSeeProject !==null && hasAuthToSeeProject)
        ?
        
      (<div>

    


      <div>
        <div className="flex items-start justify-between">
          <h1 className="text-4xl font-bold mb-2">{projectInfo?.name}</h1>

          <div onClick={()=>deleteProject(projectId)} className="flex items-center justify-start gap-3">
            <span className="flex items-center justify-start gap-3 text-white bg-red-500 px-2 py-1 rounded shadow cursor-pointer">
              <Trash/>
              Delete
            </span>


          <Link to={'edit'}>
          <Edit className="bg-gray-900 focus:bg-gray-900 text-white h-8 w-8 p-1 rounded cursor-pointer" />
          </Link>
          </div>

        </div>
        <p className="text-gray-600">{projectInfo?.description}</p>
        <div className="mt-2 flex flex-wrap gap-4 text-sm">
          <span>
            📅 Started On:{" "}
            {new Date(projectInfo?.startedOn).toLocaleDateString()}
          </span>
          <span>
            ⏳ Deadline: {new Date(projectInfo?.deadline).toLocaleDateString()}
          </span>
          <span>🗂️ Archived: {projectInfo?.archived ? "Yes" : "No"}</span>
          <span>🆔 Project ID: {projectInfo?._id}</span>
        </div>
      </div>

      {/* Owner Details */}
      <div className="border border-gray-200 rounded-lg p-4">
        <h2 className="text-2xl font-semibold mb-2">👑 Owner</h2>
        <div className="text-sm space-y-1">
          <p>
            <strong>Name:</strong> {owner?.firstName} {owner?.lastName}
          </p>
          <p>
            <strong>Username:</strong> {owner?.username}
          </p>
          <p>
            <strong>Email:</strong> {owner?.email}
          </p>
          <p>
            <strong>Role:</strong> {owner?.role}
          </p>
        </div>
      </div>

      {/* Members */}
      <div className="border border-gray-200 rounded-lg p-4 ">
        <h2 className="text-2xl font-semibold mb-4">
          👥 Members ({members.length})
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {members.map((member) => (
            <div
              key={member._id}
              className="border border-gray-200 rounded-md p-3 bg-gray-50"
            >
              <p>
                <strong>
                  {member.firstName} {member.lastName}
                </strong>{" "}
                ({member.username})
              </p>
              <p>Email: {member.email}</p>
              <p>Role: {member.role}</p>
            </div>
          ))}
        </div>
      </div>


      {/* Tickets */}
      <div className="border border-gray-200 rounded-lg p-4  ">
        <div className="flex items-start justify-start gap-5">
        <h1 className="text-2xl font-semibold mb-4">
          🎫 Tickets ({thisProjectTickets?.totalTickets || 0})
          
        </h1>

        </div>
     
        <div className="flex items-center justify-between flex-wrap gap-5 mb-10">
          {
            thisProjectTickets && thisProjectTickets.tickets && thisProjectTickets.tickets.length>0
            ?
            (
              thisProjectTickets.tickets.map((t)=>{
                return(

<div
  key={t?._id} 
  className="border  border-gray-200 rounded-2xl bg-gray-100 shadow-sm hover:shadow-lg transition p-4 w-full flex-1 min-w-xl"
>
  {/* Title & Priority */}
  <div className="flex items-center justify-between mb-3">
    <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
      <Flag className="w-5 h-5 text-blue-500" />
      {t?.title}
    </h2>
    <div className="flex gap-2">
      {/* Priority */}
      <span
        className={`px-2 py-1 text-xs rounded-full font-medium flex items-center gap-1 ${
          t.priority === "High"
            ? "bg-red-100 text-red-600"
            : t.priority === "Medium"
            ? "bg-yellow-100 text-yellow-600"
            : t.priority === "Critical"
            ? "bg-red-200 text-red-800"
            : "bg-green-100 text-green-600"
        }`}
      >
        <Flag className="w-3 h-3" />
        {t.priority}
      </span>

      {/* Status */}
      <span
        className={`px-2 py-1 text-xs rounded-full font-medium flex items-center gap-1 ${
          t.status === "Open"
            ? "bg-blue-100 text-blue-600"
            : t.status === "In Progress"
            ? "bg-yellow-100 text-yellow-600"
            : t.status === "Closed"
            ? "bg-green-100 text-green-600"
            : "bg-gray-100 text-gray-600"
        }`}
      >
        {t.status === "Closed" ? (
          <CheckCircle className="w-3 h-3" />
        ) : (
          <Clock className="w-3 h-3" />
        )}
        {t.status}
      </span>
    </div>
  </div>

  {/* Assigned Info */}
  <p className="text-sm text-gray-600 mb-3 flex items-center gap-2">
    <User className="w-4 h-4 text-gray-500" />
    <span className="font-medium text-gray-800">{t?.giver?.username}</span> →{" "}
    <span className="font-medium text-gray-800">{t?.doer?.username}</span>
    <span className="flex items-center gap-1 text-gray-500 text-xs">
      <Clock className="w-3 h-3" />
      {new Date(t?.assignedOn).toLocaleDateString()}
    </span>
  </p>

  {/* Steps to Reproduce */}
  {t?.stepsToReproduce?.length > 0 && (
    <div className="mb-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
        <CheckCircle className="w-4 h-4 text-green-500" />
        Steps to Reproduce:
      </h3>
      <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
        {t.stepsToReproduce.map((s, i) => (
          <li className="w-full overflow-hidden text-ellipsis whitespace-nowrap" key={i}>{s}</li>
        ))}
      </ul>
    </div>
  )}

  {/* Action Buttons */}
  <div className="flex justify-end gap-3">
    <button
      onClick={() => handleViewDetails(t._id)}
      className="px-3 py-1.5 text-sm rounded-lg flex items-center gap-1 bg-blue-500 text-white hover:bg-blue-600 transition"
    >
      <Eye className="w-4 h-4" />
      View
    </button>
    <button
      onClick={() => handleDeleteTicket(t._id)}
      className="px-3 py-1.5 text-sm rounded-lg flex items-center gap-1 bg-red-500 text-white hover:bg-red-600 transition"
    >
      <Trash2 className="w-4 h-4" />
      Delete
    </button>
  </div>
</div>

)
              })

            )
            :
            (
              <p>No tickets have been created for this project yet</p>
            )
          }

        </div>

       {
  thisProjectTickets &&
  thisProjectTickets.tickets &&
  ticketPage < thisProjectTickets.totalPages &&
  thisProjectTickets.tickets.length > 0 && (
    <div className="w-full p-5 my-10 bg-gray-200">
      <div className="flex items-center justify-center gap-3 w-fit mx-auto">
        {/* Left Navigation */}
        <MoveLeft
          className="h-9 w-9 p-1 rounded shadow bg-gray-900 text-white cursor-pointer disabled:opacity-40"
          onClick={() => {
            if (ticketPage > 1) {
              setTicketPage(ticketPage - 1);
            } else {
              toast.warn("Already on first page");
            }
          }}
        />

        {/* Page Info */}
        <div className="flex items-center justify-start gap-1 font-medium text-lg">
          <span>{thisProjectTickets?.currentPage}</span>
          of
          <span>{thisProjectTickets?.totalPages}</span>
        </div>

        {/* Right Navigation */}
        <MoveRight
          className="h-9 w-9 p-1 rounded shadow bg-gray-900 text-white cursor-pointer disabled:opacity-40"
          onClick={() => {
            if (ticketPage < thisProjectTickets?.totalPages) {
              setTicketPage(ticketPage + 1);
            } else {
              toast.warn("Already on last page");
            }
          }}
        />
      </div>
    </div>
  )
}


      </div>

      {/* Activity */}
      <div className="border border-gray-200 rounded-lg p-4 ">
        <h2 className="text-2xl font-semibold mb-4">
          📌 Activity Log ({activities.length})
        </h2>
        <div className="space-y-4">
          {activities.map((a, index) => (
            <div key={index} className="border-b border-gray-200 pb-3">
              <p className="text-sm text-gray-700">
                <strong>{a?.performedBy?.username}</strong> performed an action
                on ticket <strong>{a?.job?.title}</strong>
              </p>
              <p className="text-xs text-gray-500">Details: {a?.detail}</p>
              <p className="text-xs text-gray-500">
                Project: {a?.project?.name}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Teams (if any) */}
      {data.teams && data.teams.length > 0 && (
        <div className="border border-gray-200 rounded-lg p-4">
          <h2 className="text-2xl font-semibold mb-4">🛡️ Teams</h2>
          <div className="space-y-2">
            {data.teams.map((team) => (
              <div
                key={team._id}
                className="p-2 border border-gray-300 rounded-md"
              >
                <p>
                  <strong>{team.name}</strong>
                </p>
                <p className="text-sm text-gray-500">ID: {team._id}</p>
              </div>
            ))}
          </div>
        </div>
      )}


        <div className="p-5 mt-5">
          {
      pendingProjectReqLists && pendingProjectReqLists.length
      ?
      pendingProjectReqLists.map((r)=>{
        (
        <ul>
          <li key={r._id}>
            <span>{r.username}</span>
          </li>
        </ul>

      )
      })
      :(
        <p className="font-medium text-gray-800">No pending requests</p>
      )
      
        }
      </div>



        <div className="border text-white border-gray-200 rounded-lg p-4 bg-gray-800 ">
          <h1 className="text-2xl font-medium text-gray-200 mb-5">Upload Project files</h1>

          <div className="py-5 mt-5 flex items-center justify-start gap-5">
            <div className="w-xl flex items-center justify-start gap-5">
              <label htmlFor="folder" className="w-20">
                <Folder/>
              </label>
              <input value={folderForm.name} onChange={(e)=>{
                setFolderForm((prev)=>({
                  ...prev,
                  name:e.target.value
                }))
              }} type="text" name="folder" id="folder" placeholder="Create a new folder" className="h-12 block flex-1 outline-none border border-gray-400 rounded shadow px-6 py-1" />


            </div>

            <span>OR</span>

            <div className=" w-sm">
              <select value={folderForm.name} onChange={(e)=>{
                setFolderForm((prev)=>({
                  ...prev,
                  name:e.target.value
                }))
              }} className="w-full px-6 py-1 block h-12 bg-gray-800 border border-gray-400 rounded outline-none" name="folder" id="folder">
                <option value="">
                  Select existing folders
                </option>
                <option value="">
                  No existing folders found
                </option>
              </select>

            </div>

           <div>

           </div>
            

          </div>

          <div className="py-5 flex items-start justify-start gap-5 mb-5 min-h-[60vh]">
        <div className="py-5 flex items-center justify-start gap-5 mb-5 w-xl">
  <label htmlFor="files" className="font-medium w-20">
    <File />
  </label>

  <input
    type="file"
    id="files"
    name="files"
    multiple
    onChange={(e) => {
  const selectedFiles = Array.from(e.target.files);

  const mappedFiles = selectedFiles.map((f) => ({
    filename: f.name,
    size: f.size,
    fileType: f.type,
    uploadedAt: new Date().toISOString(),
    uploadedBy: localStorage.getItem("userId"),
    fileObj: f, // ✅ store raw file for preview
  }));

  setFolderForm((prev) => ({
    ...prev,
    files: [...(prev.files || []), ...mappedFiles],
  }));

  e.target.value = null;
}}

    className="flex-1 border border-gray-400 rounded shadow px-3 py-2 cursor-pointer"
  />
</div>
       {/* Preview Section */}
      <div className="pt-5 flex-1">
    <h2 className="font-semibold text-lg mb-3">
      Folder: {folderForm.name || "No folder chosen yet"}
    </h2>
  

  {folderForm.files.length > 0 ? (
    <ul className="space-y-3 flex items-start justify-start gap-4 flex-wrap h-80 overflow-y-scroll noScroll">
      {folderForm.files.map((file, i) => {
        const isImage =
  file.fileType.startsWith("image/") ||
  file.filename.match(/\.(png|jpe?g|gif|webp)$/i);

        const previewUrl = isImage && file.fileObj ? URL.createObjectURL(file.fileObj) : null;

        const isTextOrCode = file.fileType.startsWith("text/") || file.filename.match(/\.(html|js|css|json|txt)$/);

        // Temporary preview for images (needs actual File object for full preview)
        // const previewUrl = isImage && file.fileObj ? URL.createObjectURL(file.fileObj) : null;

        return (
          <li
            key={i}
            className="flex items-center gap-4 border p-2 rounded-md bg-gray-50 w-xs shadow-sm relative"
          >
            {/* Preview Section */}
            {isImage && previewUrl ? (
              <img
                src={previewUrl}
                alt={file.filename}
                className="w-12 h-12 object-cover rounded"
              />
            ) : isTextOrCode ? (
              <div className="w-12 h-12 flex items-center justify-center bg-blue-100 rounded">
                <FileCode className="text-blue-600" size={24} />
              </div>
            ) : (
              <div className="w-12 h-12 flex items-center justify-center bg-gray-200 rounded">
                <FileIcon className="text-gray-600" size={24} />
              </div>
            )}

            {/* File Info */}
            <div className="flex-1">
              <p className="font-medium text-sm">{file.filename}</p>
              <p className="text-xs text-gray-500">
                {(file.size / 1024).toFixed(2)} KB
              </p>
            </div>

            {/* Remove Button */}
            <button
              onClick={() =>
                setFolderForm((prev) => ({
                  ...prev,
                  files: prev.files.filter((_, index) => index !== i),
                }))
              }
              className="absolute top-2 right-2 text-gray-500 hover:text-red-600"
            >
              <X className="p-1 cursor-pointer h-5 w-5 rounded-full bg-gray-800 text-white" />
            </button>
          </li>
        );
      })}
    </ul>
  ) : (
    <p className="text-gray-500">No files selected yet.</p>
  )}
</div>

          </div>




          <div className="w-fit mx-auto my-10">
            <button onClick={uploadProjectFolder}  className="px-20 py-2.5 rounded border border-gray-50 text-white font-medium hover:bg-white hover:text-gray-800 cursor-pointer transition-all">
              Upload Folder
            </button>
          </div>


     



        </div>

      <div className="mt-10 px-3 py-5 border-t border-gray-200  rounded bg-white text-gray-900">
        <h1 className="text-2xl font-semibold mb-5">Create a ticket</h1>

        <form className="p-5 border border-gray-300 rounded ">
          <div className="flex items-start justify-between gap-8 w-full">
            <div>
              <div className="flex items-start gap-4 mb-4 max-w-xl ">
                <label
                  htmlFor="title"
                  className="flex items-start justify-start gap-2 text-gray-700 w-40"
                >
                  <Text className="bg-gray-900 focus:bg-gray-900 text-white h-8 w-8 p-1 rounded" />
                  Title
                </label>

                <input
                  value={ticketForm.title}
                  name="title"
                  onChange={(e) =>
                    setTicketForm((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  type="text"
                  className="outline-none rounded focus:shadow-lg p-2 w-lg bg-gray-50 border border-gray-200 "
                  placeholder="Login validation error..."
                />
              </div>
              <div className="flex items-start gap-4 mb-4 max-w-xl">
                <label
                  htmlFor="description"
                  className="flex items-start justify-start gap-2 text-gray-700 w-40"
                >
                  <Book className="bg-gray-900 focus:bg-gray-900 text-white h-8 w-8 p-1 rounded" />
                  Title
                </label>

                <textarea
                  value={ticketForm.description}
                  name="description"
                  onChange={(e) =>
                    setTicketForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  type="text"
                  className="outline-none rounded focus:shadow-lg p-2 w-lg bg-gray-50 border border-gray-200 h-80 overflow-y-scroll noScroll"
                  placeholder="Discuss the issue in detail..."
                />
              </div>

              <div className="flex items-start gap-4 mb-4 max-w-xl">
                <label
                  htmlFor="assignedTo"
                  className="flex items-start justify-start gap-2 text-gray-700 w-40"
                >
                  <User className="bg-gray-900 focus:bg-gray-900 text-white h-8 w-8 p-1 rounded" />
                  Assign to
                </label>

                <select
                  name="assignedTo"
                  id="assignedTo"
                  value={ticketForm.assignedTo} // controlled value
                  onChange={(e) =>
                    setTicketForm((prev) => ({
                      ...prev,
                      assignedTo: e.target.value,
                    }))
                  }
                  className="outline-none rounded focus:shadow-lg p-2 w-lg bg-gray-50 border border-gray-200"
                >
                  <option value=""> -- Select Member -- </option>
                  {members &&
                    members.map((m, i) => (
                      <option key={i} value={m._id}>
                        {m.username} - {m.role}
                      </option>
                    ))}
                </select>
              </div>

              <div className="flex items-start gap-4 mb-4 max-w-xl">
                <label
                  htmlFor="createdBy"
                  className="flex items-start justify-start gap-2 text-gray-700 w-40"
                >
                  <PersonStanding className="bg-gray-900 focus:bg-gray-900 text-white h-8 w-8 p-1 rounded" />
                  Title
                </label>

                <input
                  value={ticketForm.createdBy}
                  name="createdBy"
                  type="text"
                  className="outline-none rounded focus:shadow-lg p-2 w-lg bg-gray-50 border border-gray-200 "
                  placeholder="Login validation error..."
                />
              </div>
            </div>

            <div>
              <div className="flex items-start gap-4 mb-4 flex-1 ">
                <label
                  htmlFor="priority"
                  className="flex items-start justify-start gap-2 text-gray-700 w-40"
                >
                  <Scale className="bg-gray-900 focus:bg-gray-900 text-white h-8 w-8 p-1 rounded" />
                  Priority
                </label>

                <select
                  name="priority"
                  id="priority"
                  value={ticketForm.priority} // controlled value
                  onChange={(e) =>
                    setTicketForm((prev) => ({
                      ...prev,
                      priority: e.target.value,
                    }))
                  }
                  className="outline-none rounded focus:shadow-lg p-2 w-lg bg-gray-50 border border-gray-200"
                >
                  <option value=""> -- Select Priority -- </option>
                  {["Low", "Medium", "High", "Critical"].map((m, i) => (
                    <option key={i} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                {/* Input for Steps */}
                <div className="flex items-start gap-4 mb-4 flex-1">
                  <label
                    htmlFor="stepsToReproduce"
                    className="flex items-start justify-start gap-2 text-gray-700 w-40"
                  >
                    <WavesLadder className="bg-gray-900 text-white h-8 w-8 p-1 rounded" />
                    Steps
                  </label>

                  <textarea
                    value={ticketForm.stepsToReproduceInput || ""}
                    name="stepsToReproduceInput"
                    onChange={(e) =>
                      setTicketForm((prev) => ({
                        ...prev,
                        stepsToReproduceInput: e.target.value,
                      }))
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        if (ticketForm.stepsToReproduceInput?.trim()) {
                          setTicketForm((prev) => ({
                            ...prev,
                            stepsToReproduce: [
                              ...(prev.stepsToReproduce || []),
                              prev.stepsToReproduceInput.trim(),
                            ],
                            stepsToReproduceInput: "",
                          }));
                        }
                      }
                    }}
                    className="outline-none rounded focus:shadow-lg p-2 w-lg bg-gray-50 border border-gray-200 h-50 overflow-y-scroll noScroll"
                    placeholder="Press Enter to add each step..."
                  />
                </div>

                {/* Display Steps */}
                <div className="flex flex-col gap-2">
                  {ticketForm.stepsToReproduce?.map((step, i) => (
                    <div
                      key={i}
                      className="flex items-start justify-between bg-gray-100 px-3 py-2 rounded shadow-sm"
                    >
                      <p className="text-gray-700">{step}</p>
                      <X
                        onClick={() =>
                          setTicketForm((prev) => ({
                            ...prev,
                            stepsToReproduce: prev.stepsToReproduce.filter(
                              (_, idx) => idx !== i
                            ),
                          }))
                        }
                        className="text-red-500 hover:text-red-700 cursor-pointer"
                        size={18}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                {/* Upload Attachments */}
                <div className="flex items-start gap-4 my-4 flex-1">
                  <label
                    htmlFor="attachments"
                    className="flex items-start justify-start gap-2 text-gray-700 w-40"
                  >
                    <Sticker className="bg-gray-900 focus:bg-gray-900 text-white h-8 w-8 p-1 rounded" />
                    Attachments
                  </label>

                  <input
                    type="file"
                    id="attachments"
                    multiple
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      if (files.length > 0) {
                        setTicketForm((prev) => ({
                          ...prev,
                          attachments: [...(prev.attachments || []), ...files],
                        }));
                      }
                    }}
                    className="outline-none rounded p-2 w-lg bg-gray-50 border border-gray-200"
                  />
                </div>

                {/* Preview Attachments */}
                <div className="flex flex-wrap gap-4">
                  {ticketForm.attachments?.map((file, i) => {
                    const isImage = file.type?.startsWith("image/");
                    const fileURL = URL.createObjectURL(file);

                    return (
                      <div
                        key={i}
                        className="relative bg-gray-100 rounded shadow-sm p-2 flex flex-col items-center"
                      >
                        {/* Remove Button */}
                        <X
                          onClick={() =>
                            setTicketForm((prev) => ({
                              ...prev,
                              attachments: prev.attachments.filter(
                                (_, idx) => idx !== i
                              ),
                            }))
                          }
                          className="absolute top-1 right-1 text-red-500 hover:text-red-700 cursor-pointer"
                          size={18}
                        />

                        {/* File Preview */}
                        {isImage ? (
                          <img
                            src={fileURL}
                            alt={file.name}
                            className="w-24 h-24 object-cover rounded"
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center w-24 h-24 bg-gray-200 rounded">
                            📄
                            <span className="text-xs text-center truncate w-20">
                              {file.name}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="w-fit mx-auto mt-15 mb-10">
            <button
              onClick={handleTicketCreation}
              type="submit"
              className="flex items-center justify-between gap-3 py-2.5 px-10 font-semibold bg-gray-300 text-shadow-gray-900 border border-gray-200 hover:text-white hover:bg-green-500 rounded cursor-pointer transition-all"
            >
              <Ticket />
              Create Ticket
            </button>
          </div>
        </form>
      </div>

      <div className="mt-10 px-3 py-5 border-t border-gray-200  rounded bg-white text-gray-900">
        <h1 className="text-2xl font-medium text-gray-800 mb-5">
          Add Members{" "}
        </h1>
        <div className="flex items-start justify-start w-full">
          <div className="flex-1 ">
            <SearchUser
              selectedUserIds={selectedUserIds}
              setSelectedUserIds={setSelectedUserIds}
            />
          </div>

          <div className="w-2xl h-auto p-5 border border-gray-300 rounded">
            <h1 className=" text-lg font-medium text-gray-600">
              Selected users to add
            </h1>
            <div className="flex items-center justify-start gap-3 flex-wrap mt-5">
              {selectedUserIds && selectedUserIds.length > 0 ? (
                selectedUserIds.map((u, i) => {
                  return (
                    <span
                      key={i}
                      className="px-4 py-1 rounded bg-gray-300 text-gray-800 flex gap-2 items-center justify-start"
                    >
                      {u}
                      <Trash
                        className="p-1 rounded-full bg-gray-600 text-gray-100 hover:bg-gray-900 transition-all cursor-pointer"
                        onClick={() =>
                          setSelectedUserIds((prev) =>
                            prev.filter((id) => id !== u)
                          )
                        }
                      />
                    </span>
                  );
                })
              ) : (
                <p>No Users selected</p>
              )}
            </div>
          </div>
        </div>

        <div className="w-fit mx-auto mt-15">
          <button
            onClick={addUser}
            className=" px-12 cursor-pointer hover:bg-green-700 transition-all py-2 text-white rounded shadow bg-green-500"
          >
            Add User(s)
          </button>
        </div>
      </div>

      <div className="mt-10 px-3 py-5 border-t border-gray-200  rounded bg-white text-gray-900">
        <h1 className="text-2xl font-medium text-gray-800 mb-5">Add Teams </h1>
        <div className="flex items-start justify-start w-full">
          <div className="flex-1 ">
            <SearchTeam
              selectedTeamIds={selectedTeamIds}
              setSelectedTeamIds={setSelectedTeamIds}
            />
          </div>

          <div className="w-2xl h-auto p-5 border border-gray-300 rounded">
            <h1 className=" text-lg font-medium text-gray-600">
              Selected teams to add
            </h1>
            <div className="flex items-center justify-start gap-3 flex-wrap mt-5">
              {selectedTeamIds && selectedTeamIds.length > 0 ? (
                selectedTeamIds.map((u, i) => {
                  return (
                    <span
                      key={i}
                      className="px-4 py-1 rounded bg-gray-300 text-gray-800 flex gap-2 items-center justify-start"
                    >
                      {u}
                      <Trash
                        className="p-1 rounded-full bg-gray-600 text-gray-100 hover:bg-gray-900 transition-all cursor-pointer"
                        onClick={() =>
                          setSelectedTeamIds((prev) =>
                            prev.filter((id) => id !== u)
                          )
                        }
                      />
                    </span>
                  );
                })
              ) : (
                <p>No Users selected</p>
              )}
            </div>
          </div>
        </div>

        <div className="w-fit mx-auto mt-15">
          <button
            onClick={addGroup}
            className=" px-12 cursor-pointer hover:bg-green-700 transition-all py-2 text-white rounded shadow bg-green-500"
          >
            Add Team(s)
          </button>
        </div>
      </div>

      
    

        </div>)
       
        :
        (
          <RestrictedProjectCard project={projectInfo} onRequestJoin={handleJoinRequest} status={reqStatus} projectId={projectId} />

        )


      }




    </div>
  );
};

export default ProjectDetail;
