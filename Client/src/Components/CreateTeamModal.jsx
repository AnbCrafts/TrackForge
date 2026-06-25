import React, { useContext, useEffect, useState } from "react";
import { TrackForgeContextAPI } from "../ContextAPI/TrackForgeContextAPI";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Loader2,
  Group,
  Users,
  FolderKanban,
  Trash2,
  Plus
} from "lucide-react";
import SearchUser from "./SearchUser";
import SearchProjects from "./SearchProjects";

export default function CreateTeamModal({ isOpen, onClose }) {
  const { createTeam } = useContext(TrackForgeContextAPI);
  const [isLoading, setIsLoading] = useState(false);
  const adminId = localStorage.getItem("userId");

  const [addEntity, setAddEntity] = useState("User");
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [selectedProjectIds, setSelectedProjectIds] = useState([]);
  const [teamForm, setTeamForm] = useState({
    name: "",
    projects: [],
    createdBy: adminId,
    members: [{ participant: "", joinedAt: "" }],
  });

  // Sync selected members to team form
  useEffect(() => {
    const membersData = selectedUserIds.map((uid) => ({
      participant: uid,
      joinedAt: new Date().toISOString(),
    }));
    setTeamForm((prev) => ({ ...prev, members: membersData }));
  }, [selectedUserIds]);

  // Sync selected projects to team form
  useEffect(() => {
    setTeamForm((prev) => ({ ...prev, projects: [...selectedProjectIds] }));
  }, [selectedProjectIds]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!teamForm.name.trim()) {
      toast.warn("Team Name is required!");
      return;
    }

    setIsLoading(true);
    try {
      await createTeam(teamForm);
      // Reset form
      setTeamForm({
        name: "",
        projects: [],
        createdBy: adminId,
        members: [{ participant: "", joinedAt: "" }],
      });
      setSelectedUserIds([]);
      setSelectedProjectIds([]);
      onClose();
    } catch (error) {
      console.error("Create team error:", error);
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
            transition={{ type: "spring", duration: 0.5 }}
            className="relative w-full max-w-xl bg-card border border-default rounded-2xl shadow-2xl overflow-hidden z-10"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-default/20 bg-secondary/50">
              <div className="flex items-center gap-2">
                <Group className="h-5 w-5 text-neon" />
                <h3 className="text-lg font-bold text-primary">Create New Team</h3>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-hover text-secondary hover:text-primary transition-all"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={submitHandler} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-secondary flex items-center gap-1.5">
                  <Group className="h-3.5 w-3.5 text-neon" /> Team Name
                </label>
                <input
                  value={teamForm.name}
                  onChange={(e) => setTeamForm({ ...teamForm, name: e.target.value })}
                  type="text"
                  placeholder="e.g. Frontend Superstars"
                  className="outline-none focus:ring-2 focus:ring-[var(--border-neon)]/40 transition rounded-lg px-3 py-2 bg-secondary border border-default text-primary text-sm"
                />
              </div>

              {/* Tabs selector */}
              <div className="flex flex-col gap-3">
                <label className="text-xs font-semibold text-secondary">Assign Resources</label>
                <div className="flex bg-secondary p-1 rounded-lg border border-default/60 max-w-xs">
                  <button
                    type="button"
                    onClick={() => setAddEntity("User")}
                    className={`flex-1 py-1.5 rounded-md text-xs font-bold transition-all ${
                      addEntity === "User" ? "bg-card text-primary shadow-sm" : "text-secondary hover:text-primary"
                    }`}
                  >
                    Add Members
                  </button>
                  <button
                    type="button"
                    onClick={() => setAddEntity("Project")}
                    className={`flex-1 py-1.5 rounded-md text-xs font-bold transition-all ${
                      addEntity === "Project" ? "bg-card text-primary shadow-sm" : "text-secondary hover:text-primary"
                    }`}
                  >
                    Add Projects
                  </button>
                </div>

                {/* Sub-panels */}
                <div className="p-3 bg-secondary/30 rounded-xl border border-default/40">
                  {addEntity === "User" ? (
                    <div className="space-y-3">
                      <SearchUser
                        selectedUserIds={selectedUserIds}
                        setSelectedUserIds={setSelectedUserIds}
                      />
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <SearchProjects
                        selectedProjectIds={selectedProjectIds}
                        setSelectedProjectIds={setSelectedProjectIds}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-default/20">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-secondary hover:bg-hover border border-default text-secondary hover:text-primary rounded-lg transition-all text-sm font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-5 py-2 btn-gradient text-white rounded-lg shadow-lg flex items-center gap-1.5 text-sm font-bold disabled:opacity-75 disabled:cursor-not-allowed"
                >
                  {isLoading && <Loader2 className="animate-spin h-4 w-4" />}
                  <span>{isLoading ? "Creating..." : "Create Team"}</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
