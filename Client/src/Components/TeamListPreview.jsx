import { Clock, Leaf, LinkIcon, Search } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { TrackForgeContextAPI } from "../ContextAPI/TrackForgeContextAPI";

const TeamListPreview = ({ userTeams }) => {
  const { hash, username } = useParams();
  const navigate = useNavigate();

  const { formatDateTime, searchTeams, searchedTeams } =
    useContext(TrackForgeContextAPI);

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (searchTerm.trim() !== "") {
      searchTeams(searchTerm);
    }
  }, [searchTerm]);

  return (
    <div className="flex gap-5 flex-col lg:flex-row items-start justify-between">
      
      {/* LEFT — USER TEAMS */}
      <div className="flex flex-col gap-5 w-full lg:w-[60%] max-h-[80vh] overflow-y-auto noScroll">
        {userTeams && userTeams.length > 0 ? (
          userTeams.map((t, i) => (
            <div
              key={i}
              onClick={() =>
                navigate(
                  `/auth/${hash}/${username}/workspace/team/${t?.team?._id}`
                )
              }
              className="py-4 px-5 w-full bg-gray-50 border border-gray-200 rounded shadow hover:shadow-xl cursor-pointer transition"
            >
              <h2 className="text-xl flex items-center gap-3 font-semibold text-gray-900 mb-2">
                <Leaf className="h-8 w-8 p-1 rounded border border-gray-300 text-gray-900" />
                {t.team.name}
              </h2>

              {/* Link */}
              <div
                className="flex items-center gap-2 text-teal-500 font-medium text-sm mb-2 cursor-pointer"
                onClick={() => navigator.clipboard.writeText(t.team.link.url)}
              >
                <LinkIcon className="w-4 h-4" />
                <span className="truncate">{t.team.link.url}</span>
              </div>

              {/* Created On */}
              <div className="flex items-center gap-2 text-gray-600 text-xs">
                <Clock className="w-4 h-4" />
                Created on {formatDateTime(t.team.createdAt)}
              </div>
            </div>
          ))
        ) : (
          <p>No Teams</p>
        )}

        <div className="mx-auto mt-2">
          <Link
            to={`/auth/${hash}/${username}/workspace/team`}
            className="px-10 py-1.5 bg-gray-900 text-white rounded hover:bg-gray-800 transition"
          >
            Create another team
          </Link>
        </div>
      </div>

      {/* RIGHT — SEARCH TEAMS */}
      <div className="flex-1 p-5 w-full bg-white shadow rounded">
        <h1 className="text-center text-2xl mb-3">Search Teams to join</h1>

        <div className="border border-gray-200 rounded p-3 flex items-center gap-3">
          <Search />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            type="search"
            placeholder="Frontend dev..."
            className="outline-none px-4 py-2 bg-gray-100 rounded flex-1 text-gray-900"
          />
          <button className="py-1.5 px-4 bg-gray-100 text-gray-900 rounded hover:bg-gray-900 hover:text-white transition">
            Go
          </button>
        </div>

        {/* Search Results */}
        <div className="p-3 border mt-5 border-gray-200 rounded w-full h-96 overflow-y-scroll noScroll">
          {searchTerm === "" ? (
            <p className="text-md text-gray-400">Search Results appear here</p>
          ) : searchedTeams?.teams?.length > 0 ? (
            searchedTeams.teams.map((t, i) => (
              <div
                key={i}
                onClick={() =>
                  navigate(
                    `/auth/${hash}/${username}/workspace/team/${t._id}`
                  )
                }
                className="text-md flex rounded shadow hover:shadow-xl hover:bg-gray-200 transition cursor-pointer items-center justify-between px-4 py-2 border border-gray-300 mb-3 font-medium"
              >
                {t.name}
              </div>
            ))
          ) : (
            <p className="text-md text-gray-400">No Teams found for this search!!!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamListPreview;
