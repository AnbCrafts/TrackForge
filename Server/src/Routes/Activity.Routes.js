import { Router } from "express";
import { createActivity, deleteActivity, getActivityById, getActivityByProject, getActivityByTicket, getActivityByUser, getAllActivities, getFilteredActivities, searchActivity, updateActivity } from "../Controllers/Activity.Controllers.js";

 
const ActivityRoutes = Router();

ActivityRoutes.post('/create/new',createActivity)
ActivityRoutes.get('/list/all',getAllActivities)
ActivityRoutes.get('/list/all/:activity',getActivityById)
ActivityRoutes.get('/list/activity/ticket/:ticketId',getActivityByTicket)
ActivityRoutes.get('/list/activity/user/:user',getActivityByUser)
ActivityRoutes.get('/list/activity/project/:project',getActivityByProject)
ActivityRoutes.put('/list/activity/:activity/update',updateActivity) 
ActivityRoutes.delete('/list/activity/:activity/ticket/:ticketId/delete',deleteActivity)
ActivityRoutes.get('/list/activity/search',searchActivity)
ActivityRoutes.get('/list/all/activity/query',getFilteredActivities)
   
 
export default ActivityRoutes;