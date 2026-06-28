import { ActivityIcon, Calendar, Copy, FileText, Folder, Hash, User } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export function CreateActivityForm({
  activityForm = {},
  setActivityForm = () => {},
  onSubmit = () => {},
  performedBy,
  defaultTicketId = "",
  projectId = "",
  className = "",
}) {
  const safeForm = {
    ticketId: activityForm.ticketId || "",
    actionType: activityForm.actionType || "",
    performedBy: activityForm.performedBy || "",
    performedOn: activityForm.performedOn || "",
    details: activityForm.details || "",
    doneOn: activityForm.doneOn || "",
  };

  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const storedUser = localStorage.getItem("userId") || performedBy || "";

    if (storedUser && safeForm.performedBy !== storedUser) {
      setActivityForm((prev) => ({ ...prev, performedBy: storedUser }));
    }

    if (defaultTicketId && safeForm.ticketId !== defaultTicketId) {
      setActivityForm((prev) => ({ ...prev, ticketId: defaultTicketId }));
    }
  }, [performedBy, defaultTicketId]);

  function validate() {
    const required = ["ticketId", "actionType", "performedBy", "details", "doneOn"];
    const e = {};

    required.forEach((key) => {
      if (!safeForm[key]?.trim()) e[key] = "Required";
    });

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e) {
    e?.preventDefault?.();

    if (!validate()) {
      toast.warn("Please fill all fields before submitting!");
      return;
    }

    try {
      setSubmitting(true);

      if (typeof onSubmit === "function") {
        if (onSubmit.length >= 1) {
          const syntheticEvent = {
            preventDefault: () => {},
            formData: safeForm,
            ...safeForm,
          };
          await onSubmit(syntheticEvent);
        } else {
          await onSubmit(safeForm);
        }
      } else {
        throw new Error("onSubmit is not a function");
      }

      toast.success("Activity created!");

      setActivityForm({
        ticketId: safeForm.ticketId || defaultTicketId || "",
        actionType: "",
        performedBy: safeForm.performedBy || "",
        performedOn: "",
        details: "",
        doneOn: "",
      });

      setErrors({});
    } catch (err) {
      console.error("CreateActivityForm handleSubmit error:", err);
      toast.error("Failed to create activity");
    } finally {
      setSubmitting(false);
    }
  }

  const copyProjectId = async () => {
    if (!projectId) return toast.info("No project id available");
    try {
      await navigator.clipboard.writeText(projectId);
      toast.success("Project ID copied");
    } catch {
      toast.error("Copy failed");
    }
  };

  return (
    <div className={`p-6 mt-10 border border-default bg-card rounded-2xl shadow-xl backdrop-blur-md ${className}`}>
      <h1 className="text-2xl text-primary font-semibold mb-5">Create an Activity</h1>

      <form
        onSubmit={handleSubmit}
        className="p-6 bg-secondary/20 rounded-2xl text-primary space-y-6 border border-default"
      >
        {/* Ticket ID */}
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <label
            htmlFor="ticketId"
            className="flex items-center gap-2 text-primary w-full sm:w-40 font-medium text-sm"
          >
            <Hash className="text-neon bg-neon/10 border border-neon/20 h-8 w-8 p-1.5 rounded-lg shadow-sm" />
            Ticket ID
          </label>

          <div className="w-full">
            <input
              id="ticketId"
              type="text"
              value={safeForm.ticketId}
              onChange={(e) => setActivityForm((prev) => ({ ...prev, ticketId: e.target.value }))}
              className={`outline-none rounded-xl p-2.5 w-full bg-secondary border ${
                errors.ticketId ? "border-red-500" : "border-default"
              } text-primary focus:ring-1 focus:ring-neon`}
            />

            {safeForm.ticketId && (
              <div className="mt-2 text-xs text-secondary flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(safeForm.ticketId);
                    toast.success("Ticket ID copied");
                  }}
                  className="inline-flex items-center gap-2 text-xs px-2.5 py-1 bg-secondary hover:bg-hover border border-default rounded-lg text-primary transition-all cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5 text-secondary" /> Copy
                </button>

                {projectId && (
                  <button
                    type="button"
                    onClick={copyProjectId}
                    className="text-xs underline text-neon hover:text-neon/80 cursor-pointer"
                  >
                    Copy project ID
                  </button>
                )}
              </div>
            )}

            {errors.ticketId && <div className="text-xs text-red-500 mt-1">{errors.ticketId}</div>}
          </div>
        </div>

        {/* Action Type */}
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <label className="flex items-center gap-2 text-primary w-full sm:w-40 font-medium text-sm">
            <ActivityIcon className="text-neon bg-neon/10 border border-neon/20 h-8 w-8 p-1.5 rounded-lg shadow-sm" />
            Action Type
          </label>

          <div className="w-full">
            <input
              type="text"
              value={safeForm.actionType}
              onChange={(e) => setActivityForm((prev) => ({ ...prev, actionType: e.target.value }))}
              className={`outline-none rounded-xl p-2.5 w-full bg-secondary border ${
                errors.actionType ? "border-red-500" : "border-default"
              } text-primary focus:ring-1 focus:ring-neon`}
              placeholder="e.g. Status Update"
            />
            {errors.actionType && <div className="text-xs text-red-500 mt-1">{errors.actionType}</div>}
          </div>
        </div>

        {/* Performed By */}
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <label className="flex items-center gap-2 text-primary w-full sm:w-40 font-medium text-sm">
            <User className="text-neon bg-neon/10 border border-neon/20 h-8 w-8 p-1.5 rounded-lg shadow-sm" />
            Performed By
          </label>

          <div className="w-full">
            <input
              readOnly
              value={safeForm.performedBy}
              className="outline-none rounded-xl p-2.5 w-full bg-secondary/50 border border-default text-secondary cursor-not-allowed"
            />
            {errors.performedBy && <div className="text-xs text-red-500 mt-1">{errors.performedBy}</div>}
          </div>
        </div>

        {/* Performed On */}
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <label className="flex items-center gap-2 text-primary w-full sm:w-40 font-medium text-sm">
            <Folder className="text-neon bg-neon/10 border border-neon/20 h-8 w-8 p-1.5 rounded-lg shadow-sm" />
            Performed On
          </label>

          <div className="w-full">
            <input
              type="text"
              value={safeForm.performedOn}
              onChange={(e) => setActivityForm((prev) => ({ ...prev, performedOn: e.target.value }))}
              placeholder="Copy project ID"
              className="outline-none rounded-xl p-2.5 w-full bg-secondary border border-default text-primary focus:ring-1 focus:ring-neon"
            />
          </div>
        </div>

        {/* Details */}
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <label className="flex items-center gap-2 text-primary w-full sm:w-40 font-medium text-sm">
            <FileText className="text-neon bg-neon/10 border border-neon/20 h-8 w-8 p-1.5 rounded-lg shadow-sm" />
            Details
          </label>

          <div className="w-full">
            <textarea
              value={safeForm.details}
              onChange={(e) => setActivityForm((prev) => ({ ...prev, details: e.target.value }))}
              placeholder="Describe the activity…"
              className={`outline-none rounded-xl p-3 w-full bg-secondary border ${
                errors.details ? "border-red-500" : "border-default"
              } text-primary focus:ring-1 focus:ring-neon resize-none h-48`}
            />
            {errors.details && <div className="text-xs text-red-500 mt-1">{errors.details}</div>}
          </div>
        </div>

        {/* Done On */}
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <label className="flex items-center gap-2 text-primary w-full sm:w-40 font-medium text-sm">
            <Calendar className="text-neon bg-neon/10 border border-neon/20 h-8 w-8 p-1.5 rounded-lg shadow-sm" />
            Done On
          </label>

          <div className="w-full">
            <input
              type="date"
              value={safeForm.doneOn}
              onChange={(e) => setActivityForm((prev) => ({ ...prev, doneOn: e.target.value }))}
              className={`outline-none rounded-xl p-2.5 w-full bg-secondary border ${
                errors.doneOn ? "border-red-500" : "border-default"
              } text-primary focus:ring-1 focus:ring-neon`}
            />
            {errors.doneOn && <div className="text-xs text-red-500 mt-1">{errors.doneOn}</div>}
          </div>
        </div>

        {/* Submit */}
        <div className="w-fit mx-auto my-4">
          <button
            type="submit"
            disabled={submitting}
            className={`px-6 py-2.5 rounded-xl shadow-lg font-bold transition-all text-xs ${
              submitting
                ? "bg-secondary text-secondary cursor-not-allowed opacity-50"
                : "btn-gradient text-white hover:scale-[1.02] active:scale-95 cursor-pointer"
            }`}
          >
            {submitting ? "Creating..." : "Create Activity"}
          </button>
        </div>
      </form>
    </div>
  );
}
