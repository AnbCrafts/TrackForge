import { Router } from "express";
import upload from "../Middlewares/Multer.Middleware.js";
import { changeUserRole, DeleteUserProfile, getLastActiveTime, getPatchedUsers, getUserActivities, getUserByUsernameAndEmail, getUserDataById, getUserIDByUsername, getUsersByRole, getUsersTeam, ListAllUserProfiles, loginUser, PatchUserProfile, pushTeam, registerUser, SearchUserProfile, updateUserProfile } from "../Controllers/User.Controllers.js";


const UserRoutes = Router(); 
 
UserRoutes.post('/register',upload.single('picture'),registerUser)
UserRoutes.post('/login',loginUser)
UserRoutes.get('/info/:userId',getUserDataById)
UserRoutes.delete('/info/:userId/remove',DeleteUserProfile)
UserRoutes.patch('/info/:userId/:status',PatchUserProfile)
UserRoutes.get('/info/list/all',ListAllUserProfiles)
UserRoutes.get('/info/:userId/teams',getUsersTeam)
UserRoutes.get('/info/:userId/lastSeen',getLastActiveTime)
UserRoutes.put('/info/:userId/edit',updateUserProfile)
UserRoutes.put('/info/:userId/update/:role',changeUserRole)
UserRoutes.get('/info/:userId/activities',getUserActivities)
UserRoutes.get('/info/list/all/status/:status',getPatchedUsers)
UserRoutes.get('/info/list/all/role/:role',getUsersByRole)
UserRoutes.get('/info/list/all/search',SearchUserProfile)
UserRoutes.get('/info/username/:username',getUserIDByUsername)
UserRoutes.get('/info/user-detail/:username/:email',getUserByUsernameAndEmail)

UserRoutes.put('/:userId/:projectId',pushTeam)
export default UserRoutes
  