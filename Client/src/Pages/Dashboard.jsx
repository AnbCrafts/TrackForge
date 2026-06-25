import React, { useContext, useEffect, useState } from 'react';
import { TrackForgeContextAPI } from '../ContextAPI/TrackForgeContextAPI';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowBigDownIcon,
  ArrowBigUp,
  Bug,
  Projector,
  Sandwich,
  Ticket,
  Users,
  Bell,
  UserPlus,
  Check,
  X,
  Clock,
  Mail,
  Shield,
  Layers,
  Copy,
} from 'lucide-react';
import TicketList from '../Components/TicketList';
import UserActivities from '../Components/UserActivities';
import CreateMemberModal from '../Components/CreateMemberModal';
import { motion } from "framer-motion";

const Dashboard = () => {
  const navigate = useNavigate();
  const {
    authUserData,
    getUserDataById,
    getUserActivities,
    userActivities,
    getUserAssignedTicketsForNotification,
    userAssignedTicketsForNotification,
    userNotifications,
    getUserNotifications,
    markNotificationsRead,
    patchTeamJoinRequest,
    patchProjectJoinRequest,
    userTeams,
    getUsersTeam,
    userProjects,
    getUserProjects,
    searchUserProfiles,
    allUserProfiles,
  } = useContext(TrackForgeContextAPI);

  const { username, hash } = useParams();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(4);

  useEffect(() => {
    const id = localStorage.getItem('userId');
    if (id) {
      getUserDataById(id);
      getUserActivities(id);
      getUserNotifications(id);
      getUsersTeam(id);
      getUserProjects(id);
      searchUserProfiles("");
    }
  }, [hash]);

  useEffect(() => {
    const id = localStorage.getItem('userId');
    if (id) {
      getUserAssignedTicketsForNotification(id, page, limit);
    }
  }, [limit, page, hash]);

  const handleTeamDecision = async (teamId, patch) => {
    const id = localStorage.getItem('userId');
    await patchTeamJoinRequest(teamId, patch);
    if (id) {
      getUserDataById(id);
    }
  };

  const handleProjectDecision = async (projectId, patch) => {
    const id = localStorage.getItem('userId');
    await patchProjectJoinRequest(projectId, patch);
    if (id) {
      getUserDataById(id);
    }
  };

  const handleClearNotifications = async () => {
    const id = localStorage.getItem('userId');
    if (id) {
      await markNotificationsRead(id);
    }
  };

  const isOwnerOrAdmin = authUserData?.role === "Owner" || authUserData?.role === "Admin";

  // Calculate Owner/Admin Stats
  const userId = localStorage.getItem("userId");
  
  // Teams created by the current user
  const myCreatedTeams = userTeams ? userTeams.filter(t => (t.team?.createdBy?._id || t.team?.createdBy) === userId) : [];
  
  // Projects created/owned by the current user
  const myCreatedProjects = userProjects?.projects ? userProjects.projects.filter(p => (p.project?.owner?._id || p.project?.owner || p.owner?._id) === userId) : [];

  // Count team proposals sent (pending)
  const pendingTeamInvitesCount = myCreatedTeams.reduce((acc, t) => acc + (t.team?.joinRequests?.length || 0), 0);
  
  // Count project proposals sent (pending)
  const pendingProjInvitesCount = myCreatedProjects.reduce((acc, p) => acc + (p.project?.joinRequests?.length || 0), 0);

  const totalPendingProposalsSent = pendingTeamInvitesCount + pendingProjInvitesCount;

  return (
    <div className="shadow p-6 bg-primary min-h-[100vh] w-full border-t border-default/20 text-primary">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="mb-8 flex items-center justify-between flex-wrap gap-4"
      >
        <h1 className="text-3xl font-extrabold text-primary flex items-center gap-2">
          <span className="text-gradient">{authUserData?.firstName}'s</span>
          <span className="bg-purple-600/10 text-[var(--text-neon)] px-4 py-1.5 rounded-xl border border-purple-500/20 shadow-sm font-semibold">
            Workspace
          </span>
        </h1>
      </motion.div>

      {/* Proposals Center (Invitations Received) */}
      {(authUserData?.teamJoinRequests?.length > 0 || authUserData?.projectJoinRequests?.length > 0) && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-6 bg-purple-500/5 border border-purple-500/20 rounded-2xl shadow-xl"
        >
          <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
            <Bell className="h-5 w-5 text-[var(--text-neon)] animate-bounce" />
            Pending Invitations ({(authUserData?.teamJoinRequests?.length || 0) + (authUserData?.projectJoinRequests?.length || 0)})
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Team Proposals */}
            {authUserData?.teamJoinRequests?.map((team) => (
              <div key={team._id} className="p-4 bg-card border border-default rounded-xl flex items-center justify-between shadow-sm">
                <div>
                  <p className="text-[10px] font-bold text-[var(--text-neon)] uppercase tracking-wider">Team Invitation</p>
                  <h4 className="text-sm font-bold text-primary">{team.name}</h4>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleTeamDecision(team._id, "accept")}
                    className="p-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/20 rounded-lg transition-all cursor-pointer"
                    title="Accept"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleTeamDecision(team._id, "reject")}
                    className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg transition-all cursor-pointer"
                    title="Reject"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}

            {/* Project Proposals */}
            {authUserData?.projectJoinRequests?.map((proj) => (
              <div key={proj._id} className="p-4 bg-card border border-default rounded-xl flex items-center justify-between shadow-sm">
                <div>
                  <p className="text-[10px] font-bold text-pink-400 uppercase tracking-wider">Project Invitation</p>
                  <h4 className="text-sm font-bold text-primary">{proj.name}</h4>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleProjectDecision(proj._id, "accept")}
                    className="p-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/20 rounded-lg transition-all cursor-pointer"
                    title="Accept"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleProjectDecision(proj._id, "reject")}
                    className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg transition-all cursor-pointer"
                    title="Reject"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Stats Cards */}
      <div className="flex mt-6 items-center justify-center gap-5 p-5 rounded-2xl shadow-xl border border-default bg-card flex-wrap">
        {[
          {
            label: "Teams",
            value: authUserData?.teams?.length || 0,
            icon: Users,
          },
          {
            label: "Projects",
            value: authUserData?.manages?.length || 0,
            icon: Projector,
          },
          {
            label: "Bugs",
            value: authUserData?.bugs?.length || 0,
            icon: Bug,
          },
          {
            label: "Tickets",
            value: authUserData?.activity?.length || 0,
            icon: Ticket,
          },
        ].map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.07 }}
            className="p-5 rounded-2xl bg-secondary/40 border border-default shadow-inner flex items-center flex-col justify-center gap-3 flex-1 h-36 min-w-[200px]"
          >
            <span className="text-sm font-semibold flex items-center gap-2.5 text-secondary">
              {item.label}
              <item.icon className="h-5 w-5 text-neon" />
            </span>
            <span className="text-3xl font-extrabold text-primary">
              {item.value}
            </span>
          </motion.div>
        ))}
      </div>

      {/* OWNER / ADMIN MANAGEMENT CONSOLE */}
      {isOwnerOrAdmin && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8"
        >
          {/* Created Users Section */}
          <div className="lg:col-span-8 bg-card border border-default rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-primary flex items-center gap-2">
                <Shield className="h-5 w-5 text-neon" />
                Team Members Created By You
              </h2>
              <span className="px-2.5 py-0.5 bg-purple-500/10 text-[var(--text-neon)] rounded-full text-xs font-bold border border-purple-500/20 shadow-sm">
                Total: {allUserProfiles?.length || 0}
              </span>
            </div>

            <div className="overflow-x-auto">
              {allUserProfiles && allUserProfiles.length > 0 ? (
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-default text-secondary uppercase font-semibold">
                      <th className="py-3 px-2">Name</th>
                      <th className="py-3 px-2">Role</th>
                      <th className="py-3 px-2">Status</th>
                      <th className="py-3 px-2">Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allUserProfiles.map((u) => {
                      const initials = `${u.firstName?.[0] || ""}${u.lastName?.[0] || ""}`.toUpperCase();
                      return (
                        <tr key={u._id} className="border-b border-default/50 hover:bg-hover/20 transition-all text-primary">
                          <td className="py-3 px-2 flex items-center gap-2.5">
                            <span className="w-6 h-6 rounded-full bg-purple-500/10 text-[10px] flex items-center justify-center font-bold text-[var(--text-neon)] shrink-0">
                              {initials}
                            </span>
                            <div>
                              <p className="font-bold">{u.firstName} {u.lastName}</p>
                              <p className="text-[10px] text-muted">@{u.username}</p>
                            </div>
                          </td>
                          <td className="py-3 px-2">
                            <span className="px-2 py-0.5 bg-secondary border border-default rounded text-[10px] font-semibold text-secondary">
                              {u.role}
                            </span>
                          </td>
                          <td className="py-3 px-2">
                            <span className={`inline-block w-2 h-2 rounded-full mr-1.5 ${u.status === "Online" ? "bg-green-400" : "bg-gray-400"}`} />
                            {u.status}
                          </td>
                          <td className="py-3 px-2 font-mono text-muted">{u.email}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <div className="py-8 text-center text-xs text-muted">
                  No team members created by you yet. Go to members page to create user accounts.
                </div>
              )}
            </div>
          </div>

          {/* Proposals Sent Stats (Invitations Sent Pending) */}
          <div className="lg:col-span-4 bg-card border border-default rounded-2xl p-6 shadow-xl space-y-4">
            <h2 className="text-xl font-bold text-primary flex items-center gap-2">
              <Layers className="h-5 w-5 text-neon" />
              Proposals Sent ({totalPendingProposalsSent})
            </h2>

            <div className="space-y-4">
              <div className="p-4 bg-secondary/35 border border-default rounded-xl flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-secondary">Pending Team Proposals</h4>
                  <p className="text-[10px] text-muted">Awaiting member acceptance</p>
                </div>
                <span className="text-xl font-extrabold text-[var(--text-neon)] bg-purple-500/10 border border-purple-500/20 px-3 py-1 rounded-lg">
                  {pendingTeamInvitesCount}
                </span>
              </div>

              <div className="p-4 bg-secondary/35 border border-default rounded-xl flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-secondary">Pending Project Proposals</h4>
                  <p className="text-[10px] text-muted">Awaiting member acceptance</p>
                </div>
                <span className="text-xl font-extrabold text-pink-400 bg-pink-500/10 border border-pink-500/20 px-3 py-1 rounded-lg">
                  {pendingProjInvitesCount}
                </span>
              </div>

              {/* Detail view of proposals sent */}
              <div className="pt-2 space-y-2">
                <p className="text-xs font-bold text-primary">Unaccepted Proposals Sent</p>
                <div className="max-h-48 overflow-y-auto pr-1 space-y-2 scrollbar-thin">
                  {myCreatedTeams.some(t => t.team?.joinRequests?.length > 0) || myCreatedProjects.some(p => p.project?.joinRequests?.length > 0) ? (
                    <>
                      {myCreatedTeams.map(t => t.team?.joinRequests?.map((reqId, rIdx) => {
                        const targetUser = allUserProfiles?.find(u => u._id === reqId);
                        return (
                          <div key={`team-req-${t.team?._id}-${rIdx}`} className="p-2.5 bg-secondary/20 border border-default/45 rounded-lg flex items-center justify-between text-[10px]">
                            <div>
                              <span className="text-primary font-semibold truncate max-w-[120px] block">{t.team?.name} (Team)</span>
                              <span className="text-muted block mt-0.5">Invited: {targetUser ? `${targetUser.firstName} (@${targetUser.username})` : 'Unknown'}</span>
                            </div>
                            <span className="text-muted font-mono flex items-center gap-1 shrink-0">
                              <Clock className="h-3 w-3 text-amber-400" /> Pending
                            </span>
                          </div>
                        );
                      }))}
                      {myCreatedProjects.map(p => p.project?.joinRequests?.map((reqId, rIdx) => {
                        const targetUser = allUserProfiles?.find(u => u._id === reqId);
                        return (
                          <div key={`proj-req-${p.project?._id}-${rIdx}`} className="p-2.5 bg-secondary/20 border border-default/45 rounded-lg flex items-center justify-between text-[10px]">
                            <div>
                              <span className="text-primary font-semibold truncate max-w-[120px] block">{p.project?.name} (Proj)</span>
                              <span className="text-muted block mt-0.5">Invited: {targetUser ? `${targetUser.firstName} (@${targetUser.username})` : 'Unknown'}</span>
                            </div>
                            <span className="text-muted font-mono flex items-center gap-1 shrink-0">
                              <Clock className="h-3 w-3 text-amber-400" /> Pending
                            </span>
                          </div>
                        );
                      }))}
                    </>
                  ) : (
                    <p className="text-[10px] text-muted text-center py-6">All proposals accepted or none sent.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Grid Layout for Activities, Tickets & Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
        
        {/* Left Column (Activities and Tickets) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Recent Activities */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            <h2 className="text-xl font-bold text-primary mb-4">Recent Activities</h2>
            {userActivities && userActivities.length > 0 ? (
              <UserActivities userActivities={userActivities} />
            ) : (
              <div className="text-sm font-semibold flex items-center gap-3 p-4 border border-default rounded-xl bg-card text-secondary shadow-sm">
                <Sandwich className="text-neon" />
                <p>No activity done recently</p>
                <Link
                  to={`/auth/${hash}/${username}/workspace/projects`}
                  className="bg-purple-600 px-4 py-1.5 rounded-xl text-white ml-5 hover:bg-purple-700 transition-all font-bold text-xs shadow-md"
                >
                  Go to project
                </Link>
              </div>
            )}
          </motion.div>

          {/* Tickets Assigned */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
          >
            {userAssignedTicketsForNotification?.tickets?.length > 0 ? (
              <div className="py-5">
                <h1 className="text-xl font-bold mb-4 px-1 text-primary flex items-center gap-2">
                  <span className="text-[var(--text-neon)]">Tickets</span> Assigned by me
                </h1>

                <TicketList userTickets={userAssignedTicketsForNotification} />

                {/* Pagination */}
                <div className="w-fit mx-auto mt-6">
                  {userAssignedTicketsForNotification.totalLength > limit ? (
                    <p
                      onClick={() =>
                        setLimit(userAssignedTicketsForNotification.totalLength)
                      }
                      className="flex items-center gap-2 text-primary text-xs font-semibold px-6 py-2 rounded-xl border border-default bg-card hover:bg-hover transition-all cursor-pointer shadow-sm"
                    >
                      Show {userAssignedTicketsForNotification.totalLength - limit} More
                      <ArrowBigDownIcon className="h-4 w-4 text-neon" />
                    </p>
                  ) : (
                    <p
                      onClick={() => setLimit(5)}
                      className="flex items-center gap-2 text-primary text-xs font-semibold px-6 py-2 rounded-xl border border-default bg-card hover:bg-hover transition-all cursor-pointer shadow-sm"
                    >
                      Show Default
                      <ArrowBigUp className="h-4 w-4 text-neon" />
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-xs text-muted">No Ticket Found</p>
            )}
          </motion.div>
        </div>

        {/* Right Column (Notifications Center) */}
        <div className="lg:col-span-4">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.15 }}
            className="bg-card border border-default rounded-2xl p-6 shadow-xl sticky top-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                <Bell className="h-5 w-5 text-neon" />
                Notifications Center
                {userNotifications?.filter(n => !n.read).length > 0 && (
                  <span className="px-2 py-0.5 text-[10px] bg-red-500 text-white rounded-full font-bold">
                    {userNotifications.filter(n => !n.read).length}
                  </span>
                )}
              </h3>
              {userNotifications?.length > 0 && (
                <button
                  onClick={handleClearNotifications}
                  className="text-xs text-[var(--text-neon)] hover:opacity-80 font-bold underline cursor-pointer"
                >
                  Mark all as read
                </button>
              )}
            </div>

            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1 scrollbar-thin">
              {userNotifications && userNotifications.length > 0 ? (
                userNotifications.map((notif, index) => (
                  <div
                    key={notif._id || index}
                    className={`p-4 rounded-xl border transition-all ${
                      notif.read
                        ? "bg-secondary/20 border-default/50 text-muted"
                        : "bg-secondary/40 border-purple-500/25 text-primary shadow-inner"
                    }`}
                  >
                    <p className="text-xs font-semibold leading-relaxed">{notif.message}</p>
                    <p className="text-[9px] text-muted mt-2">
                      {new Date(notif.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 text-muted">
                  <Bell className="h-8 w-8 mx-auto mb-2 opacity-40 text-muted" />
                  <p className="text-xs">No notifications yet</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
