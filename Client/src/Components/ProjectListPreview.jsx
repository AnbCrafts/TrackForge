import {
  Leaf,
  LogOut,
  PersonStanding,
  Search,
  Trash,
} from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { TrackForgeContextAPI } from "../ContextAPI/TrackForgeContextAPI";

const ProjectListPreview = ({ projects }) => {
  const { searchProjects, searchedProjects, formatDateTime } =
    useContext(TrackForgeContextAPI);

  const { username, hash } = useParams();
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  // 🔍 Search on typing
  useEffect(() => {
    if (searchTerm.trim() !== "") {
      searchProjects(searchTerm, page);
    }
  }, [searchTerm]);

  return (
    <div className="flex flex-col md:flex-row items-start gap-6 w-full">
      {/* ------------------------- LEFT — PROJECT LIST ------------------------- */}
      <div className="w-full md:w-1/2 lg:w-2/5 flex flex-col gap-5 max-h-[80vh] overflow-y-scroll noScroll p-2">

        {projects?.projects?.length ? (
          projects.projects.map((p, index) => {
            const { project, owner } = p;
            return (
              <div
                key={index}
                onClick={() =>
                  navigate(`/auth/${hash}/${username}/workspace/projects/${project._id}`)
                }
                className="p-4 bg-white border border-gray-200 hover:border-gray-300 shadow rounded-lg flex justify-between items-start transition cursor-pointer hover:shadow-lg"
              >
                <div>
                  <h3 className="flex items-center gap-2 text-xl font-semibold text-gray-900 mb-2">
                    <Leaf className="h-7 w-7 p-1 border border-gray-300 rounded text-gray-900" />
                    {project.name}
                  </h3>

                  <p className="flex items-center gap-2 text-sm text-gray-500 py-1 border-t border-gray-100 pt-3">
                    <PersonStanding className="h-7 w-7 p-1 border border-gray-300 rounded text-gray-900" />
                    {owner.username} • {owner.email}
                  </p>
                </div>

                {/* Delete / Leave Project Buttons */}
                <div className="flex items-center gap-3 shrink-0">
                  <Trash className="p-1 text-red-500 h-8 w-8 border border-gray-300 rounded-full hover:bg-gray-200 transition" />
                  <LogOut className="p-1 text-red-500 h-8 w-8 border border-gray-300 rounded-full hover:bg-gray-200 transition" />
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-gray-500">No Projects Found</p>
        )}

        {/* Create Project Button */}
        <div className="mt-4">
          <Link
            to={`/auth/${hash}/${username}/workspace/projects`}
            className="px-8 py-2 bg-gray-900 text-white rounded shadow hover:bg-gray-800 transition"
          >
            Create another project
          </Link>
        </div>
      </div>

      {/* ------------------------- RIGHT — SEARCH PROJECTS ------------------------- */}
     
      <div className="flex-1 p-5 bg-white shadow rounded-lg">

        <h2 className="text-center text-2xl font-semibold text-gray-800">
          Search Projects to Join
        </h2>

        {/* Search Bar */}
        <div className="mt-5 border border-gray-200 rounded-lg p-3 flex items-center gap-3 bg-gray-50">
          <Search className="text-gray-600" />

          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            type="search"
            placeholder="Search projects..."
            className="outline-none px-3 py-2 bg-gray-100 rounded flex-1 text-gray-900"
          />

          <button className="py-2 px-4 bg-gray-200 rounded hover:bg-gray-900 hover:text-white transition">
            Go
          </button>
        </div>

        {/* Search Results */}
        <div className="mt-5 p-3 border border-gray-200 rounded h-[400px] overflow-y-scroll noScroll">

          {searchTerm === "" ? (
            <p className="text-gray-400">Search results will appear here...</p>
          ) : searchedProjects?.projects?.length > 0 ? (
            searchedProjects.projects.map((p, i) => (
              <div
                key={i}
                onClick={() =>
                  navigate(`/auth/${hash}/${username}/workspace/projects/${p._id}`)
                }
                className="flex justify-between items-center text-gray-900 bg-gray-100 px-4 py-2 border border-gray-300 rounded mb-3 hover:bg-gray-200 shadow transition cursor-pointer"
              >
                <span className="font-medium">{p.name}</span>
                <span className="text-sm text-gray-500 shrink-0">
                  {formatDateTime(p.startedOn)}
                </span>
              </div>
            ))
          ) : (
            <p className="text-gray-400">No projects found matching your search.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectListPreview;
