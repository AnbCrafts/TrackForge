import { MoveLeft, Search } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { TrackForgeContextAPI } from "../ContextAPI/TrackForgeContextAPI";
import { useParams } from "react-router-dom";

const SearchProjects = ({ selectedProjectIds, setSelectedProjectIds, toggle }) => {
  const { searchedProjects, searchProjects, formatDateTime } =
    useContext(TrackForgeContextAPI);

  const [searchTerm, setSearchTerm] = useState("");
  const [page] = useState(1); // page exists but no paging UI yet

  useEffect(() => {
    if (searchTerm.trim() !== "") {
      searchProjects(searchTerm, page);
    }
  }, [searchTerm]);

  const toggleProjectSelection = (projectId) => {
    if (selectedProjectIds.includes(projectId)) {
      setSelectedProjectIds(selectedProjectIds.filter((id) => id !== projectId));
    } else {
      setSelectedProjectIds([...selectedProjectIds, projectId]);
    }
  };

  return (
    <div className="flex-1 px-3">
      
      {/* Header Row */}
      <div className="flex items-center gap-4 mb-4">
        {toggle && (
          <MoveLeft
            onClick={() => toggle(false)}
            className="bg-gray-900 text-white rounded p-1 h-8 w-8 cursor-pointer hover:bg-gray-700 transition"
          />
        )}
        <h1 className="text-2xl font-semibold text-gray-800">Search Projects</h1>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
        <Search className="text-gray-600" />

        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          type="search"
          placeholder="Search projects..."
          className="flex-1 outline-none px-3 py-2 bg-gray-100 rounded text-gray-900"
        />
      </div>

      {/* Results */}
      <div className="p-3 border mt-5 border-gray-200 rounded w-full h-100 overflow-y-scroll noScroll">
        {searchTerm.trim() === "" ? (
          <p className="text-md text-gray-400">Search Results appear here</p>
        ) : searchedProjects?.projects?.length > 0 ? (
          searchedProjects.projects.map((p, i) => {
            const isSelected = selectedProjectIds.includes(p._id);

            return (
              <div
                key={i}
                onClick={() => toggleProjectSelection(p._id)}
                className={`text-md flex items-center justify-between rounded shadow cursor-pointer px-4 py-2 mb-3 border font-medium transition-all 
                  ${
                    isSelected
                      ? "bg-green-200 border-green-500"
                      : "hover:shadow-md hover:bg-gray-200 text-gray-900 border-gray-300"
                  }`}
              >
                <span className="font-semibold">{p.name}</span>

                <span className="text-sm text-gray-500 shrink-0">
                  {formatDateTime(p.startedOn)}
                </span>
              </div>
            );
          })
        ) : (
          <p className="text-md text-gray-400">
            No projects found for this search!
          </p>
        )}
      </div>
    </div>
  );
};

export default SearchProjects;
