import React, { useContext, useEffect, useState, useRef } from "react";
import { Search, Check, X, Plus } from "lucide-react";
import { TrackForgeContextAPI } from "../ContextAPI/TrackForgeContextAPI";

const SearchUser = ({ selectedUserIds = [], setSelectedUserIds, initialSelected = [], existingMembers = [], pendingRequests = [] }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { searchUserProfiles, allUserProfiles } = useContext(TrackForgeContextAPI);

  // Keep a map of userId -> userObject to always be able to display names/details
  const [userMap, setUserMap] = useState(() => {
    const initial = {};
    if (initialSelected && Array.isArray(initialSelected)) {
      initialSelected.forEach((u) => {
        if (u && u._id) initial[u._id] = u;
      });
    }
    return initial;
  });

  // Fetch profiles on mount/search
  useEffect(() => {
    searchUserProfiles(searchTerm);
  }, [searchTerm]);

  // Update userMap with any newly loaded profiles
  useEffect(() => {
    if (allUserProfiles && allUserProfiles.length > 0) {
      setUserMap((prev) => {
        const next = { ...prev };
        allUserProfiles.forEach((u) => {
          if (u && u._id) next[u._id] = u;
        });
        return next;
      });
    }
  }, [allUserProfiles]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleUserSelection = (userId) => {
    if (selectedUserIds.includes(userId)) {
      setSelectedUserIds(selectedUserIds.filter((id) => id !== userId));
    } else {
      setSelectedUserIds([...selectedUserIds, userId]);
    }
  };

  return (
    <div className="relative w-full space-y-2" ref={dropdownRef}>
      {/* Search Input Container */}
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
          placeholder={selectedUserIds.length === 0 ? "Search by username or email..." : ""}
          className="flex-1 min-w-[120px] outline-none bg-transparent text-primary text-xs"
        />
      </div>

      {/* Selected Chips */}
      {selectedUserIds.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {selectedUserIds.map((uid) => {
            const u = userMap[uid];
            const displayName = u ? `${u.firstName} ${u.lastName}` : uid.slice(0, 8) + "...";
            const usernameStr = u ? `@${u.username}` : "";
            const initials = u ? `${u.firstName?.[0] || ""}${u.lastName?.[0] || ""}`.toUpperCase() : "?";

            return (
              <span
                key={uid}
                className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-purple-500/10 text-[var(--text-neon)] border border-purple-500/20 rounded-lg text-xs font-semibold shadow-sm transition hover:bg-purple-500/15"
              >
                <span className="flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-purple-500/20 text-[10px] flex items-center justify-center font-bold">
                    {initials}
                  </span>
                  <span>{displayName}</span>
                  {usernameStr && <span className="opacity-60 text-[10px] ml-0.5">{usernameStr}</span>}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleUserSelection(uid);
                  }}
                  className="text-[var(--text-neon)] hover:text-red-500 transition-colors cursor-pointer mr-0.5 ml-1"
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
          {allUserProfiles && allUserProfiles.length > 0 ? (
            allUserProfiles.map((u) => {
              const isSelected = selectedUserIds.includes(u._id);
              const initials = `${u.firstName?.[0] || ""}${u.lastName?.[0] || ""}`.toUpperCase();
              
              // Check if already member or already invited
              const inTeam = existingMembers.some(m => (m.participant?._id || m.participant || m) === u._id);
              const alreadyInvited = pendingRequests.some(r => (r._id || r) === u._id);
              const isSelectable = !inTeam && !alreadyInvited;

              return (
                <div
                  key={u._id}
                  onClick={() => {
                    if (isSelectable) toggleUserSelection(u._id);
                  }}
                  className={`text-xs flex items-center justify-between rounded-lg px-3 py-2 transition-all border mb-0.5 group
                    ${
                      isSelected
                        ? "bg-purple-500/15 border-purple-500/30 text-primary font-semibold cursor-pointer"
                        : isSelectable
                        ? "hover:bg-hover text-secondary border-transparent cursor-pointer"
                        : "opacity-55 cursor-not-allowed bg-secondary/10 border-transparent text-muted"
                    }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-purple-500/10 text-xs flex items-center justify-center font-bold text-[var(--text-neon)]">
                      {initials}
                    </span>
                    <div className="flex flex-col">
                      <span className="font-semibold text-primary">{u.firstName} {u.lastName}</span>
                      <span className="text-[10px] text-muted">@{u.username} • {u.email}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {inTeam && (
                      <span className="px-1.5 py-0.5 bg-green-500/10 text-green-400 border border-green-500/25 rounded text-[9px] font-bold">
                        In Team
                      </span>
                    )}
                    {alreadyInvited && (
                      <span className="px-1.5 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/25 rounded text-[9px] font-bold">
                        Invited
                      </span>
                    )}
                    {isSelectable && (
                      isSelected ? (
                        <Check className="h-4 w-4 text-[var(--text-neon)]" />
                      ) : (
                        <Plus className="h-4 w-4 text-muted group-hover:text-primary transition-colors" />
                      )
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-6 text-center text-xs text-muted">
              No users found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchUser;
