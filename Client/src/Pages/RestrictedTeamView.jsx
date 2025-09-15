import { Lock } from "lucide-react";
import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { TrackForgeContextAPI } from "../ContextAPI/TrackForgeContextAPI";

export default function RestrictedTeamView({ creator, projects, members, raw }) {
    const {teamId} = useParams();
    const {sendTeamJoinRequest,teamReqStatus,getTeamByID,checkAuthorityToViewTeam} = useContext(TrackForgeContextAPI);

    useEffect(()=>{
        getTeamByID(teamId);
        checkAuthorityToViewTeam(teamId)
    },[teamId])

    const joinReqHandler = ()=>{
        sendTeamJoinRequest(teamId);
    }


const TeamJoinStatusBadge = ({ status }) => {
  let badgeClass = "";
  let label = "";

  switch (status) {
    case "Access granted":
      badgeClass = "bg-green-100 text-green-700 border border-green-300";
      label = "Access Granted";
      break;

    case "Sent Request":
      badgeClass = "bg-blue-100 text-blue-700 border border-blue-300";
      label = "Request Sent";
      break;

    case "Access denied":
      badgeClass = "bg-red-100 text-red-700 border border-red-300";
      label = "Access Denied";
      break;

    case "Access requested":
      badgeClass = "bg-yellow-100 text-yellow-700 border border-yellow-300";
      label = "Access Requested";
      break;

    default:
      badgeClass = "bg-gray-100 text-gray-700 border border-gray-300";
      label = "Unknown Status";
      break;
  }

  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-medium ${badgeClass}`}
    >
      {label}
    </span>
  );
};




  return (
    <div className="p-6 bg-gray-50 border border-gray-300 rounded-lg shadow-md w-full">
      {/* Team name */}
      <h1 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
        {raw?.name || "Unnamed Team"} 
        <Lock className="h-5 w-5 text-red-500" />
      </h1>

      {/* Team description */}
      <p className="text-gray-600 mb-4">
        {raw?.description || "This team is private. Limited information is visible."}
      </p>

      {/* Restricted Meta Info */}
      <div className="text-sm text-gray-700 space-y-1 mb-4">
        <p>👤 Creator: {creator?.username || "Hidden"}</p>
        <p>📅 Created On: {raw?.createdAt ? new Date(raw.createdAt).toLocaleDateString() : "Unknown"}</p>
        <p>👥 Members: {members?.length || 0}</p>
        <p>📂 Linked Projects: {projects?.length || 0}</p>
        <p className="font-medium text-red-500">🔒 Restricted Access</p>
      </div>

      <div>
        {
            teamReqStatus === ""
            ?
            (<button onClick={joinReqHandler}
        className="mt-3 cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Request to Join
      </button>)
            :
            (
                <TeamJoinStatusBadge status={teamReqStatus}  />
            )
        }
      </div>
      
    </div>
  );
}
