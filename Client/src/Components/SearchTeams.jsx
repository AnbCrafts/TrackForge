import { MoveLeft, Search } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { TrackForgeContextAPI } from "../ContextAPI/TrackForgeContextAPI";

const SearchTeam = ({ toggle, setSelectedTeamIds, selectedTeamIds }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const { searchTeams, searchedTeams, formatDateTime } = useContext(TrackForgeContextAPI);

  useEffect(() => {
    if (searchTerm !== "") {
      searchTeams(searchTerm, page);
    }
  }, [searchTerm]);

  const toggleTeamSelection = (teamId) => {
    if (selectedTeamIds.includes(teamId)) {
      // remove
      setSelectedTeamIds(selectedTeamIds.filter((id) => id !== teamId));
    } else {
      // add
      setSelectedTeamIds([...selectedTeamIds, teamId]);
    }
  };

  useEffect(() => {
    console.log(searchedTeams);
  }, [searchedTeams]);

  return (
    <div className="flex-1 px-3 w-full">
      <div className="flex items-center justify-start gap-5">
        {toggle && (
          <MoveLeft
            onClick={() => toggle(false)}
            className="bg-gray-900 text-white rounded p-1 h-8 w-8 cursor-pointer"
          />
        )}

        <h1 className="text-center text-2xl">Search Teams</h1>
      </div>

      <div className="mt-3 p-3 w-full flex items-center gap-3">
        <label htmlFor="search">
          <Search />
        </label>
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          type="search"
          name="search"
          placeholder="Search by team name..."
          className="outline-none px-4 py-2 bg-gray-100 rounded flex-1 text-gray-900"
        />
      </div> 

      <div className="p-3 border mt-5 border-gray-200 rounded w-full h-100 overflow-y-scroll noScroll">
        {searchTerm === "" ? (
          <p className="text-md text-gray-400">Search Results appear here</p>
        ) : searchedTeams && searchedTeams.teams?.length > 0 ? (
          searchedTeams.teams.map((t, i) => {
            const isSelected = selectedTeamIds.includes(t._id);
            return (
              <div
                key={i}
                onClick={() => toggleTeamSelection(t._id)}
                className={`text-md flex rounded shadow cursor-pointer flex-wrap items-center justify-between gap-3 px-4 py-1.5 border mb-3 font-medium transition-all
                  ${
                    isSelected
                      ? "bg-green-200 border-green-500"
                      : "hover:shadow-2xl hover:bg-gray-200 text-gray-900 border-gray-300"
                  }`}
              >
                <span>{t.name}</span>
                
              </div>
            );
          })
        ) : (
          <p className="text-md text-gray-400">
            No Teams found for this search!!!
          </p>
        )}
      </div>
    </div>
  );
};

export default SearchTeam;
