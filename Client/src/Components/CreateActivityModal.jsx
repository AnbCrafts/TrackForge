import React, { useContext, useEffect, useState } from "react";
import { TrackForgeContextAPI } from "../ContextAPI/TrackForgeContextAPI";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, Calendar, ClipboardList, FileText, User } from "lucide-react";

export default function CreateActivityModal({ isOpen, onClose, ticketId, projectId }) {
  const { createActivity, getThisTicketActivities } = useContext(TrackForgeContextAPI);
  const userId = localStorage.getItem("userId");
  const [isLoading, setIsLoading] = useState(false);

  const [form, setForm] = useState({
    actionType: "",
    details: "",
    doneOn: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setForm({
        actionType: "",
        details: "",
        doneOn: new Date().toISOString().split("T")[0], // default to today
      });
      setErrors({});
    }
  }, [isOpen]);

  const validate = () => {
    const e = {};
    if (!form.actionType.trim()) e.actionType = "Action Type is required";
    if (!form.details.trim()) e.details = "Details are required";
    if (!form.doneOn.trim()) e.doneOn = "Date is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.warn("Please complete all required fields");
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        ticketId,
        performedBy: userId,
        performedOn: projectId || "",
        actionType: form.actionType,
        details: form.details,
        doneOn: form.doneOn,
      };

      await createActivity(payload);
      toast.success("Activity logged successfully!");
      
      // Refresh activities for this ticket
      if (ticketId) {
        await getThisTicketActivities(ticketId);
      }
      
      onClose();
    } catch (error) {
      console.error("Create activity error:", error);
      toast.error("Failed to create activity");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 20, opacity: 0 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="relative w-full max-w-md bg-card border border-default rounded-2xl shadow-2xl overflow-hidden z-10"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-default/20 bg-secondary/50">
              <div className="flex items-center gap-2">
                <ClipboardList className="h-5 w-5 text-neon" />
                <h3 className="text-lg font-bold text-primary">Log New Activity</h3>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-hover text-secondary hover:text-primary transition-all cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={submitHandler} className="p-6 space-y-4">
              {/* Action Type */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-secondary flex items-center gap-1.5">
                  <ClipboardList className="h-3.5 w-3.5 text-neon" /> Action Type
                </label>
                <input
                  value={form.actionType}
                  onChange={(e) => setForm((prev) => ({ ...prev, actionType: e.target.value }))}
                  type="text"
                  placeholder="e.g. Code Review, Testing, Debugged UI"
                  className={`outline-none focus:ring-2 focus:ring-[var(--border-neon)]/40 transition rounded-lg px-3 py-2 bg-secondary border text-primary text-sm ${
                    errors.actionType ? "border-red-400 focus:ring-red-400/40" : "border-default"
                  }`}
                />
                {errors.actionType && <span className="text-[10px] text-red-400">{errors.actionType}</span>}
              </div>

              {/* Done On (Date) */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-secondary flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-neon" /> Date Performed
                </label>
                <input
                  value={form.doneOn}
                  onChange={(e) => setForm((prev) => ({ ...prev, doneOn: e.target.value }))}
                  type="date"
                  className={`outline-none focus:ring-2 focus:ring-[var(--border-neon)]/40 transition rounded-lg px-3 py-2 bg-secondary border text-primary text-sm ${
                    errors.doneOn ? "border-red-400 focus:ring-red-400/40" : "border-default"
                  }`}
                />
                {errors.doneOn && <span className="text-[10px] text-red-400">{errors.doneOn}</span>}
              </div>

              {/* Details */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-secondary flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5 text-neon" /> Description Details
                </label>
                <textarea
                  rows={4}
                  value={form.details}
                  onChange={(e) => setForm((prev) => ({ ...prev, details: e.target.value }))}
                  placeholder="Provide brief details on what work was done..."
                  className={`outline-none focus:ring-2 focus:ring-[var(--border-neon)]/40 transition rounded-lg px-3 py-2 bg-secondary border text-primary text-sm resize-none ${
                    errors.details ? "border-red-400 focus:ring-red-400/40" : "border-default"
                  }`}
                />
                {errors.details && <span className="text-[10px] text-red-400">{errors.details}</span>}
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-default/20">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-secondary hover:bg-hover border border-default text-secondary hover:text-primary rounded-lg transition-all text-sm font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-5 py-2 btn-gradient text-white rounded-lg shadow-lg flex items-center gap-1.5 text-sm font-bold disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isLoading && <Loader2 className="animate-spin h-4 w-4" />}
                  <span>{isLoading ? "Logging..." : "Log Activity"}</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
