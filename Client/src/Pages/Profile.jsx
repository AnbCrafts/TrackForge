import React, { useContext, useEffect, useState } from 'react';
import { TrackForgeContextAPI } from '../ContextAPI/TrackForgeContextAPI';
import { useParams } from 'react-router-dom';
import ProjectListPreview from '../Components/ProjectListPreview';
import TeamListPreview from '../Components/TeamListPreview';
import { toast } from 'react-toastify';
import { 
  AlertCircle, 
  AlertTriangle, 
  Calendar, 
  CheckCheck, 
  Flag, 
  Flame, 
  Send, 
  User, 
  Wrench, 
  FileText, 
  Folder, 
  ActivityIcon, 
  Hash, 
  MoveLeft, 
  MoveRight, 
  Trash, 
  Mail, 
  Users, 
  Layers, 
  Link2, 
  MessageSquareText, 
  PlusCircle, 
  Clock 
} from 'lucide-react';
import LinkGithubButton from '../Components/LinkGithubButton';

const Profile = () => {
  const {
    unLinkThisUserGithub,
    createActivity,
    postComment,
    authUserData,
    ticketComments,
    getUserDataById,
    userProjects,
    getUserProjects,
    userTeams,
    getUsersTeam,
    getUserAssignedTickets,
    userAssignedTickets,
    getTicketComments,
    deleteActivity,
    deleteTicket
  } = useContext(TrackForgeContextAPI);
  
  const [currTickPage, setCurrTickPage] = useState(1);
  const { hash } = useParams();

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      getUserProjects(userId);
      getUsersTeam(userId);
      getUserDataById(userId);
      getUserAssignedTickets(userId, currTickPage);
    }
  }, [hash, currTickPage]);

  const [currPage, setCurrPage] = useState(1);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const id = localStorage.getItem("userId");
    if (id) {
      setUserId(id);
    }
  }, [hash]);

  const [activityForm, setActivityForm] = useState({
    actionType: "",
    ticketId: "",
    performedBy: "",
    performedOn: "",
    details: "",
    doneOn: ""
  });

  const [commentForm, setCommentForm] = useState({
    message: "",
    userId: "",
    projectId: "",
    ticket: "",
    type: "Text"
  });

  useEffect(() => {
    const tId = localStorage.getItem("currTicketId") || (userAssignedTickets && userAssignedTickets.tickets && userAssignedTickets.tickets[0] && userAssignedTickets.tickets[0].raw?._id);
    const pId = localStorage.getItem("currProjectId") || (userAssignedTickets && userAssignedTickets.tickets && userAssignedTickets.tickets[0] && userAssignedTickets.tickets[0].project?._id);
    if (pId && tId) { 
      getTicketComments(tId, currTickPage);
      setCommentForm((prev) => ({
        ...prev,
        projectId: pId,
        ticket: tId,
      }));
    }
  }, [userAssignedTickets, ticketComments]);

  useEffect(() => {
    const tId = localStorage.getItem("currTicketId");
    if (tId) {
      getTicketComments(tId, currTickPage);
    }
  }, [currPage]);

  const priorityStyles = {
    low: {
      className: "bg-green-500/10 text-green-500 border border-green-500/20 px-2.5 py-1 rounded-lg flex items-center gap-1.5 text-xs font-bold w-fit",
      icon: Flag,
    },
    medium: {
      className: "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 px-2.5 py-1 rounded-lg flex items-center gap-1.5 text-xs font-bold w-fit",
      icon: AlertTriangle,
    },
    high: {
      className: "bg-orange-500/10 text-orange-500 border border-orange-500/20 px-2.5 py-1 rounded-lg flex items-center gap-1.5 text-xs font-bold w-fit",
      icon: Flame,
    },
    critical: {
      className: "bg-red-500/10 text-red-500 border border-red-500/20 px-2.5 py-1 rounded-lg flex items-center gap-1.5 text-xs font-bold w-fit",
      icon: AlertCircle,
    },
  };

  function PriorityBadge({ priority }) {
    const p = priorityStyles[priority?.toLowerCase()] || priorityStyles.low;
    const Icon = p.icon;
    return (
      <span className={p.className}>
        <Icon size={12} />
        {priority}
      </span>
    );
  }

  useEffect(() => {
    if (userId) {
      setActivityForm(prev => ({
        ...prev,
        performedBy: userId || prev.performedBy,
      }));
      setCommentForm((prev) => ({
        ...prev,
        userId: userId,
      }));
    }
  }, [userAssignedTickets, userId, currPage]);

  const submitHandler = async (e) => {
    e.preventDefault();
    const hasEmptyField = Object.values(activityForm).some(
      value => value === "" || value === null || value === undefined
    );

    if (hasEmptyField) {
      toast.warn("Please fill all fields before submitting!");
      return;
    }

    await createActivity(activityForm);
    getUserAssignedTickets(userId, currTickPage);
    setActivityForm({
      actionType: "",
      ticketId: "",
      performedBy: userId,
      performedOn: "",
      details: "",
      doneOn: ""
    });
  };

  const submitCommentHandler = async (e) => {
    e.preventDefault();
    const hasEmptyField = Object.values(commentForm).some(
      value => value === "" || value === null || value === undefined
    );

    if (hasEmptyField) {
      toast.warn("Please write a comment!");
      return;
    }

    await postComment(commentForm);
    setCommentForm((prev) => ({
      ...prev,
      message: "",
    }));
  };

  return (
    <div className='p-6 min-h-screen bg-primary text-primary space-y-8 max-w-7xl mx-auto'>
      
      {/* 1. Header Profile Glass Card */}
      <div className="bg-card border border-default rounded-3xl shadow-xl p-6 md:p-8 backdrop-blur-md relative overflow-hidden transition-all hover:shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-neon/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start relative z-10">
          {/* Avatar Ring */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-br from-neon to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-75 transition duration-500"></div>
            <div className="relative rounded-2xl h-fit w-fit p-1 bg-secondary shadow-lg">
              <img 
                className="w-52 h-52 rounded-xl object-cover"
                src={authUserData?.picture || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=60"}
                alt="User Avatar"
              />
            </div>
          </div>

          {/* User Profile Details */}
          <div className="flex-1 space-y-5 text-center md:text-left w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-extrabold text-primary text-3xl leading-tight">
                  {authUserData?.firstName} {authUserData?.lastName}
                </h2>
                <p className="text-secondary text-sm font-medium">@{authUserData?.username}</p>
              </div>
              <span className="self-center sm:self-start px-4 py-1.5 bg-neon/15 border border-neon/30 text-neon rounded-full font-bold text-xs shadow-sm uppercase tracking-wider">
                {authUserData?.role}
              </span>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 py-2 border-t border-b border-default/20">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-neon" />
                <div className="text-left">
                  <p className="text-[10px] text-secondary uppercase font-bold tracking-wider">Email</p>
                  <p className="text-sm font-semibold text-primary truncate max-w-[200px]">{authUserData?.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Layers className="w-5 h-5 text-neon" />
                <div className="text-left">
                  <p className="text-[10px] text-secondary uppercase font-bold tracking-wider">Projects</p>
                  <p className="text-sm font-semibold text-primary">{authUserData?.manages?.length || 0} Managed</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-neon" />
                <div className="text-left">
                  <p className="text-[10px] text-secondary uppercase font-bold tracking-wider">Teams</p>
                  <p className="text-sm font-semibold text-primary">{authUserData?.teams?.length || 0} Joined</p>
                </div>
              </div>
            </div>

            {/* GitHub Linkage Info */}
            <div className="pt-2">
              {authUserData && authUserData.githubAccessToken === null ? (
                <LinkGithubButton />
              ) : (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-secondary/40 border border-default p-4 rounded-xl">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-sm font-semibold text-emerald-500">
                      GitHub Linked: <span className="underline font-bold">@{authUserData?.githubUsername}</span>
                    </span>
                  </div>
                  <button
                    onClick={unLinkThisUserGithub}
                    className="px-4 py-1.5 text-xs font-bold text-red-500 hover:text-white bg-red-500/10 hover:bg-red-500 border border-red-500/20 hover:border-transparent rounded-lg transition-all cursor-pointer"
                  >
                    Unlink Account
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Ticket assigned by me Section */}
      <div className="bg-card border border-default rounded-3xl p-6 md:p-8 shadow-xl">
        <h1 className="text-2xl font-extrabold text-primary mb-6 flex items-center gap-3">
          <Layers className="w-6 h-6 text-neon" />
          Tickets Assigned by Me
        </h1>

        <div className="space-y-6">
          {userAssignedTickets && userAssignedTickets.tickets && userAssignedTickets.tickets.length > 0 ? (
            userAssignedTickets.tickets.map((t) => (
              <div 
                key={t.raw._id}
                className="rounded-2xl border border-default bg-secondary/20 overflow-hidden shadow-sm hover:shadow-md transition-all"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-6 py-4 bg-secondary/80 border-b border-default text-primary">
                  <h3 className="text-lg font-bold flex items-center gap-2.5 truncate max-w-lg">
                    <Flag className="w-5 h-5 text-neon" />
                    {t.raw.title}
                  </h3>

                  {/* Priority & Status */}
                  <div className="flex items-center gap-3">
                    <PriorityBadge priority={t.raw.priority} />

                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${
                      t.raw.status === "Open"
                        ? "bg-sky-500/10 text-sky-500 border-sky-500/20"
                        : t.raw.status === "In Progress"
                        ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                        : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                    }`}>
                      {t.raw.status}
                    </span>

                    <button
                      onClick={() => deleteTicket(t.raw._id)}
                      className="p-1.5 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 hover:border-transparent rounded-lg transition-all cursor-pointer"
                      title="Delete Ticket"
                    >
                      <Trash className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Body */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
                  
                  {/* LEFT COLUMN: Meta Info */}
                  <div className="space-y-4 col-span-1">
                    <div className="bg-card p-4 rounded-xl border border-default shadow-sm space-y-3">
                      <h4 className="text-sm font-bold text-primary flex items-center gap-2">
                        <Hash className="w-4 h-4 text-neon" />
                        Ticket Meta
                      </h4>
                      <div className="text-xs text-secondary space-y-2">
                        <div className="flex justify-between">
                          <span>Assigned To:</span>
                          <span className="font-semibold text-primary">@{t.doer.username}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Project:</span>
                          <span className="font-semibold text-primary truncate max-w-[120px]">{t.project?.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Assigned On:</span>
                          <span className="font-semibold text-primary">{new Date(t.raw.assignedOn).toLocaleDateString()}</span>
                        </div>

                        {/* Validity Badge */}
                        <div className="mt-2 pt-2 border-t border-default/20">
                          {(() => {
                            if (!t.raw.validFor) return null;
                            const today = new Date();
                            const validForDate = new Date(t.raw.validFor);
                            today.setHours(0,0,0,0);
                            validForDate.setHours(0,0,0,0);
                            const diffDays = Math.round((validForDate - today) / (1000*3600*24));

                            if (diffDays < 0) {
                              return <span className="text-[10px] bg-red-500/15 border border-red-500/20 text-red-500 px-2 py-0.5 rounded-full font-bold">Expired</span>;
                            }
                            if (diffDays === 0) {
                              return <span className="text-[10px] bg-red-500/15 border border-red-500/20 text-red-500 px-2 py-0.5 rounded-full font-bold animate-pulse">Expires Today</span>;
                            }
                            if (diffDays === 1) {
                              return <span className="text-[10px] bg-amber-500/15 border border-amber-500/20 text-amber-500 px-2 py-0.5 rounded-full font-bold">Expires Tomorrow</span>;
                            }
                            return <span className="text-[10px] bg-emerald-500/15 border border-emerald-500/20 text-emerald-500 px-2 py-0.5 rounded-full font-bold">{diffDays} days left</span>;
                          })()}
                        </div>
                      </div>
                    </div>

                    {/* Steps to Reproduce */}
                    <div className="bg-card p-4 rounded-xl border border-default shadow-sm space-y-3">
                      <h4 className="text-sm font-bold text-red-500 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                        Steps to Reproduce
                      </h4>
                      <ul className="space-y-1.5 text-xs text-secondary">
                        {t.raw.stepsToReproduce?.map((s, i) => (
                          <li key={i} className="flex items-center gap-2 bg-secondary/40 p-2 rounded-lg border border-default">
                            <Wrench className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            <span className="truncate">{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* MIDDLE COLUMN: Description & Activity Log */}
                  <div className="lg:col-span-1 bg-card p-5 rounded-xl border border-default shadow-sm space-y-6">
                    <div>
                      <h4 className="text-sm font-bold text-primary flex items-center gap-2 mb-2">
                        <FileText className="w-4 h-4 text-neon" />
                        Description
                      </h4>
                      <p className="text-xs text-secondary leading-relaxed bg-secondary/20 p-3 rounded-lg border border-default min-h-[80px]">
                        {t.raw.description}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-emerald-500 flex items-center gap-2 mb-3">
                        <CheckCheck className="w-4 h-4 text-emerald-500" />
                        Activity Log
                      </h4>
                      <div className="space-y-3 max-h-[160px] overflow-y-auto pr-1">
                        {t.raw.activityLog && t.raw.activityLog.length > 0 ? (
                          t.raw.activityLog.map((a) => (
                            <div key={a._id} className="p-3 bg-secondary/30 border border-default rounded-xl space-y-2 relative">
                              <p className="text-xs font-semibold text-primary">{a.details}</p>
                              <div className="flex items-center justify-between text-[10px] text-secondary">
                                <div className="flex items-center gap-1"><Calendar size={10} /> {new Date(a.doneOn).toDateString()}</div>
                                <div className="flex items-center gap-1"><User size={10} /> @{a.performedBy?.username}</div>
                              </div>
                              <button
                                onClick={() => deleteActivity(a._id, a.ticketId._id)}
                                className="absolute top-2 right-2 text-red-500 hover:text-red-700 p-0.5"
                                title="Delete Log"
                              >
                                <Trash className="w-3 h-3" />
                              </button>
                            </div>
                          ))
                        ) : (
                          <p className="text-xs text-secondary italic">No logs registered.</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* RIGHT COLUMN: Comments Thread */}
                  <div className="col-span-1 bg-card p-5 rounded-xl border border-default shadow-sm flex flex-col h-[280px]">
                    <h4 className="text-sm font-bold text-primary flex items-center gap-2 mb-3">
                      <MessageSquareText className="w-4 h-4 text-neon" />
                      Comments
                    </h4>

                    {/* Chat Messages Frame */}
                    <div className="flex-1 overflow-y-auto space-y-2 pr-1 text-xs">
                      {ticketComments?.comments?.length ? (
                        ticketComments.comments.map((c) => (
                          <div key={c._id} className="p-2 border border-default bg-secondary/20 rounded-lg">
                            <p className="font-semibold text-primary">{c.message}</p>
                            <p className="text-[9px] text-secondary mt-1">
                              by @{c.userId.username} • {new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        ))
                      ) : (
                        <p className="text-secondary italic text-center py-4">No comments found.</p>
                      )}
                    </div>

                    {/* Send Comment Field */}
                    <div className="mt-3 pt-3 border-t border-default/20 flex gap-2 items-center">
                      <input
                        type="text"
                        value={commentForm.message}
                        onChange={(e) => setCommentForm((prev) => ({ ...prev, message: e.target.value }))}
                        className="flex-1 outline-none rounded-lg px-3 py-1.5 bg-secondary border border-default text-primary text-xs focus:ring-1 focus:ring-[var(--border-neon)]/30"
                        placeholder="Write a comment..."
                      />
                      <Send
                        onClick={submitCommentHandler}
                        className="h-7 w-7 p-1.5 rounded-lg bg-neon hover:bg-neon/90 text-black cursor-pointer transition-all"
                      />
                    </div>
                  </div>

                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 bg-secondary/10 border border-default border-dashed rounded-xl">
              <Layers className="w-8 h-8 text-secondary/30 mx-auto mb-2" />
              <p className="text-sm text-secondary">No tickets assigned by you.</p>
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {userAssignedTickets && userAssignedTickets.totalPages > 1 && (
          <div className="mt-6 flex justify-center items-center gap-4 text-sm font-semibold">
            <button
              onClick={() => currTickPage > 1 && setCurrTickPage(currTickPage - 1)}
              className="p-1.5 bg-secondary border border-default text-primary rounded-lg disabled:opacity-50 cursor-pointer"
              disabled={currTickPage === 1}
            >
              <MoveLeft size={16} />
            </button>
            <span className="text-xs text-secondary">{currTickPage} of {userAssignedTickets?.totalPages} Pages</span>
            <button
              onClick={() => currTickPage < userAssignedTickets?.totalPages && setCurrTickPage(currTickPage + 1)}
              className="p-1.5 bg-secondary border border-default text-primary rounded-lg disabled:opacity-50 cursor-pointer"
              disabled={currTickPage === userAssignedTickets?.totalPages}
            >
              <MoveRight size={16} />
            </button>
          </div>
        )}
      </div>

      {/* 3. Create Activity Form */}
      <div className="bg-card border border-default rounded-3xl p-6 md:p-8 shadow-xl">
        <h2 className="text-2xl font-extrabold text-primary mb-6 flex items-center gap-3">
          <PlusCircle className="w-6 h-6 text-neon" />
          Log a Workspace Activity
        </h2>

        <form onSubmit={submitHandler} className="space-y-4 max-w-3xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Ticket ID */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-secondary flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-neon" /> Ticket ID
              </label>
              <input
                value={activityForm.ticketId}
                name="ticketId"
                type="text"
                onChange={(e) => setActivityForm(prev => ({ ...prev, ticketId: e.target.value }))}
                className="outline-none rounded-xl px-4 py-2.5 bg-secondary border border-default text-primary text-sm focus:ring-2 focus:ring-[var(--border-neon)]/40 transition-all"
                placeholder="Copy ticket Id from list above"
              />
            </div>

            {/* Action Type */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-secondary flex items-center gap-1.5">
                <ActivityIcon className="w-3.5 h-3.5 text-neon" /> Action Type
              </label>
              <input
                value={activityForm.actionType}
                name="actionType"
                onChange={(e) => setActivityForm(prev => ({ ...prev, actionType: e.target.value }))}
                type="text"
                className="outline-none rounded-xl px-4 py-2.5 bg-secondary border border-default text-primary text-sm focus:ring-2 focus:ring-[var(--border-neon)]/40 transition-all"
                placeholder="E.g. Status Update, Comment Added"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Performed On */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-secondary flex items-center gap-1.5">
                <Folder className="w-3.5 h-3.5 text-neon" /> Performed On (Project ID)
              </label>
              <input
                value={activityForm.performedOn}
                name="performedOn"
                type="text"
                onChange={(e) => setActivityForm(prev => ({ ...prev, performedOn: e.target.value }))}
                className="outline-none rounded-xl px-4 py-2.5 bg-secondary border border-default text-primary text-sm focus:ring-2 focus:ring-[var(--border-neon)]/40 transition-all"
                placeholder="Copy project Id from meta"
              />
            </div>

            {/* Done On */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-secondary flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-neon" /> Done On
              </label>
              <input
                value={activityForm.doneOn}
                name="doneOn"
                type="date"
                onChange={(e) => setActivityForm(prev => ({ ...prev, doneOn: e.target.value }))}
                className="outline-none rounded-xl px-4 py-2.5 bg-secondary border border-default text-primary text-sm focus:ring-2 focus:ring-[var(--border-neon)]/40 transition-all"
              />
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-secondary flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-neon" /> Activity Details
            </label>
            <textarea
              value={activityForm.details}
              name="details"
              onChange={(e) => setActivityForm(prev => ({ ...prev, details: e.target.value }))}
              className="outline-none rounded-xl p-3 bg-secondary border border-default text-primary text-sm h-32 focus:ring-2 focus:ring-[var(--border-neon)]/40 transition-all resize-none"
              placeholder="Provide logs details of the activity..."
            />
          </div>

          <div className="pt-2">
            <button 
              type="submit" 
              className="px-6 py-2.5 btn-gradient text-white rounded-xl shadow-md hover:shadow-lg font-bold transition-all transform hover:-translate-y-0.5 cursor-pointer text-sm"
            >
              Create Activity
            </button>
          </div>
        </form>
      </div>

      {/* 4. Projects Section */}
      <div className="bg-card border border-default rounded-3xl p-6 md:p-8 shadow-xl space-y-6">
        <h3 className="text-2xl font-extrabold text-primary flex items-center gap-3">
          <Folder className="w-6 h-6 text-neon" />
          My Projects
        </h3>
        {userProjects ? (
          <ProjectListPreview projects={userProjects} />
        ) : (
          <p className="text-sm text-secondary italic">No projects found.</p>
        )}
      </div>

      {/* 5. Teams Section */}
      <div className="bg-card border border-default rounded-3xl p-6 md:p-8 shadow-xl space-y-6">
        <h3 className="text-2xl font-extrabold text-primary flex items-center gap-3">
          <Users className="w-6 h-6 text-neon" />
          My Teams
        </h3>
        {userTeams && userTeams.length > 0 ? (
          <TeamListPreview userTeams={userTeams} />
        ) : (
          <div className="text-center py-6 bg-secondary/10 border border-default border-dashed rounded-xl">
            <p className="text-sm text-secondary italic">No teams found.</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default Profile;
