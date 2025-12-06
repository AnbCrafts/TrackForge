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
    <div className={`p-5 mt-10 border border-purple-200 bg-white rounded-xl shadow-sm ${className}`}>
      <h1 className="text-2xl text-purple-700 font-semibold mb-5">Create an Activity</h1>

      <form
        onSubmit={handleSubmit}
        className="p-5 bg-white rounded-xl shadow-md text-gray-900 space-y-6 border border-purple-100"
      >
        {/* Ticket ID */}
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <label
            htmlFor="ticketId"
            className="flex items-center gap-2 text-purple-700 w-full sm:w-40"
          >
            <Hash className="bg-purple-600 text-white h-8 w-8 p-1 rounded-lg shadow" />
            Ticket ID
          </label>

          <div className="w-full">
            <input
              id="ticketId"
              type="text"
              value={safeForm.ticketId}
              onChange={(e) => setActivityForm((prev) => ({ ...prev, ticketId: e.target.value }))}
              className={`outline-none rounded-lg p-2 w-full bg-purple-50 border ${
                errors.ticketId ? "border-red-400" : "border-purple-200"
              } focus:ring-2 focus:ring-purple-400`}
            />

            {safeForm.ticketId && (
              <div className="mt-2 text-xs text-purple-600 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(safeForm.ticketId);
                    toast.success("Ticket ID copied");
                  }}
                  className="inline-flex items-center gap-2 text-sm px-2 py-1 bg-purple-100 rounded-lg hover:bg-purple-200 transition"
                >
                  <Copy className="w-3 h-3" /> Copy
                </button>

                {projectId && (
                  <button
                    type="button"
                    onClick={copyProjectId}
                    className="text-sm underline text-purple-700 hover:text-purple-900"
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
          <label className="flex items-center gap-2 text-purple-700 w-full sm:w-40">
            <ActivityIcon className="bg-purple-600 text-white h-8 w-8 p-1 rounded-lg shadow" />
            Action Type
          </label>

          <div className="w-full">
            <input
              type="text"
              value={safeForm.actionType}
              onChange={(e) => setActivityForm((prev) => ({ ...prev, actionType: e.target.value }))}
              className={`outline-none rounded-lg p-2 w-full bg-purple-50 border ${
                errors.actionType ? "border-red-400" : "border-purple-200"
              } focus:ring-2 focus:ring-purple-400`}
              placeholder="e.g. Status Update"
            />
            {errors.actionType && <div className="text-xs text-red-500 mt-1">{errors.actionType}</div>}
          </div>
        </div>

        {/* Performed By */}
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <label className="flex items-center gap-2 text-purple-700 w-full sm:w-40">
            <User className="bg-purple-600 text-white h-8 w-8 p-1 rounded-lg shadow" />
            Performed By
          </label>

          <div className="w-full">
            <input
              readOnly
              value={safeForm.performedBy}
              className="outline-none rounded-lg p-2 w-full bg-purple-100 border border-purple-200 cursor-not-allowed"
            />
            {errors.performedBy && <div className="text-xs text-red-500 mt-1">{errors.performedBy}</div>}
          </div>
        </div>

        {/* Performed On */}
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <label className="flex items-center gap-2 text-purple-700 w-full sm:w-40">
            <Folder className="bg-purple-600 text-white h-8 w-8 p-1 rounded-lg shadow" />
            Performed On
          </label>

          <div className="w-full">
            <input
              type="text"
              value={safeForm.performedOn}
              onChange={(e) => setActivityForm((prev) => ({ ...prev, performedOn: e.target.value }))}
              placeholder="Copy project ID"
              className="outline-none rounded-lg p-2 w-full bg-purple-50 border border-purple-200 focus:ring-2 focus:ring-purple-400"
            />
          </div>
        </div>

        {/* Details */}
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <label className="flex items-center gap-2 text-purple-700 w-full sm:w-40">
            <FileText className="bg-purple-600 text-white h-8 w-8 p-1 rounded-lg shadow" />
            Details
          </label>

          <div className="w-full">
            <textarea
              value={safeForm.details}
              onChange={(e) => setActivityForm((prev) => ({ ...prev, details: e.target.value }))}
              placeholder="Describe the activity…"
              className={`outline-none rounded-lg p-3 w-full bg-purple-50 border ${
                errors.details ? "border-red-400" : "border-purple-200"
              } focus:ring-2 focus:ring-purple-400 resize-none h-48`}
            />
            {errors.details && <div className="text-xs text-red-500 mt-1">{errors.details}</div>}
          </div>
        </div>

        {/* Done On */}
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <label className="flex items-center gap-2 text-purple-700 w-full sm:w-40">
            <Calendar className="bg-purple-600 text-white h-8 w-8 p-1 rounded-lg shadow" />
            Done On
          </label>

          <div className="w-full">
            <input
              type="date"
              value={safeForm.doneOn}
              onChange={(e) => setActivityForm((prev) => ({ ...prev, doneOn: e.target.value }))}
              className={`outline-none rounded-lg p-2 w-full bg-purple-50 border ${
                errors.doneOn ? "border-red-400" : "border-purple-200"
              } focus:ring-2 focus:ring-purple-400`}
            />
            {errors.doneOn && <div className="text-xs text-red-500 mt-1">{errors.doneOn}</div>}
          </div>
        </div>

        {/* Submit */}
        <div className="w-fit mx-auto my-4">
          <button
            type="submit"
            disabled={submitting}
            className={`px-6 py-2 rounded-lg shadow-md border border-purple-300 transition-all font-medium ${
              submitting
                ? "bg-purple-200 text-purple-700 cursor-not-allowed"
                : "bg-purple-600 text-white hover:bg-purple-700 active:scale-95"
            }`}
          >
            {submitting ? "Creating..." : "Create Activity"}
          </button>
        </div>
      </form>
    </div>
  );
}
