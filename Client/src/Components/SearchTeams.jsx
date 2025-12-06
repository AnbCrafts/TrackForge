import { MoveLeft, Search } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { TrackForgeContextAPI } from "../ContextAPI/TrackForgeContextAPI";

const SearchTeam = ({ toggle, setSelectedTeamIds, selectedTeamIds }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [page] = useState(1);

  const { searchTeams, searchedTeams } = useContext(TrackForgeContextAPI);

  useEffect(() => {
    if (searchTerm.trim() !== "") {
      searchTeams(searchTerm, page);
    }
  }, [searchTerm]);

  const toggleTeamSelection = (teamId) => {
    if (selectedTeamIds.includes(teamId)) {
      setSelectedTeamIds(selectedTeamIds.filter((id) => id !== teamId));
    } else {
      setSelectedTeamIds([...selectedTeamIds, teamId]);
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

        <h1 className="text-2xl font-semibold text-gray-800">Search Teams</h1>
      </div>

      {/* Search Box */}
      <div className="p-3 flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-lg">
        <Search className="text-gray-600" />

        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          type="search"
          placeholder="Search by team name..."
          className="outline-none px-3 py-2 bg-gray-100 rounded flex-1 text-gray-900"
        />
      </div>

      {/* Results */}
      <div className="p-3 border mt-5 border-gray-200 rounded w-full h-100 overflow-y-scroll noScroll">
        {searchTerm.trim() === "" ? (
          <p className="text-md text-gray-400">Search results appear here...</p>
        ) : searchedTeams?.teams?.length > 0 ? (
          searchedTeams.teams.map((t, i) => {
            const isSelected = selectedTeamIds.includes(t._id);

            return (
              <div
                key={i}
                onClick={() => toggleTeamSelection(t._id)}
                className={`text-md flex items-center justify-between rounded shadow cursor-pointer px-4 py-2 mb-3 border font-medium transition-all
                  ${
                    isSelected
                      ? "bg-green-200 border-green-500"
                      : "hover:shadow-md hover:bg-gray-200 text-gray-900 border-gray-300"
                  }`}
              >
                <span className="font-semibold">{t.name}</span>
              </div>
            );
          })
        ) : (
          <p className="text-md text-gray-400">No teams found for this search!</p>
        )}
      </div>
    </div>
  );
};

export default SearchTeam;
