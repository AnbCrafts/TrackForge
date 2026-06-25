import React, { useContext, useEffect, useState } from "react";
import { TrackForgeContextAPI } from "../ContextAPI/TrackForgeContextAPI";
import { useNavigate, useParams } from "react-router-dom";
import ProjectPreview from "../Components/ProjectPreview";
import { FolderKanban, Search } from "lucide-react";
import CreateProjectModal from "../Components/CreateProjectModal";

const Projects = () => {
  const {
    getUserProjects,
    userProjects,
    searchProjects,
    searchedProjects,
    authUserData,
    getUserDataById,
  } = useContext(TrackForgeContextAPI);

  const { hash, username } = useParams();
  const navigate = useNavigate();
  const id = localStorage.getItem("userId");

  const [searchText, setSearchText] = useState("");
  const [list, setList] = useState("All");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    if (searchText !== "") {
      searchProjects(searchText, 1);
    }
  }, [searchText]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchText("");
    }, 10000);
    return () => clearTimeout(timer);
  }, [searchText]);

  useEffect(() => {
    if (id) {
      getUserProjects(id);
      if (!authUserData) {
        getUserDataById(id);
      }
    }
  }, [id, hash, authUserData]);

  return (
    <div className="bg-purple-50 p-5 shadow-inner min-h-screen">
      {/* HEADER ACTION BAR */}
      <div className="p-5 flex items-center gap-4 w-full bg-white rounded-2xl border border-purple-100 shadow-sm mb-6 flex-wrap">
        <button
          onClick={() => setList("All")}
          className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
            list === "All"
              ? "bg-purple-700 text-white"
              : "border border-purple-200 text-purple-700 bg-white hover:bg-purple-50"
          }`}
        >
          All
        </button>

        <button
          onClick={() => setList("Archived")}
          className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
            list === "Archived"
              ? "bg-purple-700 text-white"
              : "border border-purple-200 text-purple-700 bg-white hover:bg-purple-50"
          }`}
        >
          Archived
        </button>

        <button
          onClick={() => setList("Un-archived")}
          className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
            list === "Un-archived"
              ? "bg-purple-700 text-white"
              : "border border-purple-200 text-purple-700 bg-white hover:bg-purple-50"
          }`}
        >
          Un-archived
        </button>

        {/* Create Project Button (Only Owner/Admin) */}
        {(authUserData?.role === "Owner" || authUserData?.role === "Admin") && (
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-1.5 bg-gradient-to-r from-purple-700 to-pink-600 hover:from-purple-800 hover:to-pink-750 text-white rounded-lg font-semibold cursor-pointer shadow transition"
          >
            + Create Project
          </button>
        )}

        {/* SEARCH BAR */}
        <div className="flex relative items-center gap-2 w-full max-w-sm ml-auto">
          <input
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            type="search"
            className="outline-none border rounded-xl shadow-sm focus:ring-2 focus:ring-purple-400 border-purple-200 p-2 w-full bg-white text-gray-800 text-sm"
            placeholder="Search projects..."
          />
          <Search className="absolute right-3 h-4 w-4 text-purple-500 pointer-events-none" />

          {searchText !== "" && searchedProjects !== null && searchedProjects.projects?.length > 0 && (
            <div className="p-3 absolute top-11 bg-white z-10 border border-purple-200 rounded w-full max-h-80 overflow-y-scroll shadow-lg">
              {searchedProjects.projects.map((p, i) => (
                <p
                  key={i}
                  onClick={() => {
                    setSearchText("");
                    navigate(`/auth/${hash}/${username}/workspace/projects/${p._id}`);
                  }}
                  className="text-sm flex rounded-lg shadow-sm hover:bg-purple-50 transition cursor-pointer items-center justify-between gap-3 text-purple-900 px-4 py-2 border border-purple-100 mb-2 font-semibold"
                >
                  {p.name}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* CONTENT LIST */}
      {userProjects && userProjects.projects && userProjects.projects.length > 0 ? (
        <ProjectPreview projects={userProjects} />
      ) : (
        <div className="bg-white border border-purple-100 rounded-2xl py-20 text-center shadow-sm">
          <FolderKanban className="h-12 w-12 text-purple-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-800">No Projects Found</h3>
        </div>
      )}

      {/* Create Project Modal */}
      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          if (id) getUserProjects(id); // Refresh project list
        }}
      />
    </div>
  );
};

export default Projects;
