import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { TrackForgeContextAPI } from "../ContextAPI/TrackForgeContextAPI";
import { toast } from "react-toastify";
import {
  Text,
  ActivityIcon,
  AlertCircle,
  AlertTriangle,
  Calendar,
  CheckCircle,
  Clock,
  Copy,
  FileText,
  Hash,
  MessageSquare,
  MessageSquareOff,
  Send,
  User,
  AlignLeft,
  Flag,
  Flame,
} from "lucide-react";
import { CreateActivityForm } from "../Components/ActivityForm";

const ViewDetailedBug = () => {
  const { ticketId } = useParams();
  const {
    updateTicket,
    getSingleTicket,
    singleTicket,
    createActivity,
    getTicketComments,
    ticketComments,
    postComment,
    getThisTicketActivities,
    thisTicketActivities,
  } = useContext(TrackForgeContextAPI);

  const [currTickPage, setCurrTickPage] = useState(1);
  const [userId, setUserId] = useState(null);
  const [leftOpen, setLeftOpen] = useState(false);
  const [rightOpen, setRightOpen] = useState(false);

  const [activityForm, setActivityForm] = useState({
    actionType: "",
    ticketId: "",
    performedBy: "",
    performedOn: "",
    details: "",
    doneOn: "",
  });

  const [commentForm, setCommentForm] = useState({
    message: "",
    userId: "",
    projectId: "",
    ticket: "",
    type: "Text",
  });

  useEffect(() => {
    const uid = localStorage.getItem("userId");
    setUserId(uid);
  }, []);

  useEffect(() => {
    if (ticketId) {
      getSingleTicket(ticketId);
      getTicketComments(ticketId, currTickPage);
      getThisTicketActivities(ticketId);
    }
  }, [ticketId]);

  useEffect(() => {
    const tId = localStorage.getItem("currTicketId") || ticketId;
    const pId =
      localStorage.getItem("currProjectId") ||
      (singleTicket && singleTicket.project?._id);

    if (pId && tId) {
      setCommentForm((prev) => ({
        ...prev,
        projectId: pId,
        ticket: tId,
      }));
    }
  }, [ticketComments, singleTicket]);

  useEffect(() => {
    if (userId) {
      setActivityForm((prev) => ({
        ...prev,
        performedBy: userId,
      }));

      setCommentForm((prev) => ({
        ...prev,
        userId: userId,
      }));
    }
  }, [userId]);

  /** PRIORITY STYLES */
  const priorityStyles = {
    low: { className: "bg-yellow-100 text-yellow-800 border border-yellow-300", icon: Flag },
    medium: { className: "bg-yellow-200 text-yellow-900 border border-yellow-400", icon: AlertTriangle },
    high: { className: "bg-orange-200 text-orange-900 border border-orange-400", icon: Flame },
    critical: { className: "bg-red-200 text-red-900 border border-red-400", icon: AlertCircle },
  };

  const PriorityBadge = ({ priority }) => {
    const p = priorityStyles[priority?.toLowerCase()] || priorityStyles.low;
    const Icon = p.icon;
    return (
      <span className={`px-2 py-1 rounded flex items-center gap-1 text-sm ${p.className}`}>
        <Icon size={14} /> {priority}
      </span>
    );
  };

  const hideTicketID = (id) => {
    if (!id) return "";
    if (id.length <= 10) return id;
    return id.slice(0, 10) + "*".repeat(id.length - 10);
  };

  /** Copy helpers */
  const copyToClipboard = (value) => {
    if (!value) return toast.info("Nothing to copy");
    navigator.clipboard.writeText(value);
    toast.success("Copied to clipboard!");
  };

  /** Submit Activity */
  const submitActivity = async (e) => {
    e.preventDefault && e.preventDefault();

    const hasEmpty = Object.values(activityForm).some(
      (x) => x === "" || x === null || x === undefined
    );
    if (hasEmpty) return toast.warn("Please fill all fields!");

    await createActivity(activityForm);
    setActivityForm({
      actionType: "",
      ticketId: "",
      performedBy: userId,
      performedOn: "",
      details: "",
      doneOn: "",
    });
  };

  /** Submit Comment */
  const submitComment = async (e) => {
    e.preventDefault && e.preventDefault();
    const hasEmpty = Object.values(commentForm).some(
      (x) => x === "" || x === null || x === undefined
    );
    if (hasEmpty) return toast.warn("Please fill all fields!");

    await postComment(commentForm);

    setCommentForm((prev) => ({ ...prev, message: "" }));
  };

  /** Ticket expiry logic */
  useEffect(() => {
    if (!singleTicket?.validFor) return;
    const today = new Date();
    const expiry = new Date(singleTicket.validFor);
    today.setHours(0, 0, 0, 0);
    expiry.setHours(0, 0, 0, 0);

    if (expiry < today && singleTicket.status !== "Closed") {
      updateTicket(singleTicket._id, "Closed");
    }
  }, [singleTicket]);

  /** days left */
  const daysLeft = (() => {
    if (!singleTicket?.validFor) return null;
    const today = new Date();
    const expiry = new Date(singleTicket.validFor);
    today.setHours(0, 0, 0, 0);
    expiry.setHours(0, 0, 0, 0);
    return Math.round((expiry - today) / (1000 * 60 * 60 * 24));
  })();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* small animation style */}
      <style>{`
        @keyframes slideIn { from { transform: translateX(-100%);} to { transform: translateX(0);} }
        .animate-slideIn { animation: slideIn 0.22s ease-out; }
        @keyframes slideInRight { from { transform: translateX(100%);} to { transform: translateX(0);} }
        .animate-slideInRight { animation: slideInRight 0.22s ease-out; }
      `}</style>

      <div className="w-full min-h-screen bg-gray-100 flex">

        {/* LEFT SIDEBAR (desktop) */}
        <div className="w-[260px] bg-white border-r p-6 space-y-6 hidden md:block shadow-sm">
          <h1 className="text-xl font-semibold">Project</h1>

          <p className="text-xs text-gray-500 flex items-center gap-2">
            Project ID: {singleTicket?.project?._id}
            <button
              onClick={() => copyToClipboard(singleTicket?.project?._id)}
              className="px-2 py-0.5 text-xs bg-gray-100 hover:bg-gray-200 rounded border"
            >
              Copy
            </button>
          </p>

          <div className="pt-6 space-y-2 text-sm">
            <p className="uppercase text-gray-500 text-xs font-semibold">Sections</p>
            <p className="hover:text-blue-600 cursor-pointer">Overview</p>
            <p className="hover:text-blue-600 cursor-pointer">Activity</p>
            <p className="hover:text-blue-600 cursor-pointer">Comments</p>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="flex-1 p-6 md:p-10 space-y-10 overflow-y-auto">

          {/* MOBILE Header Controls */}
          <div className="md:hidden flex items-center justify-between mb-3">
            <button onClick={() => setLeftOpen(true)} className="px-3 py-1 bg-gray-200 rounded">
              Ticket
            </button>

            <div className="flex items-center gap-2">
              <button onClick={() => copyToClipboard(singleTicket?._id)} className="px-3 py-1 bg-gray-200 rounded">
                Copy ID
              </button>

              <button onClick={() => setRightOpen(true)} className="px-3 py-1 bg-gray-200 rounded">
                Info
              </button>
            </div>
          </div>

          {/* TITLE + STATUS */}
          <div className="bg-white p-6 rounded-xl shadow-md space-y-4 border border-gray-100">
            <h1 className="text-3xl font-semibold text-gray-800">{singleTicket?.title}</h1>

            <div className="flex items-center gap-3">
              <span
                className={`px-3 py-1 rounded-full text-white text-sm shadow-sm ${
                  singleTicket?.status === "Open"
                    ? "bg-green-600"
                    : singleTicket?.status === "Closed"
                    ? "bg-red-600"
                    : "bg-yellow-500"
                }`}
              >
                {singleTicket?.status}
              </span>

              <PriorityBadge priority={singleTicket?.priority} />
            </div>
          </div>

          {/* DESCRIPTION */}
          <div className="bg-white p-6 rounded-xl shadow-md space-y-4 border border-gray-100">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <FileText /> Description
            </h2>
            <p className="text-gray-700 leading-relaxed">{singleTicket?.description}</p>
          </div>

          {/* STEPS */}
          <div className="bg-white p-6 rounded-xl shadow-md space-y-4 border border-gray-100">
            <h2 className="text-xl font-semibold flex items-center gap-2 text-red-600">
              <AlertTriangle /> Steps to Reproduce
            </h2>

            <ul className="space-y-2 text-gray-700">
              {singleTicket?.stepsToReproduce?.map((s, i) => (
                <li key={i} className="flex items-start gap-3">
                  <AlignLeft className="text-gray-500" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* ACTIVITY LOG */}
          <div className="bg-white p-6 rounded-xl shadow-md space-y-4 border border-gray-100">
            <h2 className="text-xl font-semibold flex items-center gap-2 text-green-600">
              <CheckCircle /> Activity Log
            </h2>

            <div className="space-y-4">
              {thisTicketActivities?.map((a, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 bg-blue-600 rounded-full shadow-sm"></div>
                    {i !== thisTicketActivities.length - 1 && (
                      <div className="w-px flex-1 bg-gray-300" />
                    )}
                  </div>

                  <div className="flex-1 bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-semibold text-gray-800">{a.actionType}</div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Calendar size={14} /> {new Date(a.doneOn).toLocaleDateString()}
                      </div>
                    </div>

                    <p className="text-gray-700 text-sm mb-3">{a.details}</p>

                    <div className="flex items-center gap-2 text-gray-500 text-xs">
                      <User size={14} />
                      {a.performedBy?.username}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* COMMENTS */}
          <div className="bg-white p-6 rounded-xl shadow-md space-y-4 border border-gray-100">
            <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-700">
              <MessageSquare /> Comments
            </h2>

            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
              {ticketComments?.comments?.length ? (
                ticketComments.comments.map((c) => (
                  <div
                    key={c._id}
                    className="p-4 rounded-lg bg-gray-50 border border-gray-200 shadow-sm hover:shadow transition"
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-gray-800">{c.message}</p>
                      <span className="text-xs text-gray-500">
                        {new Date(c.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">— {c.userId?.username}</p>
                  </div>
                ))
              ) : (
                <div className="flex items-center gap-2 bg-gray-100 p-3 rounded text-gray-500">
                  <MessageSquareOff size={18} />
                  <span>No comments yet.</span>
                </div>
              )}
            </div>

            {/* COMMENT FORM */}
            <form onSubmit={submitComment} className="space-y-3">
              <input
                value={commentForm.message}
                onChange={(e) =>
                  setCommentForm((prev) => ({
                    ...prev,
                    message: e.target.value,
                  }))
                }
                className="w-full p-3 rounded-lg border border-gray-200 bg-white"
                placeholder="Type a comment..."
              />

              <div className="flex items-center gap-3">
                <select
                  className="border rounded px-3 py-1"
                  value={commentForm.type}
                  onChange={(e) =>
                    setCommentForm((prev) => ({
                      ...prev,
                      type: e.target.value,
                    }))
                  }
                >
                  <option>Text</option>
                  <option>Status Change</option>
                  <option>System</option>
                </select>

                <button className="ml-auto flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded">
                  <Send size={16} />
                  Send
                </button>
              </div>
            </form>
          </div>

          {/* Activity Form */}
          
        </div>


        

        {/* RIGHT SIDEBAR (desktop) */}
        <div className="w-[300px] bg-white border-l p-6 space-y-6 hidden lg:block">
          <h3 className="text-lg font-semibold text-gray-800">Issue Info</h3>

          <div className="space-y-2 text-sm">
            <p className="flex items-center flex-wrap gap-2 text-gray-600">
              <Hash size={14} /> Ticket:
              <span className="font-medium ml-1">{singleTicket?._id}</span>

              <button
                onClick={() => copyToClipboard(singleTicket?._id)}
                className="ml-2 px-2 py-0.5 text-xs bg-gray-100 hover:bg-gray-200 rounded border"
              >
                Copy
              </button>
            </p>

            <p className="flex items-center gap-2 text-gray-600">
              <User size={14} /> Issued By: {singleTicket?.giver?.username}
            </p>

            <p className="flex items-center gap-2 text-gray-600">
              <Calendar size={14} /> Assigned On:{" "}
              {singleTicket ? new Date(singleTicket.assignedOn).toLocaleDateString() : ""}
            </p>

            <div className="mt-4">
              {daysLeft === 0 && (
                <div className="p-2 bg-red-100 text-red-700 rounded flex gap-2 text-sm">
                  <AlertTriangle size={16} /> Expires Today
                </div>
              )}
              {daysLeft === 1 && (
                <div className="p-2 bg-yellow-100 text-yellow-700 rounded flex gap-2 text-sm">
                  <Clock size={16} /> Expires Tomorrow
                </div>
              )}
              {daysLeft > 1 && (
                <div className="p-2 bg-green-100 text-green-700 rounded flex gap-2 text-sm">
                  <CheckCircle size={16} /> Valid for {daysLeft} days
                </div>
              )}
              {daysLeft < 0 && (
                <div className="p-2 bg-gray-200 text-gray-600 rounded flex gap-2 text-sm">
                  <AlertTriangle size={16} /> Ticket Expired
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="">

            <CreateActivityForm
              activityForm={activityForm}
              setActivityForm={setActivityForm}
              onSubmit={submitActivity}
              performedBy={userId}
              defaultTicketId={singleTicket?._id}
              projectId={singleTicket?.project?._id}
           
           />
          </div>

      {/* MOBILE LEFT SIDEBAR */}
      {leftOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setLeftOpen(false)}></div>
          <div className="fixed inset-y-0 left-0 w-[80%] max-w-xs bg-white z-50 p-6 shadow-xl rounded-r-xl animate-slideIn">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-lg">Ticket</h2>
              <button onClick={() => setLeftOpen(false)} className="px-3 py-1 rounded bg-gray-100">
                Close
              </button>
            </div>

            <p className="font-medium text-gray-700">{singleTicket?.title}</p>
            <p className="text-xs text-gray-500 flex items-center gap-2">
              Project ID: {singleTicket?.project?._id}
              <button
                onClick={() => copyToClipboard(singleTicket?.project?._id)}
                className="px-2 py-0.5 text-xs bg-gray-100 hover:bg-gray-200 rounded border"
              >
                Copy
              </button>
            </p>
          </div>
        </>
      )}

      {/* MOBILE RIGHT SIDEBAR */}
      {rightOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setRightOpen(false)}></div>

          <div className="fixed inset-y-0 right-0 w-[80%] max-w-xs bg-white z-50 p-6 shadow-xl rounded-l-xl animate-slideInRight">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-lg">Issue Info</h2>
              <button onClick={() => setRightOpen(false)} className="px-3 py-1 rounded bg-gray-100">
                Close
              </button>
            </div>

            <div className="space-y-2">
              <p className="flex items-center gap-2 text-gray-600">
                <Hash size={14} /> Ticket: {singleTicket?._id}
                <button
                  onClick={() => copyToClipboard(singleTicket?._id)}
                  className="px-2 py-0.5 text-xs bg-gray-100 hover:bg-gray-200 rounded border"
                >
                  Copy
                </button>
              </p>

              <p className="flex items-center gap-2 text-gray-600">
                <User size={14} /> {singleTicket?.giver?.username}
              </p>

              <p className="flex items-center gap-2 text-gray-600">
                <Calendar size={14} />{" "}
                {singleTicket ? new Date(singleTicket.assignedOn).toLocaleDateString() : ""}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ViewDetailedBug;
