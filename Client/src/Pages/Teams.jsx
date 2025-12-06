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
  GroupIcon,
  Search,
  Shrink,
  X,
} from "lucide-react";
import SearchUser from "../Components/SearchUser";
import SearchProjects from "../Components/SearchProjects";

const Teams = () => {
  const location = useLocation();

  const {
    userTeams,
    getUsersTeam,
    getTeamByID,
    teamData,
    searchTeams,
    searchedTeams,
    createTeam,
  } = useContext(TrackForgeContextAPI);

  const { hash, teamId, username } = useParams();
  const id = localStorage.getItem("userId");

  useEffect(() => {
    if (id) getUsersTeam(id);
  }, [id]);

  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (searchTerm !== "") searchTeams(searchTerm);
  }, [searchTerm]);

  const [selectedProjectIds, setSelectedProjectIds] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState([]);

  const [teamForm, setTeamForm] = useState({
    name: "",
    projects: selectedProjectIds,
    createdBy: id,
    members: [{ participant: "", joinedAt: "" }],
  });

  useEffect(() => {
    if (selectedUserIds?.length > 0) {
      const data = selectedUserIds.map((uid) => ({
        participant: uid,
        joinedAt: new Date().toISOString(),
      }));

      setTeamForm((prev) => ({ ...prev, members: data }));
    }
  }, [selectedUserIds]);

  useEffect(() => {
    if (selectedProjectIds?.length > 0) {
      setTeamForm((prev) => ({ ...prev, projects: [...selectedProjectIds] }));
    }
  }, [selectedProjectIds]);

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

  const submitHandler = async (e) => {
    e.preventDefault();

    await createTeam(teamForm);

    setTeamForm({
      name: "",
      projects: [],
      createdBy: id,
      members: [{ participant: "", joinedAt: "" }],
    });

    setSelectedProjectIds([]);
    setSelectedUserIds([]);
  };


  const [addEntity,setAddEntity] = useState("User");

  return (
    <div className="bg-purple-50 p-5 shadow-inner min-h-screen">
      {/* HEADER BUTTONS */}
      <div className="p-5 flex items-center gap-5 w-full">
        <button className="px-4 py-1.5 border border-purple-300 bg-purple-700 text-white rounded-lg font-medium cursor-pointer hover:bg-purple-800 transition shadow">
          All Teams
        </button>

        <button className="px-4 py-1.5 border border-purple-200 text-purple-700 bg-white rounded-lg font-medium cursor-pointer hover:bg-purple-100 transition shadow">
          Archived Teams
        </button>

        {/* SEARCH BAR */}
        <div className="flex relative items-center gap-2 w-full max-w-lg">
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            type="search"
            className="outline-none border rounded-md shadow-sm focus:ring-2 focus:ring-purple-400 border-purple-300 p-2 w-full bg-white"
            placeholder="Search - Frontend Devs..."
          />
          <Search
            className={`h-9 w-9 p-1 ${
              searchTerm.length > 0
                ? "bg-purple-700 text-white"
                : "border border-purple-400 bg-purple-300 text-purple-900"
            } rounded-lg cursor-pointer transition`}
          />

          {searchTerm.length > 0 && (
            <div className="p-3 absolute top-10 bg-white z-10 border border-purple-200 rounded w-full max-h-80 overflow-y-scroll shadow-lg">
              {searchedTeams?.teams?.length > 0 ? (
                searchedTeams.teams.map((t, i) => (
                  <p
                    key={i}
                    onClick={() =>
                      navigate(`/auth/${hash}/${username}/workspace/team/${t._id}`)
                    }
                    className="text-md flex rounded-lg shadow hover:bg-purple-100 transition cursor-pointer items-center justify-between gap-3 text-purple-900 px-4 py-2 border border-purple-200 mb-3"
                  >
                    {t.name}
                  </p>
                ))
              ) : (
                <p className="text-md text-purple-400">No Teams found</p>
              )}
            </div>
          )}
        </div>

        {/* PREVIEW TOGGLE */}
        <div className="flex items-center gap-5">
          {hidePreview ? (
            <Shrink
              onClick={() => !isEditPage && setHidePreview(false)}
              className={`bg-purple-600 h-8 w-8 p-1 rounded-lg shadow text-white ${
                isEditPage ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
              }`}
            />
          ) : (
            <Expand
              onClick={() => !isEditPage && setHidePreview(true)}
              className={`bg-purple-600 h-8 w-8 p-1 rounded-lg shadow text-white ${
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
        <p className="text-lg font-medium text-purple-700">No Teams Found</p>
      )}

      {/* CREATE NEW TEAM */}
      <div className="p-5 mt-8 bg-white rounded-xl shadow border border-purple-200">
        <h1 className="text-3xl text-purple-800 mb-5 font-semibold">
          Create Your Own Team
        </h1>

        <form
          onSubmit={submitHandler}
          className="border border-purple-200 w-full p-10 rounded-xl shadow-lg bg-purple-50"
        >
          {/* Team Name */}
          <div className="flex items-center justify-between gap-5 mb-5 max-w-3xl">
            <label
              htmlFor="name"
              className="flex items-center gap-2 text-purple-700 text-lg w-3xs"
            >
              <GroupIcon /> Team Name
            </label>

            <input
              value={teamForm.name}
              onChange={(e) =>
                setTeamForm((prev) => ({ ...prev, name: e.target.value }))
              }
              type="text"
              id="name"
              className="py-2 px-3 outline-none border border-purple-300 text-purple-700 shadow bg-white rounded-lg w-full max-w-lg"
              placeholder="Tech-knight..."
            />
          </div>

          {/* USERS + PROJECTS */}
          <div className="flex items-start justify-between gap-5 mt-10">
            {/* USERS */}
            <div className='flex items-center justify-between gap-1 border border-gray-50'>
        <span className={`flex-1 px-5 py-3 rounded text-center ${addEntity==="User"?"bg-purple-600 text-white":"bg-white text-purple-700 border border-purple-600"} transition-all cursor-pointer font-medium text-lg`} onClick={()=>setAddEntity("User")}>Users</span>
        <span className={`flex-1 px-5 py-3 rounded text-center ${addEntity==="Project"?"bg-purple-600 text-white":"bg-white text-purple-700 border border-purple-600"} transition-all cursor-pointer font-medium text-lg`} onClick={()=>setAddEntity("Project")}>Projects</span>

      </div>

      {
        addEntity ==="User"
        &&
        (
            <div className="w-full">
              <SearchUser
                selectedUserIds={selectedUserIds}
                setSelectedUserIds={setSelectedUserIds}
              />

              {selectedUserIds?.length > 0 && (
                <div className="p-5 mt-5 flex flex-wrap gap-2">
                  {selectedUserIds.map((u, i) => {
                    const maskedId = u.slice(0, 5) + "*".repeat(u.length - 5);

                    return (
                      <span
                        key={i}
                        className="flex items-center gap-2 px-3 py-1 bg-purple-200 rounded-lg text-sm font-mono shadow"
                      >
                        {maskedId}
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedUserIds((prev) =>
                              prev.filter((id) => id !== u)
                            )
                          }
                          className="text-purple-800 hover:text-red-600 transition"
                        >
                          <X size={14} />
                        </button>
                      </span>
                    );
                  })}
                </div>
              )}
            </div>

        )
      }

      {
        addEntity ==="Project"
        &&
        (
            <div className="w-full">
              <SearchProjects
                selectedProjectIds={selectedProjectIds}
                setSelectedProjectIds={setSelectedProjectIds}
              />

              {selectedProjectIds?.length > 0 && (
                <div className="p-5 mt-5 flex flex-wrap gap-2">
                  {selectedProjectIds.map((u, i) => {
                    const maskedId = u.slice(0, 5) + "*".repeat(u.length - 5);

                    return (
                      <span
                        key={i}
                        className="flex items-center gap-2 px-3 py-1 bg-purple-200 rounded-lg text-sm font-mono shadow"
                      >
                        {maskedId}
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedProjectIds((prev) =>
                              prev.filter((id) => id !== u)
                            )
                          }
                          className="text-purple-800 hover:text-red-600 transition"
                        >
                          <X size={14} />
                        </button>
                      </span>
                    );
                  })}
                </div>
              )}
            </div>

        )
      }


            {/* PROJECTS */}

          </div>

          {/* SUBMIT BUTTON */}
          <div className="w-fit mx-auto my-10">
            <button
              type="submit"
              className='px-6 py-1.5 rounded shadow border text-gradient cursor-pointer hover:bg-purple-500 font-medium text-lg hover:text-white transition-all'
            >
              Create Team
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Teams;
