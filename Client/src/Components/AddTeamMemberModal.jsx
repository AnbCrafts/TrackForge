import React, { useContext, useEffect, useState } from "react";
import { TrackForgeContextAPI } from "../ContextAPI/TrackForgeContextAPI";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, UserPlus, Users } from "lucide-react";
import SearchUser from "./SearchUser";

export default function AddTeamMemberModal({ isOpen, onClose, teamId, existingMembers = [] }) {
  const {
    inviteMemberToTeam,
    teamJoinReqList,
    getTeamJoinRequests,
    teamData,
    authUserData,
    sendDirectMail,
    allUserProfiles
  } = useContext(TrackForgeContextAPI);

  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sendEmail, setSendEmail] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setSelectedUserIds([]);
      if (teamId) {
        getTeamJoinRequests(teamId);
      }
    }
  }, [isOpen, teamId]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (selectedUserIds.length === 0) {
      toast.warn("Please select at least one user to invite");
      return;
    }

    setIsLoading(true);
    try {
      let successCount = 0;
      for (const userId of selectedUserIds) {
        // Prevent inviting someone who is already in the team
        if (existingMembers.some((m) => (m.participant?._id || m.participant) === userId)) {
          toast.warn(`User is already a member of this team.`);
          continue;
        }

        // Prevent inviting someone with pending invite
        if (teamJoinReqList?.some((r) => r._id === userId)) {
          toast.warn(`An invitation is already pending for this user.`);
          continue;
        }

        const success = await inviteMemberToTeam(teamId, userId);
        if (success) {
          successCount++;
          
          // Send email containing the team join link if sendEmail is checked
          if (sendEmail) {
            const targetUser = allUserProfiles?.find((u) => u._id === userId);
            if (targetUser && targetUser.email) {
              const inviteLink = teamData?.raw?.link?.url || "";
              const subject = `Invitation to join team "${teamData?.raw?.name || "our team"}"`;
              const context = `Hi ${targetUser.firstName},

You have been invited by ${authUserData?.firstName} ${authUserData?.lastName} (@${authUserData?.username}) to join the team "${teamData?.raw?.name || "TrackForge team"}" on TrackForge.

Please click the link below to accept the invitation and join the team:
${inviteLink}

Welcome aboard!
The TrackForge Team`;

              try {
                await sendDirectMail(
                  `${authUserData?.firstName} ${authUserData?.lastName}`,
                  authUserData?.email,
                  targetUser.email,
                  subject,
                  context
                );
              } catch (mailErr) {
                console.error("Direct mail sending error:", mailErr);
              }
            }
          }
        }
      }

      if (successCount > 0) {
        toast.success(`Successfully invited ${successCount} member(s)!`);
        onClose();
      }
    } catch (error) {
      console.error("Invite team members error:", error);
      toast.error("Failed to invite some members");
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
            className="relative w-full max-w-md bg-card border border-default rounded-2xl shadow-2xl overflow-visible z-10"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-default/20 bg-secondary/50">
              <div className="flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-neon" />
                <h3 className="text-lg font-bold text-primary">Invite Members to Team</h3>
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
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-secondary flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5 text-neon" /> Search & Select Users
                </label>
                <SearchUser
                  selectedUserIds={selectedUserIds}
                  setSelectedUserIds={setSelectedUserIds}
                  existingMembers={existingMembers}
                  pendingRequests={teamJoinReqList || []}
                />
              </div>

              {/* Send Email Option */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="send-invite-email-chk"
                  checked={sendEmail}
                  onChange={(e) => setSendEmail(e.target.checked)}
                  className="rounded border-default text-neon focus:ring-neon cursor-pointer h-4 w-4"
                />
                <label htmlFor="send-invite-email-chk" className="text-xs text-secondary cursor-pointer select-none">
                  Automatically email the team invitation link to the user
                </label>
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
                  disabled={isLoading || selectedUserIds.length === 0}
                  className="px-5 py-2 btn-gradient text-white rounded-lg shadow-lg flex items-center gap-1.5 text-sm font-bold disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isLoading && <Loader2 className="animate-spin h-4 w-4" />}
                  <span>{isLoading ? "Inviting..." : "Send Invitation"}</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
