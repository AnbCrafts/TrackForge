import React, { useContext, useEffect, useState, useRef } from "react";
import { Search, Check, X, Plus, FolderKanban } from "lucide-react";
import { TrackForgeContextAPI } from "../ContextAPI/TrackForgeContextAPI";

const SearchProjects = ({ selectedProjectIds = [], setSelectedProjectIds, initialSelected = [] }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { searchProjects, searchedProjects } = useContext(TrackForgeContextAPI);

  const [projectMap, setProjectMap] = useState(() => {
    const initial = {};
    if (initialSelected && Array.isArray(initialSelected)) {
      initialSelected.forEach((p) => {
        if (p && p._id) initial[p._id] = p;
      });
    }
    return initial;
  });

  // Load projects on mount and search query changes
  useEffect(() => {
    searchProjects(searchTerm, 1);
  }, [searchTerm]);

  const projectsList = searchedProjects?.projects || [];

  useEffect(() => {
    if (projectsList && projectsList.length > 0) {
      setProjectMap((prev) => {
        const next = { ...prev };
        projectsList.forEach((p) => {
          if (p && p._id) next[p._id] = p;
        });
        return next;
      });
    }
  }, [projectsList]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleProjectSelection = (projectId) => {
    if (selectedProjectIds.includes(projectId)) {
      setSelectedProjectIds(selectedProjectIds.filter((id) => id !== projectId));
    } else {
      setSelectedProjectIds([...selectedProjectIds, projectId]);
    }
  };

  return (
    <div className="relative w-full space-y-2" ref={dropdownRef}>
      {/* Input Container */}
      <div 
        className="flex flex-wrap gap-1.5 p-2 bg-secondary border border-default rounded-xl shadow-sm focus-within:ring-2 focus-within:ring-[var(--border-neon)]/45 transition-all cursor-text min-h-[40px] items-center"
        onClick={() => setIsOpen(true)}
      >
        <Search className="text-muted h-4 w-4 ml-1 shrink-0" />
        <input
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          type="text"
          placeholder={selectedProjectIds.length === 0 ? "Search projects..." : ""}
          className="flex-1 min-w-[120px] outline-none bg-transparent text-primary text-xs"
        />
      </div>

      {/* Selected Chips */}
      {selectedProjectIds.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {selectedProjectIds.map((pid) => {
            const p = projectMap[pid];
            const displayName = p ? p.name : pid.slice(0, 8) + "...";

            return (
              <span
                key={pid}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-purple-500/10 text-[var(--text-neon)] border border-purple-500/20 rounded-lg text-xs font-semibold shadow-sm transition hover:bg-purple-500/15"
              >
                <span className="flex items-center gap-1.5">
                  <FolderKanban className="h-3.5 w-3.5 opacity-80" />
                  <span>{displayName}</span>
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleProjectSelection(pid);
                  }}
                  className="text-[var(--text-neon)] hover:text-red-500 transition-colors cursor-pointer ml-1"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </span>
            );
          })}
        </div>
      )}

      {/* Inline Dropdown Results (relative positioning avoids modal clipping) */}
      {isOpen && (
        <div className="relative z-10 mt-1 max-h-48 overflow-y-auto rounded-xl border border-default bg-card p-1.5 shadow-inner scrollbar-thin">
          {projectsList && projectsList.length > 0 ? (
            projectsList.map((p) => {
              const isSelected = selectedProjectIds.includes(p._id);
              return (
                <div
                  key={p._id}
                  onClick={() => toggleProjectSelection(p._id)}
                  className={`text-xs flex items-center justify-between rounded-lg cursor-pointer px-3 py-2.5 transition-all border mb-0.5 group
                    ${
                      isSelected
                        ? "bg-purple-500/15 border-purple-500/30 text-primary font-semibold"
                        : "hover:bg-hover text-secondary border-transparent"
                    }`}
                >
                  <div className="flex items-center gap-2">
                    <FolderKanban className="h-4 w-4 text-[var(--text-neon)] opacity-85" />
                    <span className="font-semibold text-primary">{p.name}</span>
                  </div>
                  {isSelected ? (
                    <Check className="h-4 w-4 text-[var(--text-neon)]" />
                  ) : (
                    <Plus className="h-4 w-4 text-muted group-hover:text-primary transition-colors" />
                  )}
                </div>
              );
            })
          ) : (
            <div className="py-6 text-center text-xs text-muted">
              No projects found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchProjects;
