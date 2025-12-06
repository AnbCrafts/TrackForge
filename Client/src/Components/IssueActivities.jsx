import React from "react";
import { AlignJustify, User, Calendar } from "lucide-react";

export default function IssueActivities({ activities = [] }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
        <AlignJustify size={18} /> Activity Log
      </h2>

      {activities.length === 0 ? (
        <p className="text-gray-500 text-sm italic">No activities recorded yet.</p>
      ) : (
        <div className="space-y-6">
          {activities.map((a, i) => (
            <div key={i} className="flex items-start gap-4">

              {/* Timeline Line */}
              <div className="flex flex-col items-center">
                <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                {i !== activities.length - 1 && (
                  <div className="w-px flex-1 bg-gray-300"></div>
                )}
              </div>

              {/* Activity */}
              <div className="flex-1 bg-gray-50 p-4 rounded border border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-1">
                  <div className="font-semibold text-gray-800">{a.actionType}</div>

                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Calendar size={14} />
                    {a.doneOn ? new Date(a.doneOn).toLocaleDateString() : "Unknown"}
                  </div>
                </div>

                <div className="text-gray-700 text-sm leading-relaxed mb-3 break-words">
                  {a.details}
                </div>

                <div className="flex items-center gap-2 text-gray-500 text-xs">
                  <User size={14} /> {a.performedBy?.username || "Unknown"}
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}
