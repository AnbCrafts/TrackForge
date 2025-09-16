import {Router} from 'express';
import { addNewProject, getAllProjects, getProjectById ,deleteProject, updateProject, getProjectByProjectAndOwner, addMember, removeMember, getAllMembers, getAllProjectsOfUser, addTeam, removeTeam, getAllTeamsOfProject, getDeadline, expiredDeadlineProject, archiveProject, unArchiveProject, getArchivedList, getUnArchivedList, SearchProject, getProjectStats, getAllActivities, addFilesToProject, getProjectFiles, getUserProjectFolders, checkForProjectAuthorization, requestToJoinProject, patchJoinRequests, checkUserRequestStatus, getJoinRequest} from '../Controllers/Project.Controllers.js';
import upload from '../Middlewares/ProjectFiles.Middleware.js';

const projectRoutes = Router();
 
 
projectRoutes.post("/create/new",addNewProject)

projectRoutes.put(
  "/:projectId/files",
  upload.array("files"),   
  addFilesToProject
);

projectRoutes.get("/:projectId/folder/files",getProjectFiles);

projectRoutes.get("/list/project=:projectId/user=:userId/check-authorization",checkForProjectAuthorization)
projectRoutes.get("/list/project=:projectId/user=:userId/pending-request-list",getJoinRequest)
projectRoutes.get("/list/project=:projectId/user=:userId/check-request-status",checkUserRequestStatus)
projectRoutes.post("/list/project=:projectId/user=:userId/send-join-request",requestToJoinProject)
projectRoutes.patch("/list/project=:projectId/user=:userId/decision=:patch",patchJoinRequests)

projectRoutes.get("/list/:userId/:projectId/folders",getUserProjectFolders)
projectRoutes.get("/list/:projectId",getProjectById)
projectRoutes.get("/list/:projectId/stats",getProjectStats)
projectRoutes.get("/list/:projectId/activities",getAllActivities)
projectRoutes.put("/list/:project/member/:member/add",addMember)
projectRoutes.put("/list/:projectId/team/:team/add",addTeam) 
projectRoutes.put("/list/:projectId/:team/remove",removeTeam)
projectRoutes.put("/list/:projectId/:member/remove",removeMember)
projectRoutes.get("/list/:projectId/members-list",getAllMembers) 
projectRoutes.get("/list/:projectId/deadline",getDeadline)
projectRoutes.get("/list/all/deadline/expired",expiredDeadlineProject)
projectRoutes.get("/list/:projectId/teams-list",getAllTeamsOfProject)
projectRoutes.get("/list-all",getAllProjects) 
projectRoutes.get("/list/all/search",SearchProject)
projectRoutes.get("/list-all/archived",getArchivedList)
projectRoutes.get("/list-all/un-archived",getUnArchivedList) 
projectRoutes.get("/list-all/project/:userId",getAllProjectsOfUser)
projectRoutes.delete("/list/:projectId/delete",deleteProject)
projectRoutes.put("/list/:projectId/:doneBy/update",updateProject)
projectRoutes.put("/list/:project/archive",archiveProject)
projectRoutes.put("/list/:project/un-archive",unArchiveProject)
projectRoutes.get("/list/project=:project/owner=:owner",getProjectByProjectAndOwner)


export default projectRoutes;