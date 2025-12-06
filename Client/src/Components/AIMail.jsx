import React, { useState, useContext } from "react";
import { TrackForgeContextAPI } from "../ContextAPI/TrackForgeContextAPI";

const AIMail = () => {
  const { sendComplaintMail, loading, lastResponse, error } =
    useContext(TrackForgeContextAPI);

  const [senderName, setSenderName] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [context, setContext] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");

    try {
      const res = await sendComplaintMail(senderName, senderEmail, subject, context);
      setStatus(res.success ? "Complaint email sent successfully!" : "Failed to send email.");
    } catch {
      setStatus("Server error while sending email.");
    }
  };

  return (
    <div className="w-full bg-gray-900 text-gray-300 py-12 px-6 border border-gray-700 rounded-2xl shadow-2xl">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start justify-between gap-10">

        {/* Left section */}
        <div className="w-full lg:max-w-xl space-y-4">
          <h3 className="text-2xl font-semibold text-white">
            Submit a Complaint to TrackForge Admin
          </h3>

          <p className="text-sm text-gray-400">
            Facing an issue? Send an AI-assisted complaint email directly to the TrackForge team.
          </p>

          {status && (
            <div className={`text-sm font-medium ${status.includes("success") ? "text-green-400" : "text-red-400"}`}>
              {status}
            </div>
          )}

          {error && (
            <div className="text-sm text-red-500">
              {error.message || "Server error"}
            </div>
          )}

          {lastResponse?.content && (
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 text-sm text-gray-200">
              <strong className="text-indigo-400">AI Generated Complaint Email:</strong>
              <p className="mt-2 leading-relaxed break-words">{lastResponse.content}</p>
            </div>
          )}
        </div>

        {/* Right section (Form) */}
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-lg flex flex-col gap-4 border border-gray-800 p-6 rounded-xl"
        >
          <input
            type="text"
            value={senderName}
            onChange={(e) => setSenderName(e.target.value)}
            placeholder="Your Name"
            className="w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 outline-none"
            required
          />

          <input
            type="email"
            value={senderEmail}
            onChange={(e) => setSenderEmail(e.target.value)}
            placeholder="Your Email"
            className="w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 outline-none"
            required
          />

          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Complaint Subject"
            className="w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 outline-none"
            required
          />

          <textarea
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="Describe the issue in detail..."
            className="w-full p-3 h-32 rounded-lg bg-gray-800 text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className={`bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg transition font-medium ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Sending..." : "Send Complaint Mail"}
          </button>
        </form>

      </div>
    </div>
  );
};

export default AIMail;
