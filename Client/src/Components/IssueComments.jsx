import React, { useState } from "react";
import { MessageSquare, Send } from "lucide-react";

export default function IssueComments({ comments = [], onSubmit }) {
  const [message, setMessage] = useState("");
  const [type, setType] = useState("Text");

  const submitComment = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    onSubmit({ message, type });
    setMessage("");
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 space-y-5">
      <h2 className="font-semibold text-gray-700 flex items-center gap-2">
        <MessageSquare size={18} /> Comments
      </h2>

      {/* Comments List */}
      <div className="max-h-[360px] overflow-y-auto pr-2 space-y-3">
        {comments.length === 0 ? (
          <p className="text-gray-500 text-sm italic">No comments yet.</p>
        ) : (
          comments.map((c) => (
            <div key={c._id} className="p-3 bg-gray-100 rounded">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div className="font-medium text-gray-800 break-words">{c.message}</div>
                <div className="text-xs text-gray-500">
                  {new Date(c.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>

              <div className="text-xs text-gray-500 mt-1">
                — {c?.userId?.username || "Unknown"}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add new comment */}
      <form onSubmit={submitComment} className="space-y-3">
        <input
          className="w-full p-2 rounded border border-gray-300 focus:ring"
          placeholder="Write a comment..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <select
            className="border rounded px-2 py-1 text-sm w-full sm:w-auto"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="Text">Text</option>
            <option value="Status Change">Status Change</option>
            <option value="System">System</option>
          </select>

          <button
            type="submit"
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
          >
            <Send size={16} /> Send
          </button>
        </div>
      </form>
    </div>
  );
}
