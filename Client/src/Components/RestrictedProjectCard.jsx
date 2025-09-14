import { Lock, Send } from "lucide-react";
import { useContext, useEffect } from "react";
import { TrackForgeContextAPI } from "../ContextAPI/TrackForgeContextAPI";

export default function RestrictedProjectCard({ project, onRequestJoin,status, projectId }) {
  const {checkProjectJoinRequest, reqStatus} = useContext(TrackForgeContextAPI);

  useEffect(()=>{
      if(projectId && checkProjectJoinRequest){
        checkProjectJoinRequest(projectId)
      } 
  },[projectId])

  const StatusBadge = ({ status }) => {
  let styles = "px-3 py-1 rounded text-sm font-medium inline-block ";

  switch (status) {
    case "Access granted":
      styles += "bg-green-100 text-green-800 border border-green-400";
      break;
    case "Sent Request":
      styles += "bg-yellow-100 text-yellow-800 border border-yellow-400";
      break;
    case "Access denied":
      styles += "bg-red-100 text-red-800 border border-red-400";
      break;
    case "Access requested":
      styles += "bg-blue-100 text-blue-800 border border-blue-400";
      break;
    default:
      styles += "bg-gray-100 text-gray-600 border border-gray-400";
  }

  return <span className={styles}>{status}</span>;
};


  return (
    <div className="p-6 bg-gray-100 rounded-2xl shadow-md border border-gray-300 max-w-3xl">
      {/* Project name */}
      <h1 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
        {project?.name} 
        <Lock className="h-5 w-5 text-red-500" />
      </h1>

      {/* Short description */}
      <p className="text-gray-600 mb-4">
        {project?.description || "This project is private. Limited information is visible."}
      </p>

      {/* Meta info */}
      <div className="text-sm text-gray-700 space-y-1 mb-4">
        <p>👤 Owner: {project?.owner?.name || "Hidden"}</p>
        <p>📅 Created: {new Date(project?.createdAt).toLocaleDateString()}</p>
        <p className="font-medium text-red-500">🔒 Restricted Access</p>
      </div>

        <div>
          {
            status === ""
            ?
            (<button
          onClick={onRequestJoin}
          className="flex cursor-pointer items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <Send className="h-4 w-4" /> Request to Join
        </button>)
            :
            (
              <StatusBadge status={status}/>
            )
          }
        

        </div>



      
    </div>
  );
}
