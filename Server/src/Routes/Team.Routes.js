import { Router } from "express";
import { addMember, checkForTeamAuthorization, createTeam, createTeamJoiningLink, deleteMember, deleteTeam, getAllMembers, getAllTeams, getAllTeamsByMember, getFilteredTeam, getLinkStatus, getProject, getTeamById, getTeamIdByName, joinUsingLink, patchTeamJoinRequests, requestToJoinTeam, searchTeam, updateTeam } from "../Controllers/Team.Controllers.js";

const TeamRoutes = Router();



TeamRoutes.get("/list/team=:teamId/user=:userId/check-authorization",checkForTeamAuthorization)
TeamRoutes.post("/list/team=:teamId/user=:userId/send-join-request",requestToJoinTeam)
TeamRoutes.patch("/list/team=:teamId/user=:userId/decision=:patch",patchTeamJoinRequests)

TeamRoutes.post('/create',createTeam)
TeamRoutes.get('/list/all',getAllTeams)
TeamRoutes.get('/list/all/filter',getFilteredTeam)
TeamRoutes.get('/list/all/search',searchTeam)
TeamRoutes.get('/list/all/team-name/search',getTeamIdByName) 
TeamRoutes.get('/list/all/:teamId',getTeamById)
TeamRoutes.get('/list/all/teams/:userId',getAllTeamsByMember)
TeamRoutes.get('/:teamId/members',getAllMembers)
TeamRoutes.get('/:teamId/projects/list',getProject)
TeamRoutes.get('/:teamId/create-join-link/:userId',createTeamJoiningLink)
TeamRoutes.put('/join/join-link/:userId',joinUsingLink)
TeamRoutes.post('/join-link/status',getLinkStatus)
TeamRoutes.delete('/list/all/:teamId/delete',deleteTeam)
TeamRoutes.put('/list/all/:teamId/update',updateTeam)
TeamRoutes.put('/add/:teamId/participant/:participant',addMember);
TeamRoutes.delete('/remove/:teamId/participant/:participant',deleteMember);

export default TeamRoutes;