import React, { useContext, useEffect, useState } from "react";
import { TrackForgeContextAPI } from "../ContextAPI/TrackForgeContextAPI";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Loader2,
  FolderKanban,
  FileText,
  Clock,
  Plus,
  GitBranch,
  Trash2
} from "lucide-react";
import SearchUser from "./SearchUser";
import SearchTeam from "./SearchTeams";

export default function CreateProjectModal({ isOpen, onClose }) {
  const { createProject, getThisUserGithubRepo, githubRepo } = useContext(TrackForgeContextAPI);
  const [isLoading, setIsLoading] = useState(false);
  const { hash, username } = useParams();
  const adminId = localStorage.getItem("userId");

  const [selectedTeamIds, setSelectedTeamIds] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState([]);

  const [projectForm, setProjectForm] = useState({
    name: "",
    description: "",
    owner: adminId,
    startedOn: Date.now() + 7 * 60 * 1000,
    deadline: "",
    teams: [],
    members: [],
    files: []
  });

  // Sync selected teams
  useEffect(() => {
    setProjectForm((prev) => ({ ...prev, teams: [...selectedTeamIds] }));
  }, [selectedTeamIds]);

  // Sync selected members
  useEffect(() => {
    setProjectForm((prev) => ({ ...prev, members: [...selectedUserIds] }));
  }, [selectedUserIds]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!projectForm.name.trim() || !projectForm.description.trim()) {
      toast.warn("Project Name and Description are required!");
      return;
    }

    setIsLoading(true);
    try {
      await createProject(projectForm);
      // Reset form
      setProjectForm({
        name: "",
        description: "",
        owner: adminId,
        startedOn: Date.now() + 7 * 60 * 1000,
        deadline: "",
        teams: [],
        members: [],
        files: []
      });
      setSelectedTeamIds([]);
      setSelectedUserIds([]);
      onClose();
    } catch (error) {
      console.error("Create project error:", error);
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
            className="relative w-full max-w-2xl bg-card border border-default rounded-2xl shadow-2xl overflow-hidden z-10"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-default/20 bg-secondary/50">
              <div className="flex items-center gap-2">
                <FolderKanban className="h-5 w-5 text-neon" />
                <h3 className="text-lg font-bold text-primary">Create New Project</h3>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-hover text-secondary hover:text-primary transition-all"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={submitHandler} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Left Fields */}
                <div className="space-y-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-secondary flex items-center gap-1.5">
                      <FolderKanban className="h-3.5 w-3.5 text-neon" /> Project Name
                    </label>
                    <input
                      value={projectForm.name}
                      onChange={(e) => setProjectForm((prev) => ({ ...prev, name: e.target.value }))}
                      type="text"
                      placeholder="e.g. E-Commerce Platform"
                      className="outline-none focus:ring-2 focus:ring-[var(--border-neon)]/40 transition rounded-lg px-3 py-2 bg-secondary border border-default text-primary text-sm"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-secondary flex items-center gap-1.5">
                      <FileText className="h-3.5 w-3.5 text-neon" /> Description
                    </label>
                    <textarea
                      rows={4}
                      value={projectForm.description}
                      onChange={(e) => setProjectForm((prev) => ({ ...prev, description: e.target.value }))}
                      placeholder="Enter a brief overview of the project..."
                      className="outline-none focus:ring-2 focus:ring-[var(--border-neon)]/40 transition rounded-lg px-3 py-2 bg-secondary border border-default text-primary text-sm resize-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-secondary flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-neon" /> Deadline
                    </label>
                    <input
                      value={projectForm.deadline}
                      onChange={(e) => setProjectForm((prev) => ({ ...prev, deadline: e.target.value }))}
                      type="datetime-local"
                      className="outline-none focus:ring-2 focus:ring-[var(--border-neon)]/40 transition rounded-lg px-3 py-2 bg-secondary border border-default text-primary text-sm"
                    />
                  </div>
                </div>

                {/* Right Columns (Assigning resources) */}
                <div className="space-y-4">
                  {/* Teams Selection */}
                  <div className="p-3 bg-secondary/30 rounded-xl border border-default/40 space-y-2">
                    <label className="text-xs font-semibold text-secondary">Link Teams</label>
                    <SearchTeam selectedTeamIds={selectedTeamIds} setSelectedTeamIds={setSelectedTeamIds} />
                  </div>

                  {/* Users Selection */}
                  <div className="p-3 bg-secondary/30 rounded-xl border border-default/40 space-y-2">
                    <label className="text-xs font-semibold text-secondary">Link Members</label>
                    <SearchUser selectedUserIds={selectedUserIds} setSelectedUserIds={setSelectedUserIds} />
                  </div>

                  {/* GitHub integration hint */}
                  <div className="p-3 bg-secondary/40 rounded-xl border border-default/30 flex items-center justify-between text-xs text-secondary">
                    <span className="flex items-center gap-1.5">
                      <GitBranch className="h-4 w-4 text-purple-600" />
                      Import files from GitHub
                    </span>
                    <Link
                      to={`/auth/${hash}/${username}/workspace/github`}
                      onClick={onClose}
                      className="px-2.5 py-1 bg-card hover:bg-hover border border-default text-primary rounded-lg transition font-semibold"
                    >
                      Connect
                    </Link>
                  </div>
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
                  <span>{isLoading ? "Creating..." : "Create Project"}</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
