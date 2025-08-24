import {
  Clock,
  Group,
  IndentIncrease,
  Leaf,
  Link2,
  Rocket,
  Skull,
  StepBack,
  Trash,
  Trophy,
  Users,
  Workflow,
} from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { TrackForgeContextAPI } from "../ContextAPI/TrackForgeContextAPI";
import SearchProjects from "../Components/SearchProjects";
import SearchUser from "../Components/SearchUser";
import { toast } from "react-toastify";

const EditTeam = () => {
  const { username, hash, teamId } = useParams();
  const { teamData, getTeamByID, formatDateTime, updateTeam } =
    useContext(TrackForgeContextAPI);

  const [selectedProjectIds, setSelectedProjectIds] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState([]);

  useEffect(() => {
    teamId && getTeamByID(teamId);
  }, [teamId]);



  const [customUrl, setCustomUrl] = useState("");
  const [showProjectSearch, setShowProjectSearch] = useState(false);
  const [showUserSearch, setShowUserSearch] = useState(false);

  const [teamUpdateForm, setTeamUpdateForm] = useState({
    name: "",
    projects: [], 
    members: [
      {
        participant: "",
        joinedAt: Date.now(),
      },
    ],
    link: {
      url: "",
      createdAt: "",
      validTill: "",
      createdBy: "",
      status: "Active",
    },
  });

  // Sync teamData into local form state safely (merge nested link too)
  useEffect(() => {
    if (teamData?.raw) {
      setTeamUpdateForm((prev) => ({
        ...prev,
        name: teamData.raw.name ?? prev.name,
        projects: Array.isArray(teamData.raw.projects)
          ? teamData.raw.projects
          : prev.projects,
        members: Array.isArray(teamData.raw.members)
          ? teamData.raw.members
          : prev.members,
        link: {
          ...prev.link,
          ...(teamData.raw.link ? teamData.raw.link : {}),
        },
      }));
      // Pre-fill selected ids so search previews show them (optional but helpful)
      if (Array.isArray(teamData.raw.projects)) {
        setSelectedProjectIds(teamData.raw.projects);
      }
      if (Array.isArray(teamData.raw.members)) {
        // if members in teamData.raw are objects with participant or _id, map to ids
        const ids = teamData.raw.members.map((m) => m.participant ?? m._id ?? m);
        setSelectedUserIds(ids.filter(Boolean));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamData]);

  // Set projects from selectedProjectIds
  useEffect(() => {
    setTeamUpdateForm((prev) => ({
      ...prev,
      projects: selectedProjectIds,
    }));
  }, [selectedProjectIds]);

  // Build members array correctly from selectedUserIds
  // Build members array correctly from selectedUserIds
useEffect(() => {
  if (selectedUserIds && selectedUserIds.length > 0) {
    const memberSchema = selectedUserIds.map((id) => {
      // try to find existing member in teamData.raw.members
      const existing = teamData?.raw?.members?.find(
        (m) => m.participant === id || m._id === id
      );
      return {
        participant: id,
        joinedAt: existing?.joinedAt ?? new Date().toISOString(), // keep old if available
      };
    });

    setTeamUpdateForm((prev) => ({
      ...prev,
      members: memberSchema,
    }));
  }
}, [selectedUserIds, teamData]);


  const [newValidity, setNewValidity] = useState("");

  // Improved isEmpty: check required fields explicitly (avoids false positives)
  const isEmpty = (form) => {
    if (!form || typeof form !== "object") return true;

    // name
    if (!form.name || String(form.name).trim() === "") return true;

    // projects
    if (!Array.isArray(form.projects) || form.projects.length === 0) return true;

    // members (each must have a participant)
    if (!Array.isArray(form.members) || form.members.length === 0) return true;
    for (const m of form.members) {
      if (!m || (!m.participant && m.participant !== 0)) return true;
      if (typeof m.participant === "string" && m.participant.trim() === "")
        return true;
    }

    // link
    if (!form.link) return true;
    if (!form.link.url || String(form.link.url).trim() === "") return true;
    if (!form.link.createdBy || String(form.link.createdBy).trim() === "")
      return true;
    if (!form.link.validTill) return true;

    return false; // no required fields empty
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    // Build final payload WITHOUT relying on setState (setState is async)
    const payload = { ...teamUpdateForm };


    // If user entered a customUrl (input), create a fresh link object. Otherwise keep existing link.
    if (customUrl && customUrl.trim() !== "") {
      const id = localStorage.getItem("userId");
      const tId = teamId;
      payload.link = {
        url: `https://track-forge/invite/team/${tId}/creator-${id}-${customUrl}`,
        createdAt: Date.now() + 3 * 60 * 1000, // 3 minutes ahead as you asked earlier
        createdBy: id,
        validTill:
          newValidity && newValidity !== ""
            ? new Date(newValidity).getTime()
            : Date.now() + 7 * 24 * 60 * 60 * 1000,
        status: payload.link?.status ?? "Active",
      };
    } else {
      // If link.url is empty in form, fallback to existing teamData raw link (as original code intended)
      if ((!payload.link || !payload.link.url) && teamData?.raw?.link) {
        payload.link = {
          ...teamData.raw.link,
        };
      } else {
        // ensure validTill is numeric timestamp if user entered date string earlier
        if (payload.link?.validTill && typeof payload.link.validTill === "string") {
          const t = new Date(payload.link.validTill).getTime();
          if (!Number.isNaN(t)) {
            payload.link.validTill = t;
          }
        }
      }
    }

    const path = `/auth/${hash}/${username}/workspace/team/${teamId}`;

    if (isEmpty(payload)) {
      toast.warn("Some fields are empty");
      return;
    }

      console.log("Payload sent to backend:", payload);


    try {
      await updateTeam(teamId, payload, path);

      toast.success("Team updated successfully");
    } catch (err) {
      console.error("updateTeam error:", err);
      toast.error("Failed to update team");
    }
  };

  return (
    <div className="min-h-[100vh] w-full">
      <Link
        to={`/auth/${hash}/${username}/workspace/team/${teamId}`}
        className="p-3 block mb-3"
      >
        <StepBack className="h-9 w-9 p-1 bg-gray-600 text-white rounded shadow hover:bg-gray-900 hover:text-white transition-all cursor-pointer" />
      </Link>

      <div className="w-full h-full p-3">
        {/* ADDED onSubmit to trigger handleUpdate */}
        <form
          onSubmit={handleUpdate}
          className="w-full h-full p-3 border border-gray-200 rounded"
        >
          <h1 className="text-2xl font-medium text-gray-500 mb-4">
            Edit Team Info
          </h1>

          <div className="flex items-start justify-between gap-5">
            <div>
              <div className="flex items-start justify-start w-2xl mb-7">
                <label
                  htmlFor="name"
                  className="flex items-center text-gray-500 justify-start text-lg gap-2 w-50 "
                >
                  <Group />
                  <span className="font-medium ">Title :</span>
                </label>

                <input
                  onChange={(e) =>
                    setTeamUpdateForm((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  value={teamUpdateForm.name}
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Tech knights..."
                  className="flex-1 border border-gray-200 px-3 py-2 rounded outline-none"
                />
              </div>

              <div className="flex items-start justify-start w-2xl mb-7">
                <label
                  htmlFor="members"
                  className="flex items-center text-gray-500 justify-start text-lg gap-2 w-50 "
                >
                  <Users />
                  <span className="font-medium ">Members :</span>
                </label>

                <div className="flex-1">
                  {teamData && teamData.members && teamData.members.length > 0 ? (
                    teamData.members.map((m) => {
                      return (
                        <p
                          className=" w-full flex items-center justify-between px-2 py-1.5 mb-2 border border-gray-200 rounded"
                          key={m._id}
                        >
                          <div className="flex items-center justify-start gap-2">
                            <span>{m.firstName}</span>
                            <span>({m.username})</span>
                          </div>
                          <div className="flex items-center justify-start gap-2">
                            <span>{m.role}</span>
                            {m.role === "Admin" || m.role === "Owner" ? (
                              <Trophy className="bg-green-500 text-white rounded p-0.5" />
                            ) : (
                              <Trash className="bg-red-500 cursor-pointer text-white rounded p-0.5" />
                            )}
                          </div>
                        </p>
                      );
                    })
                  ) : (
                    <p>No Members found for this team</p>
                  )}

                  {!showUserSearch && (
                    <span
                      onClick={() => setShowUserSearch(!showUserSearch)}
                      className="px-4 py-1 mt-3 block border border-gray-200 w-fit bg-gray-900 text-white rounded  cursor-pointer "
                    >
                      Search Users
                    </span>
                  )}

                  { selectedUserIds.length > 0 && (
                    <div className="mt-5 p-3 border-gray-100 border rounded shadow">
                      <h1 className="mb-2">Selected Users to add</h1>

                      <div className="flex items-center justify-start gap-3 flex-wrap">
                        {selectedUserIds.length > 0
                          ? selectedUserIds.map((u, i) => {
                              return (
                                <span
                                  className="bg-gray-200 px-1.5 py-0.5 text-sm rounded shadow"
                                  key={i}
                                >
                                  {u}
                                </span>
                              );
                            })
                          : ""}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-start justify-start w-2xl mb-7">
                <label
                  htmlFor="project"
                  className="flex items-center text-gray-500 justify-start text-lg gap-2 w-50 "
                >
                  <Leaf />
                  <span className="font-medium ">Projects :</span>
                </label>

                <div className="flex-1">
                  <div>
                    {teamData && teamData.projects && teamData.projects.length > 0 ? (
                      teamData.projects.map((p) => {
                        return (
                          <p
                            className=" w-full flex items-center justify-between px-2 py-1.5 mb-2 border border-gray-200 rounded"
                            key={p._id}
                          >
                            <span>{p.name}</span>
                            <Trash className="bg-red-500 cursor-pointer text-white rounded p-0.5" />
                          </p>
                        );
                      })
                    ) : (
                      <p>No Projects found for this team, add !!</p>
                    )}
                  </div>

                  {!showProjectSearch ? (
                    <span
                      onClick={() => setShowProjectSearch(!showProjectSearch)}
                      className="px-4 py-1 mt-3 block border border-gray-200 w-fit bg-gray-900 text-white rounded  cursor-pointer "
                    >
                      Search projects
                    </span>
                  ) : selectedProjectIds.length > 0 ? (
                    <div className="mt-5 p-3 border-gray-100 border rounded shadow">
                      <h1 className="mb-2">Selected Projects to add</h1>

                      <div className="flex items-center justify-start gap-3 flex-wrap">
                        {selectedProjectIds.length > 0
                          ? selectedProjectIds.map((m, i) => {
                              return (
                                <span
                                  className="bg-gray-200 px-1.5 py-0.5 text-sm rounded shadow"
                                  key={i}
                                >
                                  {m}
                                </span>
                              );
                            })
                          : ""}
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="flex items-start justify-start w-2xl mb-7">
                <label
                  htmlFor="link"
                  className="flex items-center text-gray-500 justify-start text-lg gap-2 w-50 "
                >
                  <Link2 />
                  <span className="font-medium ">Link :</span>
                </label>

                <input
                  value={teamUpdateForm.link?.url || ""}
                  type="text"
                  name="link"
                  id="link"
                  onChange={(e) => setCustomUrl(e.target.value)}
                  className="flex-1 border border-gray-200 px-3 py-2 rounded outline-none"
                />
                <Trash className="bg-red-500 ml-3 cursor-pointer text-white rounded p-0.5" />
              </div>

              <div className="flex items-start justify-start w-2xl mb-7">
                <label
                  htmlFor="validity"
                  className="flex items-center text-gray-500 justify-start text-lg gap-2 w-50 "
                >
                  <Clock />
                  <span className="font-medium ">Validity :</span>
                </label>

                <div className="flex-1">
                  <div className="w-full flex items-center justify-start">
                    {/* show current validity from form (not from teamData directly) */}
                    <input
                      value={formatDateTime(teamUpdateForm?.link?.validTill)}
                      type="text"
                      name="validity"
                      id="validity"
                      readOnly
                      className="flex-1 border border-gray-200 px-3 py-2 rounded outline-none bg-gray-100"
                    />
                    {Date.now() >
                    (new Date(teamUpdateForm?.link?.validTill).getTime() || 0) ? (
                      <Skull className="bg-red-500 ml-3 cursor-pointer text-white rounded p-0.5" />
                    ) : (
                      <Rocket className="bg-green-500 ml-3 cursor-pointer text-white rounded p-0.5" />
                    )}
                  </div>
                </div>
              </div>

              <div className="w-full mt-3">
                {Date.now() >
                  (new Date(teamUpdateForm?.link?.validTill).getTime() || 0) && (
                  <div>
                    <p className="text-gray-600 mb-3">
                      Link has expired , expand date or create new Link
                    </p>
                    <div className="flex items-start justify-start w-2xl mb-7">
                      <label
                        htmlFor="validTill"
                        className="flex items-center text-gray-500 justify-start text-lg gap-2 w-50 "
                      >
                        <Group />
                        <span className="font-medium ">Title :</span>
                      </label>

                      <input
                        onChange={(e) => setNewValidity(e.target.value)}
                        value={newValidity}
                        type="date"
                        name="validTill"
                        id="validTill"
                        placeholder="Add a time"
                        className="flex-1 border border-gray-200 px-3 py-2 rounded outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className=" flex-1 h-auto">
              {showProjectSearch && (
                <SearchProjects
                  toggle={setShowProjectSearch}
                  selectedProjectIds={selectedProjectIds}
                  setSelectedProjectIds={setSelectedProjectIds}
                />
              )}

              {showUserSearch && (
                <SearchUser
                  toggle={setShowUserSearch}
                  selectedUserIds={selectedUserIds}
                  setSelectedUserIds={setSelectedUserIds}
                />
              )}
            </div>
          </div>

          <div className="my-15 mx-auto w-fit">
            <button
              type="submit"
              className="px-10 py-2 border border-gray-200 rounded font-medium cursor-pointer hover:bg-green-500 hover:text-white transition-all"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTeam;
