import { Router } from "express";
import { postComment,getCommentsOfProject,getCommentsOfUser,deleteComment, getCommentsOfTicket } from "../Controllers/Comment.Controllers.js";


const CommentRoutes = Router();
  
CommentRoutes.post('/new',postComment);
CommentRoutes.get('/list/project/:projectId/page',getCommentsOfProject);
CommentRoutes.get('/list/ticket/:ticketId/page',getCommentsOfTicket);
CommentRoutes.get('/list/user/:userId',getCommentsOfUser);
CommentRoutes.delete('/:commentId/delete',deleteComment);



export default CommentRoutes;
