import React, { useState, useContext, useEffect } from "react";
import { TrackForgeContextAPI } from "../ContextAPI/TrackForgeContextAPI";
import { X, Sparkles, Send, Mail } from "lucide-react";

const AIMail = ({ isOpen, onClose }) => {
  const { sendComplaintMail, authUserData } = useContext(TrackForgeContextAPI);

  const [senderName, setSenderName] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [context, setContext] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiDraft, setAiDraft] = useState("");

  // Pre-fill user data when modal opens
  useEffect(() => {
    if (isOpen && authUserData) {
      setSenderName(`${authUserData.firstName || ""} ${authUserData.lastName || ""}`.trim());
      setSenderEmail(authUserData.email || "");
    }
  }, [isOpen, authUserData]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");
    setLoading(true);
    setAiDraft("");

    try {
      const res = await sendComplaintMail(senderName, senderEmail, subject, context);
      if (res.success) {
        setStatus("Complaint email generated and sent successfully!");
        setAiDraft(res.content);
        // Keep form input context so developer can view it, clear subject/message
        setSubject("");
        setContext("");
      } else {
        setStatus("Failed to send email. Check backend logs.");
      }
    } catch (err) {
      console.error(err);
      setStatus("Server error while sending email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-4xl bg-gray-950 border border-gray-800 rounded-2xl shadow-2xl p-6 md:p-8 space-y-6 relative max-h-[90vh] overflow-y-auto noScroll">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-gray-900 border border-gray-800 hover:border-purple-500/30 text-gray-400 hover:text-white transition cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Modal Header */}
        <div className="pb-4 border-b border-gray-900">
          <h2 className="text-xl md:text-2xl font-extrabold flex items-center gap-2 bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-500 bg-clip-text text-transparent">
            <Sparkles className="h-6 w-6 text-purple-400 animate-pulse" />
            AI-Assisted Help Desk
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Submit a complaint, feature request, or report a bug. Gemini AI will refine your inputs into a polished mail draft for review.
          </p>
        </div>

        {/* Dual Pane Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* Left Column: Description & Result */}
          <div className="flex flex-col justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3 bg-purple-500/5 border border-purple-500/10 p-4 rounded-xl">
                <Mail className="h-5 w-5 text-purple-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-gray-300">How it works:</h4>
                  <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">
                    Simply describe your issue in plain words. The Gemini AI engine generates a professional email draft and forwards it directly to the system administrators.
                  </p>
                </div>
              </div>

              {status && (
                <div className={`p-3 rounded-xl text-xs font-semibold ${status.includes("successfully") ? "bg-green-500/10 border border-green-500/20 text-green-400" : "bg-red-500/10 border border-red-500/20 text-red-400"}`}>
                  {status}
                </div>
              )}
            </div>

            {/* AI Generated Draft Box */}
            {aiDraft ? (
              <div className="flex-1 flex flex-col bg-gray-900/50 border border-purple-500/15 rounded-xl p-4 min-h-[160px] max-h-[300px] overflow-y-auto noScroll">
                <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <Sparkles size={11} className="animate-pulse" /> Generated Email Content
                </span>
                <p className="text-xs text-gray-300 font-mono leading-relaxed whitespace-pre-wrap flex-1 shadow-inner p-3 bg-gray-950/40 rounded-lg">
                  {aiDraft}
                </p>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center border border-dashed border-gray-800 rounded-xl p-8 min-h-[160px] text-center text-gray-500">
                <Mail size={32} className="text-gray-700 mb-2" />
                <p className="text-[11px]">Fill out the form and submit to preview the generated AI email.</p>
              </div>
            )}
          </div>

          {/* Right Column: Input Form */}
          <form onSubmit={handleSubmit} className="space-y-4 bg-gray-900/20 border border-gray-900 p-5 rounded-xl">
            {/* Sender Name */}
            <div>
              <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Your Name</label>
              <input
                required
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="e.g. Alice Smith"
                className="w-full outline-none border rounded-lg border-gray-800 focus:border-purple-500/50 px-3 py-2 bg-gray-950 text-white text-xs transition"
              />
            </div>

            {/* Sender Email */}
            <div>
              <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Your Email Address</label>
              <input
                required
                type="email"
                value={senderEmail}
                onChange={(e) => setSenderEmail(e.target.value)}
                placeholder="e.g. alice@example.com"
                className="w-full outline-none border rounded-lg border-gray-800 focus:border-purple-500/50 px-3 py-2 bg-gray-950 text-white text-xs transition"
              />
            </div>

            {/* Subject */}
            <div>
              <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Subject</label>
              <input
                required
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Cannot upload documents in chat"
                className="w-full outline-none border rounded-lg border-gray-800 focus:border-purple-500/50 px-3 py-2 bg-gray-950 text-white text-xs transition"
              />
            </div>

            {/* Message Context */}
            <div>
              <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Describe the issue</label>
              <textarea
                required
                rows={4}
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder="Type details about the issue or requested change in plain English..."
                className="w-full outline-none border rounded-lg border-gray-800 focus:border-purple-500/50 px-3 py-2 bg-gray-950 text-white text-xs transition resize-none"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-900">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-800 bg-gray-900 hover:bg-gray-800/80 rounded-lg text-gray-400 hover:text-white text-xs transition cursor-pointer"
              >
                Close
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:opacity-95 text-white rounded-lg text-xs font-bold shadow-md transition flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? (
                  <>
                    <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-3 w-3" />
                    <span>Send AI Complaint</span>
                  </>
                )}
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
};

export default AIMail;
