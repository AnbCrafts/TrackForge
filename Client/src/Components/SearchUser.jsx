import { MoveLeft, Search } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { TrackForgeContextAPI } from "../ContextAPI/TrackForgeContextAPI";

const SearchUser = ({ toggle, selectedUserIds, setSelectedUserIds }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [page] = useState(1);

  const { searchUserProfiles, allUserProfiles, formatDateTime } =
    useContext(TrackForgeContextAPI);

  /* ---------------------------------------
        Trigger search when searchTerm changes
  ----------------------------------------- */
  useEffect(() => {
    if (searchTerm.trim() !== "") {
      searchUserProfiles(searchTerm, page);
    }
  }, [searchTerm]);

  /* ---------------------------------------
        Toggle user selection
  ----------------------------------------- */
  const toggleUserSelection = (userId) => {
    if (selectedUserIds.includes(userId)) {
      setSelectedUserIds(selectedUserIds.filter((id) => id !== userId));
    } else {
      setSelectedUserIds([...selectedUserIds, userId]);
    }
  };

  return (
    <div className="flex-1 px-3 w-full">

      {/* Header */}
      <div className="flex items-center gap-4 mb-4">
        {toggle && (
          <MoveLeft
            onClick={() => toggle(false)}
            className="bg-gray-900 text-white rounded p-1 h-8 w-8 cursor-pointer hover:bg-gray-700 transition"
          />
        )}

        <h1 className="text-2xl font-semibold text-gray-800">Search Users</h1>
      </div>

      {/* Search Input */}
      <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
        <Search className="text-gray-600" />

        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          type="search"
          placeholder="Search by username or email..."
          className="flex-1 outline-none px-3 py-2 bg-gray-100 rounded text-gray-900"
        />
      </div>

      {/* Results */}
      <div className="p-3 border mt-5 border-gray-200 rounded w-full h-100 overflow-y-scroll noScroll">
        {searchTerm.trim() === "" ? (
          <p className="text-md text-gray-400">Search results appear here...</p>
        ) : allUserProfiles?.length > 0 ? (
          allUserProfiles.map((u, i) => {
            const isSelected = selectedUserIds.includes(u._id);

            return (
              <div
                key={i}
                onClick={() => toggleUserSelection(u._id)}
                className={`text-md flex items-center justify-between rounded shadow cursor-pointer px-4 py-2 mb-3 border font-medium transition-all
                  ${
                    isSelected
                      ? "bg-green-200 border-green-500"
                      : "hover:shadow-md hover:bg-gray-200 text-gray-900 border-gray-300"
                  }`}
              >
                <span className="font-semibold">{u.username}</span>

                <span className="text-sm text-gray-500 shrink-0">
                  {formatDateTime(u.createdAt)}
                </span>
              </div>
            );
          })
        ) : (
          <p className="text-md text-gray-400">No users found for this search!</p>
        )}
      </div>
    </div>
  );
};

export default SearchUser;
