import React, { useState, useEffect, useContext } from "react";
import { TrackForgeContextAPI } from "../ContextAPI/TrackForgeContextAPI";
import {
  AlertTriangle,
  Calendar,
  CheckCircle,
  Clock,
  FileText,
  MessageSquare,
  Send,
  Tag,
  User,
  AlignLeft,
} from "lucide-react";
import { toast } from "react-toastify";
import { PaginationControls } from "../Components/PaginationControls";
import { CreateActivityForm } from "../Components/ActivityForm";

export default function Bugs() {
  const {
    getUserTickets,
    userTickets,
    getTicketComments,
    ticketComments,
    postComment,
    createActivity,
    getThisTicketActivities,
    thisTicketActivities,
  } = useContext(TrackForgeContextAPI);

  const [currPage, setCurrPage] = useState(1);
  const [commentForm, setCommentForm] = useState({ message: "", type: "Text" });
  const [activityForm, setActivityForm] = useState({
    ticketId: "",
    actionType: "",
    performedBy: "",
    performedOn: "",
    details: "",
    doneOn: "",
  });

  const [leftOpen, setLeftOpen] = useState(false);
  const [rightOpen, setRightOpen] = useState(false);

  const [selectedTicketWrapper, setSelectedTicketWrapper] = useState(null);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (userId) getUserTickets(userId, currPage);
  }, [currPage, userId, getUserTickets]);

  useEffect(() => {
    if (!userTickets?.tickets) return;

    const currentSelectedId = selectedTicketWrapper?.raw?._id;
    const foundOnPage = userTickets.tickets.find(
      (t) => t.raw?._id === currentSelectedId
    );
    if (foundOnPage) {
      setSelectedTicketWrapper(foundOnPage);
      if (foundOnPage.raw?._id) {
        getTicketComments(foundOnPage.raw._id, 1);
        getThisTicketActivities(foundOnPage.raw._id);
        setActivityForm((p) => ({
          ...p,
          ticketId: foundOnPage.raw._id,
          performedBy: userId,
        }));
      }
      return;
    }

    const first = userTickets.tickets[0];
    if (first) {
      setSelectedTicketWrapper(first);
      if (first.raw?._id) {
        getTicketComments(first.raw._id, 1);
        getThisTicketActivities(first.raw._id);
        setActivityForm((p) => ({
          ...p,
          ticketId: first.raw._id || "",
          performedBy: userId,
        }));
      }
    } else {
      setSelectedTicketWrapper(null);
    }
  }, [
    userTickets,
    getTicketComments,
    getThisTicketActivities,
    selectedTicketWrapper,
    userId,
  ]);

  useEffect(() => {
    if (userId) {
      setActivityForm((prev) => ({ ...prev, performedBy: userId }));
    }
  }, [userId]);

  const ticket = selectedTicketWrapper?.raw;
  const project = selectedTicketWrapper?.project;

  const shortId = (id) =>
    id ? id.slice(0, 6) + "..." + id.slice(-4) : "-";

  const copyID = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const daysLeft = (() => {
    if (!ticket?.validFor) return null;
    const today = new Date();
    const expiry = new Date(ticket.validFor);
    today.setHours(0, 0, 0, 0);
    expiry.setHours(0, 0, 0, 0);
    return Math.round(
      (expiry - today) / (1000 * 60 * 60 * 24)
    );
  })();

  const handleSelectTicket = (wrapper) => {
    if (!wrapper?.raw?._id) return;
    setSelectedTicketWrapper(wrapper);
    getTicketComments(wrapper.raw._id, 1);
    getThisTicketActivities(wrapper.raw._id);
    setActivityForm((p) => ({
      ...p,
      ticketId: wrapper.raw._id,
      performedBy: userId,
    }));
    setLeftOpen(false);
  };

  const submitComment = async (e) => {
    e.preventDefault();
    if (!ticket?._id) return toast.error("No ticket selected");
    await postComment({
      ...commentForm,
      userId,
      ticket: ticket._id,
      projectId: project?._id,
    });
    setCommentForm((prev) => ({ ...prev, message: "" }));
  };

  const submitActivity = async (e) => {
    if (e && typeof e.preventDefault === "function") e.preventDefault();
    if (!ticket?._id) return toast.error("No ticket selected");

    const payload = {
      ...activityForm,
      ticketId: activityForm.ticketId || ticket._id,
      performedBy: activityForm.performedBy || userId,
    };

    await createActivity(payload);

    setActivityForm({
      ticketId: ticket._id,
      actionType: "",
      performedBy: userId,
      performedOn: "",
      details: "",
      doneOn: "",
    });

    getThisTicketActivities(ticket._id);
  };

  return (
    <div className="bg-white">
      <div className="w-full min-h-screen bg-[#faf9ff] flex">

        {/* LEFT SIDEBAR */}
        <div className="w-[320px] bg-white border-r border-purple-100 p-6 space-y-6 hidden md:block overflow-y-auto shadow-sm">
          <h1 className="text-xl font-semibold text-purple-700">Project</h1>
          <p className="font-medium text-gray-800">{project?.name}</p>

          <p className="text-xs text-gray-500 flex items-center gap-2">
            Project ID: {project?._id ? shortId(project._id) : "-"}
            <button
              onClick={() => copyID(project?._id)}
              className="px-2 py-0.5 text-xs bg-purple-100 text-purple-700 rounded"
            >
              Copy
            </button>
          </p>

          <div className="pt-6 space-y-2">
            <p className="text-purple-500 uppercase text-xs font-semibold">
              Tickets (page {currPage})
            </p>

            <div className="space-y-1 max-h-[60vh] overflow-y-auto pr-2">
              {userTickets?.tickets?.length ? (
                userTickets.tickets.map((w) => {
                  const t = w?.raw;
                  const isSelected = t?._id === ticket?._id;
                  return (
                    <button
                      key={t?._id || Math.random()}
                      onClick={() => handleSelectTicket(w)}
                      className={`w-full text-left px-3 py-2 rounded flex items-center justify-between transition ${
                        isSelected
                          ? "bg-purple-50 border border-purple-200"
                          : "hover:bg-purple-50"
                      }`}
                    >
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-800 truncate">
                          {t?.title || "Untitled"}
                        </div>
                        <div className="text-xs text-gray-500 flex items-center gap-2">
                          <span>{t?._id ? shortId(t._id) : "-"}</span>
                          <span>•</span>
                          <span>{t?.status}</span>
                        </div>
                      </div>
                      <div className="ml-3 text-xs text-gray-400">
                        #{w?.index || "-"}
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="text-xs text-gray-500">
                  No tickets on this page.
                </div>
              )}
            </div>

            <div className="pt-4">
              <PaginationControls
                currPage={currPage}
                setCurrPage={setCurrPage}
                totalPages={userTickets?.totalPages || 1}
              />
            </div>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="flex-1 p-6 md:p-10 space-y-10 overflow-y-auto relative">

          {/* MOBILE HEADER BUTTONS */}
          <div className="flex items-center justify-between md:hidden mb-2">
            <button
              onClick={() => setLeftOpen(true)}
              className="px-3 py-1 bg-purple-100 text-purple-700 rounded shadow"
            >
              Project
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (!ticket) return toast.info("No ticket selected");
                  copyID(ticket?._id || "");
                }}
                className="px-3 py-1 bg-purple-100 text-purple-700 rounded shadow"
              >
                Copy ID
              </button>

              <button
                onClick={() => setRightOpen(true)}
                className="px-3 py-1 bg-purple-100 text-purple-700 rounded shadow"
              >
                Info
              </button>
            </div>
          </div>

          {/* TITLE BOX */}
          <div className="bg-white p-6 rounded-lg shadow border border-purple-100 space-y-4">
            <h1 className="text-3xl font-semibold text-purple-700">
              {ticket?.title || "Select a ticket"}
            </h1>

            <div className="flex items-center gap-3">
              <span
                className={`px-3 py-1 text-sm rounded text-white ${
                  ticket?.status === "Open"
                    ? "bg-purple-600"
                    : ticket?.status === "Closed"
                    ? "bg-purple-900"
                    : "bg-purple-400"
                }`}
              >
                {ticket?.status || "-"}
              </span>

              <span className="flex items-center gap-2 px-3 py-1 bg-purple-50 rounded border text-sm text-purple-700 border-purple-200">
                <Tag size={16} /> {ticket?.priority || "-"}
              </span>
            </div>
          </div>

          {/* DESCRIPTION */}
          <div className="bg-white p-6 rounded-lg shadow border border-purple-100 space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2 text-purple-700">
              <FileText /> Description
            </h2>
            <p className="text-gray-700 text-[15px] leading-relaxed">
              {ticket?.description || "No ticket selected."}
            </p>
          </div>

          {/* STEPS */}
          <div className="bg-white p-6 rounded-lg shadow border border-purple-100 space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2 text-purple-700">
              <AlertTriangle /> Steps to Reproduce
            </h2>
            <ul className="space-y-2 text-gray-700">
              {ticket?.stepsToReproduce?.length ? (
                ticket.stepsToReproduce.map((s, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <AlignLeft className="text-purple-400" /> {s}
                  </li>
                ))
              ) : (
                <li className="text-gray-500">No steps provided.</li>
              )}
            </ul>
          </div>

          {/* ACTIVITY LOG */}
          <div className="bg-white p-6 rounded-lg shadow border border-purple-100 space-y-6">
            <h2 className="text-xl font-semibold flex items-center gap-2 text-purple-700">
              <CheckCircle /> Activity Log
            </h2>

            {thisTicketActivities?.length ? (
              thisTicketActivities.map((a, i) => (
                <div
                  key={a._id || i}
                  className="flex items-start gap-4"
                >
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
                    {i !== thisTicketActivities.length - 1 && (
                      <div className="w-px flex-1 bg-purple-200"></div>
                    )}
                  </div>

                  <div className="flex-1 bg-purple-50 p-4 rounded border border-purple-200">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-purple-800 font-semibold">
                        {a.actionType}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Calendar size={14} />{" "}
                        {new Date(a.doneOn).toLocaleDateString()}
                      </div>
                    </div>

                    <p className="text-gray-700 text-sm mb-3">
                      {a.details}
                    </p>

                    <div className="flex items-center gap-2 text-gray-500 text-xs">
                      <User size={14} /> {a.performedBy?.username}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-sm text-gray-500">
                No activities for this ticket.
              </div>
            )}
          </div>

          {/* COMMENTS */}
          <div className="bg-white p-6 rounded-lg shadow border border-purple-100 space-y-6">
            <h2 className="text-lg font-semibold flex items-center gap-2 text-purple-700">
              <MessageSquare /> Comments
            </h2>

            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
              {ticketComments?.comments?.length ? (
                ticketComments.comments.map((c) => (
                  <div
                    key={c._id}
                    className="p-3 bg-purple-50 border border-purple-200 rounded"
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-gray-800">
                        {c.message}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(c.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <p className="text-xs text-purple-600 mt-1">
                      — {c?.userId?.username}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-sm text-gray-500">
                  No comments yet.
                </div>
              )}
            </div>

            <form onSubmit={submitComment} className="space-y-3">
              <input
                value={commentForm.message}
                onChange={(e) =>
                  setCommentForm({
                    ...commentForm,
                    message: e.target.value,
                  })
                }
                placeholder="Type a comment..."
                className="w-full p-2 rounded border border-purple-200 focus:ring-2 focus:ring-purple-400"
              />

              <div className="flex items-center gap-3">
                <select
                  value={commentForm.type}
                  onChange={(e) =>
                    setCommentForm({
                      ...commentForm,
                      type: e.target.value,
                    })
                  }
                  className="border rounded px-3 py-1 text-sm border-purple-200"
                >
                  <option>Text</option>
                  <option>Status Change</option>
                  <option>System</option>
                </select>

                <button className="ml-auto flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition">
                  <Send size={16} /> Send
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="w-[320px] bg-white border-l border-purple-100 p-6 space-y-6 hidden lg:block shadow-sm">
          <h3 className="text-lg font-semibold text-purple-700">Issue Info</h3>

          {ticket?._id && (
            <p className="text-xs text-gray-600 flex items-center gap-2">
              Ticket ID: {ticket._id}
              <button
                onClick={() => copyID(ticket._id)}
                className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs"
              >
                Copy
              </button>
            </p>
          )}

          <div className="space-y-2 text-sm">
            <p className="flex items-center gap-2 text-gray-600">
              <Tag size={14} /> Priority:
              <span className="font-medium text-purple-700">
                {ticket?.priority}
              </span>
            </p>
            <p className="flex items-center gap-2 text-gray-600">
              <User size={14} /> Issued by: {ticket?.giver?.username}
            </p>
            <p className="flex items-center gap-2 text-gray-600">
              <Calendar size={14} /> Assigned On:
              {ticket
                ? new Date(ticket?.assignedOn).toLocaleDateString()
                : ""}
            </p>

            <div className="mt-4">
              {daysLeft === 0 && (
                <div className="p-2 bg-purple-100 text-purple-700 rounded flex items-center gap-2 text-sm">
                  <AlertTriangle size={16} /> Ticket expires today!
                </div>
              )}
              {daysLeft === 1 && (
                <div className="p-2 bg-purple-200 text-purple-800 rounded flex items-center gap-2 text-sm">
                  <Clock size={16} /> Expires tomorrow
                </div>
              )}
              {daysLeft > 1 && (
                <div className="p-2 bg-purple-50 text-purple-700 rounded flex items-center gap-2 text-sm">
                  <CheckCircle size={16} /> Valid for {daysLeft} days
                </div>
              )}
              {daysLeft < 0 && (
                <div className="p-2 bg-purple-50 text-purple-500 rounded flex items-center gap-2 text-sm">
                  <AlertTriangle size={16} /> Ticket expired
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE LEFT SLIDEOVER */}
      {leftOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50"
            onClick={() => setLeftOpen(false)}
          ></div>
          <div className="fixed inset-y-0 left-0 z-50 w-[80%] max-w-xs bg-white shadow-xl p-6 border-r border-purple-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-purple-700">Project</h2>
              <button
                onClick={() => setLeftOpen(false)}
                className="px-2 py-1 rounded bg-purple-100 text-purple-700"
              >
                Close
              </button>
            </div>

            <p className="font-medium text-gray-800">{project?.name}</p>
            <p className="text-xs text-gray-500 flex items-center gap-2">
              Project ID: {project?._id}
              <button
                onClick={() => copyID(project?._id)}
                className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs"
              >
                Copy
              </button>
            </p>

            <div className="pt-6 space-y-2">
              <p className="text-purple-500 uppercase text-xs font-semibold">
                Tickets
              </p>
              <div className="space-y-1 max-h-[60vh] overflow-y-auto pr-2">
                {userTickets?.tickets?.map((w) => {
                  const t = w?.raw;
                  return (
                    <button
                      key={t?._id}
                      onClick={() => handleSelectTicket(w)}
                      className="w-full text-left px-3 py-2 rounded hover:bg-purple-50 transition"
                    >
                      <div className="text-sm font-medium text-gray-800 truncate">
                        {t?.title}
                      </div>
                      <div className="text-xs text-gray-500">
                        {t?._id ? shortId(t._id) : "-"}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}

      {/* MOBILE RIGHT SLIDEOVER */}
      {rightOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50"
            onClick={() => setRightOpen(false)}
          ></div>
          <div className="fixed inset-y-0 right-0 z-50 w-[80%] max-w-xs bg-white shadow-xl p-6 border-l border-purple-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-purple-700">Issue Info</h2>
              <button
                onClick={() => setRightOpen(false)}
                className="px-2 py-1 rounded bg-purple-100 text-purple-700"
              >
                Close
              </button>
            </div>

            {ticket?._id && (
              <p className="text-xs text-gray-600 flex items-center gap-2">
                Ticket ID: {ticket._id}
                <button
                  onClick={() => copyID(ticket._id)}
                  className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs"
                >
                  Copy
                </button>
              </p>
            )}

            <div className="space-y-2 text-sm">
              <p className="flex items-center gap-2 text-gray-600">
                <Tag size={14} /> Priority:
                <span className="font-medium text-purple-700">
                  {ticket?.priority}
                </span>
              </p>
              <p className="flex items-center gap-2 text-gray-600">
                <User size={14} /> Issued by: {ticket?.giver?.username}
              </p>
              <p className="flex items-center gap-2 text-gray-600">
                <Calendar size={14} /> Assigned On:
                {ticket
                  ? new Date(ticket?.assignedOn).toLocaleDateString()
                  : ""}
              </p>

              <div className="mt-4">
                {daysLeft === 0 && (
                  <div className="p-2 bg-purple-100 text-purple-700 rounded flex items-center gap-2 text-sm">
                    <AlertTriangle size={16} /> Ticket expires today!
                  </div>
                )}
                {daysLeft === 1 && (
                  <div className="p-2 bg-purple-200 text-purple-800 rounded flex items-center gap-2 text-sm">
                    <Clock size={16} /> Expires tomorrow
                  </div>
                )}
                {daysLeft > 1 && (
                  <div className="p-2 bg-purple-50 text-purple-700 rounded flex items-center gap-2 text-sm">
                    <CheckCircle size={16} /> Valid for {daysLeft} days
                  </div>
                )}
                {daysLeft < 0 && (
                  <div className="p-2 bg-purple-50 text-purple-500 rounded flex items-center gap-2 text-sm">
                    <AlertTriangle size={16} /> Ticket expired
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* ACTIVITY FORM */}
      <CreateActivityForm
        activityForm={activityForm}
        setActivityForm={setActivityForm}
        onSubmit={submitActivity}
        performedBy={userId}
        defaultTicketId={ticket?._id}
        projectId={project?._id}
      />
    </div>
  );
}
