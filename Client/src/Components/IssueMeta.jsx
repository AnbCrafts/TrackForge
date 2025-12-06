import React from "react";
import { AlertCircle, Calendar, User, Tag, FileText } from "lucide-react";

export default function IssueMeta({ ticket, project }) {
  if (!ticket) return null;

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-6">

      {/* Title + Status */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-2xl font-semibold text-gray-800 mb-2 break-words">
            {ticket.title}
          </h1>

          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span
              className={`px-3 py-1 rounded text-white font-medium ${
                ticket.status === "Open"
                  ? "bg-green-600"
                  : ticket.status === "Closed"
                  ? "bg-red-600"
                  : "bg-yellow-600"
              }`}
            >
              {ticket.status}
            </span>

            <span className="flex items-center gap-2 px-3 py-1 rounded bg-gray-100 text-gray-700 border">
              <Tag size={14} /> {ticket.priority}
            </span>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="border-t pt-4">
        <h2 className="text-lg font-medium text-gray-700 flex items-center gap-2 mb-2">
          <FileText size={18} /> Description
        </h2>
        <p className="text-gray-700 leading-relaxed text-[15px] break-words">
          {ticket.description || "No description added."}
        </p>
      </div>

      {/* Meta Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 border-t pt-4">

        {/* Reported By */}
        <div className="space-y-1">
          <div className="text-xs text-gray-500 flex items-center gap-2">
            <User size={14} /> Reported by
          </div>
          <div className="text-gray-800 font-medium break-words">
            {ticket.giver?.username || "Unknown"}
          </div>
        </div>

        {/* Project */}
        <div className="space-y-1">
          <div className="text-xs text-gray-500 flex items-center gap-2">
            <Tag size={14} /> Project
          </div>
          <div className="text-gray-800 font-medium break-words">{project?.name}</div>
          <div className="text-xs text-gray-500 break-all">ID: {project?._id}</div>
        </div>

        {/* Assigned On */}
        <div className="space-y-1">
          <div className="text-xs text-gray-500 flex items-center gap-2">
            <Calendar size={14} /> Assigned On
          </div>
          <div className="text-gray-800 font-medium">
            {ticket.assignedOn ? new Date(ticket.assignedOn).toLocaleDateString() : "—"}
          </div>
        </div>

        {/* Valid Till */}
        <div className="space-y-1">
          <div className="text-xs text-gray-500 flex items-center gap-2">
            <AlertCircle size={14} /> Valid Till
          </div>
          <div className="text-gray-800 font-medium">
            {ticket.validFor ? new Date(ticket.validFor).toLocaleDateString() : "—"}
          </div>
        </div>

      </div>
    </div>
  );
}
