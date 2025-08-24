import React, { useContext, useEffect, useState } from "react";
import { TrackForgeContextAPI } from "../ContextAPI/TrackForgeContextAPI";
import { useNavigate, useParams } from "react-router-dom";
import { Activity, Archive, Clock, Crown, Database, Delete, File, Group, StepBack, Text, Trash, User, Users } from "lucide-react";
import SearchTeam from "../Components/SearchTeams";
import SearchUser from "../Components/SearchUser";

const EditProject = () => {
  const { updateProject, projectById, project } =
    useContext(TrackForgeContextAPI);
  const { projectId, hash, username } = useParams();
  const [selectedMemberIds, setSelectedMembersIds] = useState([]);
  const [selectedTeamIds, setSelectedTeamIds] = useState([]);

  useEffect(() => {
    projectById(projectId);
  }, [projectId]);

  const [updateProjectForm, setUpdateProjectForm] = useState({
    name: "",
    description: "",
    owner: "",
    members: [],
    teams: [],
    activity: [],
    startedOn: "",
    deadline: "",
    archived: false,
  });

  useEffect(() => {
    if (project && Object.keys(project).length > 0) {
      setUpdateProjectForm((prev) => ({
        ...prev,
    name: project?.project?.name,
    description: project?.project?.description,
    owner: project?.project?.owner,
    members: project?.members,
    teams: project?.teams,
    activity: project?.project?.activity,
    startedOn:project?.project?.startedOn,
    deadline: project?.project?.deadline,
    archived: project?.project?.archived,
      }));

      setSelectedMembersIds((prev) =>
  prev.length > 0 ? prev : (project.members ? project.members.map(m => m._id) : [])
);

setSelectedTeamIds((prev) =>
  prev.length > 0 ? prev : (project.teams ? project.teams.map(t => t._id) : [])
);

    }
  }, [project]);


 const submitUpdateForm = async (e) => {
  e.preventDefault();

  const id = localStorage.getItem("userId");

  // create payload with updated teams & members
  const payload = {
    ...updateProjectForm,
    teams: selectedTeamIds,
    members: selectedMemberIds,
  };

  // update state (so UI stays in sync)
  setUpdateProjectForm(payload);

  // call API with fresh payload
  updateProject(projectId, id, payload);
};







  const navigate = useNavigate();

  return (
    <div className="min-h-[100vh] p-3">

      <div className="p-3 mb-5 w-full bg-white text-gray-900 flex items-center justify-start gap-5">

        <StepBack onClick={()=>navigate(`/auth/${hash}/${username}/workspace/projects/${projectId}`)} className="h-9 w-9 p-1.5 cursor-pointer rounded-full bg-gray-900 text-white"/>
        <h1 className="font-medium text-2xl">Go back to project</h1>

      </div>
      
      
      <div className=" flex items-start justify-between gap-5">
        <form onSubmit={submitUpdateForm} className="flex-1 max-w-3xl bg-white h-full p-3 border border-gray-200 rounded text-gray-900">
            <div className="mb-20 p-3 border-b border-gray-200">
  <h1 className="text-2xl font-bold text-gray-800">Update Project</h1>
  <p className="mt-2 text-gray-600">
    Make changes to your project details below. You can update the project name, description, members, teams, start and deadline dates, or archive status. 
    All updates will be reflected immediately and tracked in the project activity log.
  </p>
</div>


         
          <div className="flex items-start justify-start gap-3 mb-8">
            <label
              htmlFor="name"
              className="text-gray-600 flex items-center justify-start gap-2 w-40"
            >
              <Database className="" /> Project:
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={updateProjectForm?.name}
              onChange={(e) =>
                setUpdateProjectForm((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
              className="flex-1 border border-gray-200 px-3 py-2 rounded outline-none"
            />
          </div>

          <div className="flex items-start justify-start gap-3 mb-8">
            <label
              htmlFor="description"
              className="text-gray-600 flex items-center justify-start gap-2 w-40"
            >
              <Text className="" /> Description:
            </label>
            <textarea
              type="text"
              name="description"
              id="description"
              value={updateProjectForm?.description}
              onChange={(e) =>
                setUpdateProjectForm((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              className="flex-1 border border-gray-200 px-3 py-2 rounded outline-none h-80 overflow-y-scroll noScroll"
            />
          </div>
        
        <div className="flex items-start justify-start gap-3 mb-8">
            <label
              htmlFor="startedOn"
              className="text-gray-600 flex items-center justify-start gap-2 w-40"
            >
              <Clock className="" /> Started On:
            </label>

            <input
              type="text"
              name="startedOn"
              id="startedOn"
              value={Date(updateProjectForm?.startedOn)}
              readOnly
              className="flex-1 bg-gray-600 text-white px-3 py-2 rounded outline-none cursor-not-allowed"

            />
            <input
              type="date"
              name="startedOn"
              id="startedOn"
              value={updateProjectForm?.startedOn}
              onChange={(e) =>
                setUpdateProjectForm((prev) => ({
                  ...prev,
                  startedOn: e.target.value,
                }))
              }
              className="flex-1 border border-gray-200 px-3 py-2 rounded outline-none"
            />
          </div>

           <div className="flex items-start justify-start gap-3 mb-8">
            <label
              htmlFor="deadline"
              className="text-gray-600 flex items-center justify-start gap-2 w-40"
            >
              <Clock className="" /> Deadline :
            </label>

            <input
              type="text"
              name="deadline"
              id="deadline"
              value={Date(updateProjectForm?.deadline)}
              readOnly
              className="flex-1 bg-gray-600 text-white px-3 py-2 rounded outline-none cursor-not-allowed"

            />
            <input
              type="date"
              name="deadline"
              id="deadline"
              value={updateProjectForm?.deadline}
              onChange={(e) =>
                setUpdateProjectForm((prev) => ({
                  ...prev,
                  deadline: e.target.value,
                }))
              }
              className="flex-1 border border-gray-200 px-3 py-2 rounded outline-none"
            />
          </div>

        <div className="flex items-start justify-start gap-3 mb-8">
            <label
              htmlFor="archived"
              className="text-gray-600 flex items-center justify-start gap-2 w-40"
            >
              <Archive className="" /> Status:
            </label>
            <input
              type="text"
              name="archived"
              id="archived"
              value={updateProjectForm?.archived?"Archived":"Active"}
              readOnly
              className="flex-1 bg-gray-600 text-white px-3 py-2 rounded outline-none cursor-not-allowed"
            />

            <select name="archived" id="archived"
              className="flex-1 border border-gray-200 px-3 py-2 rounded outline-none"
            >
                <option value={updateProjectForm?.archived}>
                {updateProjectForm?.archived?"Archive":"Activate"}
                </option>
                <option value={!(updateProjectForm?.archived)}>
                {!(updateProjectForm?.archived)?"Archive":"Activate"}

                </option>
            </select>
          </div> 

          <div className="flex items-start justify-start gap-3 mb-8">
            <label
              htmlFor="members"
              className="text-gray-600 flex items-center justify-start gap-2 w-40"
            >
              <Users className="" /> Members:
            </label>

            {updateProjectForm.members.length > 0 ? (
              <div className="">
                <div className="flex items-center justify-start gap-3 flex-wrap max-w-lg">
                  {updateProjectForm.members.length > 0
                    ? updateProjectForm.members.map((t, i) => {
                        return (
                          <p
                            className="bg-gray-200 px-2.5 py-1 text-sm rounded shadow flex items-center justify-between gap-4  max-w-60"
                            key={i}
                          >
                            <span>
                            {t.username}

                            </span>
                            <span className="flex items-center justify-start gap-1 font-medium">
                            {t.role}
                            {
                              (t.role ==="Admin" || t.role ==="Owner")
                              && (
                                <Crown className="text-sm h-4 w-4 text-orange-500"/>
                              )  
                            }

                            </span>
                            
                          </p>
                        );
                      })
                    : ""}
                </div>
              </div>
            ):(
                <p>No Members Added</p>
            )}
            

          </div> 

          <div className="flex items-start justify-start gap-3 mb-8">
            <label
              htmlFor="teams"
              className="text-gray-600 flex items-center justify-start gap-2 w-40"
            >
              <Group className="" /> Teams:
            </label>

            {updateProjectForm.teams.length > 0 ? (
              <div className="">
                <div className="flex items-center justify-start gap-3 flex-wrap">
                  {updateProjectForm.teams.length > 0
                    ? updateProjectForm.teams.map((t, i) => {
                        return (
                          <span
                            className="bg-gray-200 px-2.5 py-1 text-sm rounded shadow flex items-center justify-start gap-3"
                            key={i}
                          >
                            {t.name}{" "}
                            
                          </span>
                        );
                      })
                    : ""}
                </div>
              </div>
            ):(
                <p>No Members Added</p>
            )}
            

          </div>


           <div className="flex items-start justify-start gap-3 mb-8">
            <label
              htmlFor="activity"
              className="text-gray-600 flex items-center justify-start gap-2 w-40"
            >
              <Activity className="" /> Activities:
            </label>

            {updateProjectForm.activity.length > 0 ? (
              <div className="">
                <div className="flex items-center justify-start gap-3 flex-wrap">
                  {updateProjectForm.activity.length > 0
                    ? updateProjectForm.activity.map((t, i) => {
                        return (
                          <span
                            className="bg-gray-200 px-2.5 py-1 text-sm rounded shadow flex items-center justify-start gap-3"
                            key={i}
                          >
                            {t}{" "}
                             <Trash
            className="p-1 rounded-full bg-gray-600 text-gray-200 cursor-pointer"
            onClick={() =>
              setUpdateProjectForm((prev) => ({
                ...prev,
                activity: prev.activity.filter((act, index) => index !== i),
              }))
            }
          />
                            
                          </span>
                        );
                      })
                    : ""}
                </div>
              </div>
            ):(
                <p>No Activities Added</p>
            )}
            

          </div> 



            <div className="w-fit mx-auto mb-10 mt-20">
              <button type="submit"
              className="px-10 py-2 border border-gray-200 rounded font-medium cursor-pointer hover:bg-green-500 hover:text-white transition-all"
              >
                Update Project
              </button>

            </div>
        
        
        
        
        </form>

        <div className="flex-1 space-y-10 ">
          <div className="px-2 py-5 shadow rounded-lg bg-white">
            <SearchTeam
              selectedTeamIds={selectedTeamIds}
              setSelectedTeamIds={setSelectedTeamIds}
            />
            {selectedTeamIds.length > 0 && (
              <div className="mt-5 p-3 border-gray-100 border rounded shadow">
                <h1 className="mb-2">Selected Teams to add</h1>

                <div className="flex items-center justify-start gap-3 flex-wrap">
                  {selectedTeamIds.length > 0
                    ? selectedTeamIds.map((t, i) => {
                        return (
                          <span
                            className="bg-gray-200 px-2.5 py-1 text-sm rounded shadow flex items-center justify-start gap-3"
                            key={i}
                          >
                            {t}{" "}
                            <Delete
                              onClick={() =>
                                setSelectedTeamIds(
                                  (prev) =>
                                    prev.filter((team) => team._id !== t._id) // remove by id
                                )
                              }
                              className="p-0.5 rounded-full bg-gray-400 text-gray-600 cursor-pointer"
                            />
                          </span>
                        );
                      })
                    : ""}
                </div>
              </div>
            )}
          </div>
          <div className="px-2 py-5 shadow rounded-lg bg-white">
            <SearchUser
              selectedUserIds={selectedMemberIds}
              setSelectedUserIds={setSelectedMembersIds}
            />
            {selectedMemberIds.length > 0 && (
              <div className="mt-5 p-3 border-gray-100 border rounded shadow">
                <h1 className="mb-2">Selected Users to add</h1>

                <div className="flex items-center justify-start gap-3 flex-wrap">
                  {selectedMemberIds.length > 0
                    ? selectedMemberIds.map((m, i) => {
                        return (
                          <span
                            className="bg-gray-200 px-2.5 py-1 text-sm rounded shadow flex items-center justify-start gap-3"
                            key={m._id || i} // better to use _id
                          >
                            {m}
                            <Delete
                              className="p-0.5 rounded-full bg-gray-400 text-gray-600 cursor-pointer"
                              onClick={() =>
                                setSelectedMembersIds(
                                  (prev) =>
                                    prev.filter((mem) => mem._id !== m._id) // remove by id
                                )
                              }
                            />
                          </span>
                        );
                      })
                    : null}
                </div>
              </div>
            )}
          </div>
        </div>

      </div>


    </div>
  );
};

export default EditProject;
