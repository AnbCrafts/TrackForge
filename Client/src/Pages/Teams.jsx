import React, { useContext, useEffect, useState } from "react";
import { TrackForgeContextAPI } from "../ContextAPI/TrackForgeContextAPI";
import {
  Link,
  matchPath,
  Outlet,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import PreviewTeam from "../Components/PreviewTeam";
import {
  Expand,
  Search,
  Shrink,
  Users,
} from "lucide-react";
import CreateTeamModal from "../Components/CreateTeamModal";

const Teams = () => {
  const location = useLocation();

  const {
    userTeams,
    getUsersTeam,
    getTeamByID,
    searchTeams,
    searchedTeams,
    authUserData,
    getUserDataById,
  } = useContext(TrackForgeContextAPI);

  const { hash, teamId, username } = useParams();
  const id = localStorage.getItem("userId");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    if (id) {
      getUsersTeam(id);
      if (!authUserData) {
        getUserDataById(id);
      }
    }
  }, [id, authUserData]);

  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (searchTerm !== "") searchTeams(searchTerm);
  }, [searchTerm]);

  const [hidePreview, setHidePreview] = useState(false);

  const isEditPage = matchPath(
    "/auth/:hash/:username/workspace/team/:teamId/edit",
    location.pathname
  );

  useEffect(() => {
    setHidePreview(isEditPage ? true : false);
  }, [location]);

  useEffect(() => {
    getTeamByID(teamId);
  }, [teamId]);

  useEffect(() => {
    setTimeout(() => setSearchTerm(""), 10000);
  }, [searchTerm]);

  return (
    <div className="bg-purple-50 p-5 shadow-inner min-h-screen">
      {/* HEADER BUTTONS */}
      <div className="p-5 flex items-center gap-5 w-full bg-white rounded-2xl border border-purple-100 shadow-sm mb-6 flex-wrap">
        <button className="px-4 py-1.5 border border-purple-300 bg-purple-700 text-white rounded-lg font-medium cursor-pointer hover:bg-purple-800 transition shadow">
          All Teams
        </button>

        <button className="px-4 py-1.5 border border-purple-200 text-purple-700 bg-white rounded-lg font-medium cursor-pointer hover:bg-purple-100 transition shadow">
          Archived Teams
        </button>

        {/* Create Team Button (Only Owner/Admin) */}
        {(authUserData?.role === "Owner" || authUserData?.role === "Admin") && (
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-1.5 bg-gradient-to-r from-purple-700 to-pink-600 hover:from-purple-800 hover:to-pink-750 text-white rounded-lg font-semibold cursor-pointer shadow transition"
          >
            + Create Team
          </button>
        )}

        {/* SEARCH BAR */}
        <div className="flex relative items-center gap-2 w-full max-w-sm ml-auto">
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            type="search"
            className="outline-none border rounded-xl shadow-sm focus:ring-2 focus:ring-purple-400 border-purple-200 p-2 w-full bg-white text-gray-800 text-sm"
            placeholder="Search teams..."
          />
          <Search className="absolute right-3 h-4 w-4 text-purple-500 pointer-events-none" />

          {searchTerm.length > 0 && (
            <div className="p-3 absolute top-11 bg-white z-10 border border-purple-200 rounded w-full max-h-80 overflow-y-scroll shadow-lg">
              {searchedTeams?.teams?.length > 0 ? (
                searchedTeams.teams.map((t, i) => (
                  <p
                    key={i}
                    onClick={() => {
                      setSearchTerm("");
                      navigate(`/auth/${hash}/${username}/workspace/team/${t._id}`);
                    }}
                    className="text-sm flex rounded-lg shadow-sm hover:bg-purple-50 transition cursor-pointer items-center justify-between gap-3 text-purple-900 px-4 py-2 border border-purple-100 mb-2 font-semibold"
                  >
                    {t.name}
                  </p>
                ))
              ) : (
                <p className="text-sm text-purple-400">No Teams found</p>
              )}
            </div>
          )}
        </div>

        {/* PREVIEW TOGGLE */}
        <div className="flex items-center gap-5">
          {hidePreview ? (
            <Shrink
              onClick={() => !isEditPage && setHidePreview(false)}
              className={`bg-purple-600 h-8 w-8 p-1.5 rounded-lg shadow text-white ${
                isEditPage ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
              }`}
            />
          ) : (
            <Expand
              onClick={() => !isEditPage && setHidePreview(true)}
              className={`bg-purple-600 h-8 w-8 p-1.5 rounded-lg shadow text-white ${
                isEditPage ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
              }`}
            />
          )}
        </div>
      </div>

      {/* CONTENT SECTION */}
      {(userTeams?.length > 0 || searchedTeams) ? (
        <div className="flex gap-5 items-start justify-between">
          {userTeams?.length > 0 && (
            <div>
              <PreviewTeam team={userTeams} hide={hidePreview} />
            </div>
          )}

          <div className="flex-1 bg-white rounded-xl shadow-lg border border-purple-200">
            <Outlet />
          </div>
        </div>
      ) : (
        <div className="bg-white border border-purple-100 rounded-2xl py-20 text-center shadow-sm">
          <Users className="h-12 w-12 text-purple-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-800">No Teams Found</h3>
        </div>
      )}

      {/* Create Team Modal */}
      <CreateTeamModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          getUsersTeam(id); // Refresh teams
        }}
      />
    </div>
  );
};

export default Teams;
