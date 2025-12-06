import { Lock, Send } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { TrackForgeContextAPI } from "../ContextAPI/TrackForgeContextAPI";

export default function RestrictedProjectCard({ project, onRequestJoin, status }) {
  const { reqStatus } = useContext(TrackForgeContextAPI);
  const [belongs, setBelongs] = useState(false);

  /* -------------------------------
      CHECK IF USER IS A MEMBER
  --------------------------------*/
  useEffect(() => {
    const id = localStorage.getItem("userId");
    if (!project || !project.members || !id) return;

    const isMember = project.members.some((m) => m?._id === id);
    setBelongs(isMember);
  }, [project]);

  /* -------------------------------
      STATUS BADGE UI COMPONENT
  --------------------------------*/
  const StatusBadge = ({ status }) => {
    let base =
      "px-3 py-1 rounded text-sm font-medium inline-block border ";

    const colors = {
      "Access granted": "bg-green-100 text-green-800 border-green-400",
      "Sent Request": "bg-yellow-100 text-yellow-800 border-yellow-400",
      "Access denied": "bg-red-100 text-red-800 border-red-400",
      "Access requested": "bg-blue-100 text-blue-800 border-blue-400",
      default: "bg-gray-100 text-gray-600 border-gray-400",
    };

    return <span className={base + (colors[status] || colors.default)}>{status}</span>;
  };

  return (
    <div className="p-6 bg-gray-100 rounded-2xl shadow-md border border-gray-300 w-full max-w-3xl">
      
      {/* TITLE */}
      <h1 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
        {project?.name || "Private Project"}
        <Lock className="h-5 w-5 text-red-500" />
      </h1>

      {/* DESCRIPTION */}
      <p className="text-gray-600 mb-4">
        {project?.description || "This project is private. Limited information is visible."}
      </p>

      {/* META INFO */}
      <div className="text-sm text-gray-700 space-y-1 mb-5">
        <p>👤 Owner: {project?.owner?.name || "Hidden"}</p>
        <p>📅 Created: {project?.createdAt ? new Date(project.createdAt).toLocaleDateString() : "N/A"}</p>
        <p className="font-medium text-red-500">🔒 Restricted Access</p>
      </div>

      {/* JOIN REQUEST BUTTON OR BADGE */}
      <div>
        {belongs ? (
          <StatusBadge status="Access granted" />
        ) : status === "" || status === "not_requested" ? (
          <button
            onClick={onRequestJoin}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <Send className="h-4 w-4" /> Request to Join
          </button>
        ) : (
          <StatusBadge status={status} />
        )}
      </div>
    </div>
  );
}
