import React, { useContext, useEffect, useState, useRef } from "react";
import { Search, Check, X, Users, Plus } from "lucide-react";
import { TrackForgeContextAPI } from "../ContextAPI/TrackForgeContextAPI";

const SearchTeam = ({ selectedTeamIds = [], setSelectedTeamIds, initialSelected = [] }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { searchTeams, searchedTeams } = useContext(TrackForgeContextAPI);

  const [teamMap, setTeamMap] = useState(() => {
    const initial = {};
    if (initialSelected && Array.isArray(initialSelected)) {
      initialSelected.forEach((t) => {
        if (t && t._id) initial[t._id] = t;
      });
    }
    return initial;
  });

  useEffect(() => {
    searchTeams(searchTerm);
  }, [searchTerm]);

  const teamsList = searchedTeams?.teams || [];

  useEffect(() => {
    if (teamsList && teamsList.length > 0) {
      setTeamMap((prev) => {
        const next = { ...prev };
        teamsList.forEach((t) => {
          if (t && t._id) next[t._id] = t;
        });
        return next;
      });
    }
  }, [teamsList]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleTeamSelection = (teamId) => {
    if (selectedTeamIds.includes(teamId)) {
      setSelectedTeamIds(selectedTeamIds.filter((id) => id !== teamId));
    } else {
      setSelectedTeamIds([...selectedTeamIds, teamId]);
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
          placeholder={selectedTeamIds.length === 0 ? "Search teams by name..." : ""}
          className="flex-1 min-w-[120px] outline-none bg-transparent text-primary text-xs"
        />
      </div>

      {/* Selected Chips */}
      {selectedTeamIds.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {selectedTeamIds.map((tid) => {
            const t = teamMap[tid];
            const displayName = t ? t.name : tid.slice(0, 8) + "...";

            return (
              <span
                key={tid}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-purple-500/10 text-[var(--text-neon)] border border-purple-500/20 rounded-lg text-xs font-semibold shadow-sm transition hover:bg-purple-500/15"
              >
                <span className="flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5 opacity-80" />
                  <span>{displayName}</span>
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleTeamSelection(tid);
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
          {teamsList && teamsList.length > 0 ? (
            teamsList.map((t) => {
              const isSelected = selectedTeamIds.includes(t._id);
              return (
                <div
                  key={t._id}
                  onClick={() => toggleTeamSelection(t._id)}
                  className={`text-xs flex items-center justify-between rounded-lg cursor-pointer px-3 py-2.5 transition-all border mb-0.5 group
                    ${
                      isSelected
                        ? "bg-purple-500/15 border-purple-500/30 text-primary font-semibold"
                        : "hover:bg-hover text-secondary border-transparent"
                    }`}
                >
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-[var(--text-neon)] opacity-85" />
                    <span className="font-semibold text-primary">{t.name}</span>
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
              No teams found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchTeam;
