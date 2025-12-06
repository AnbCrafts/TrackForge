import React from "react";
import { Calendar, User, Tag } from "lucide-react";

export default function IssueSidebar({ ticket, project }) {
  if (!ticket) return null;

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6 space-y-6">

      {/* Status */}
      <div>
        <h2 className="font-semibold text-gray-700 mb-2">Status</h2>
        <span
          className={`px-3 py-1 text-sm rounded text-white font-medium ${
            ticket.status === "Open"
              ? "bg-green-600"
              : ticket.status === "Closed"
              ? "bg-red-600"
              : "bg-yellow-500"
          }`}
        >
          {ticket.status}
        </span>
      </div>

      {/* Priority */}
      <div>
        <h2 className="font-semibold text-gray-700 mb-2">Priority</h2>
        <span className="flex items-center gap-2 px-3 py-1 text-sm rounded bg-gray-100 text-gray-700 w-fit">
          <Tag size={16} /> {ticket.priority}
        </span>
      </div>

      {/* Project Info */}
      <div>
        <h2 className="font-semibold text-gray-700 mb-2">Project</h2>
        <div className="text-gray-800 font-medium break-words">{project?.name}</div>
        <div className="text-xs text-gray-500 break-all">ID: {project?._id}</div>
      </div>

      {/* Issue Details */}
      <div>
        <h2 className="font-semibold text-gray-700 mb-2">Details</h2>

        <div className="space-y-2 text-sm text-gray-700">

          {/* Reported By */}
          <div className="flex items-center gap-2 flex-wrap">
            <User size={16} className="text-gray-500" />
            Reported by:
            <span className="font-medium">{ticket.giver?.username || "Unknown"}</span>
          </div>

          {/* Assigned On */}
          <div className="flex items-center gap-2 flex-wrap">
            <Calendar size={16} className="text-gray-500" />
            Assigned On:
            <span className="font-medium">
              {ticket.assignedOn
                ? new Date(ticket.assignedOn).toLocaleDateString()
                : "—"}
            </span>
          </div>

          {/* Valid Till */}
          <div className="flex items-center gap-2 flex-wrap">
            <Calendar size={16} className="text-gray-500" />
            Valid Till:
            <span className="font-medium">
              {ticket.validFor
                ? new Date(ticket.validFor).toLocaleDateString()
                : "—"}
            </span>
          </div>
        </div>
      </div>

    </div>
  );
}
