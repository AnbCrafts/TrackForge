import { Router } from "express";
import { createTicket, deleteTicket, getAllTickets, getAllTicketsAssignedBy, getCommentsOfTicket, getFilteredTickets, getTicketAssignedByUser, getTicketById, getTicketByProjectId, getTicketByUserId, getTicketsAssignedTo, getTicketsCreatedBy, getTicketsExpiringSoon, patchActivityLog, patchTicketStatus, patchTicketToAUser, searchTicket } from "../Controllers/Ticket.Controllers.js";
import upload from "../Middlewares/Multer.Middleware.js";


const TicketRoutes = Router();
 
TicketRoutes.post('/create',upload.array('attachments'),createTicket);
TicketRoutes.get('/list/all',getAllTickets);
TicketRoutes.get('/list/all/assigned-to/:userId/page',getTicketByUserId);
TicketRoutes.get('/list/all/assigned-by/:userId/page',getTicketAssignedByUser);
TicketRoutes.get('/list/all/comments',getCommentsOfTicket);
TicketRoutes.get('/list/all/expiring-soon',getTicketsExpiringSoon);
TicketRoutes.get('/list/all/search',searchTicket);
TicketRoutes.get('/list/all/creator/:createdBy',getTicketsCreatedBy);
TicketRoutes.get('/list/all/assigned-to/:assignedTo',getTicketsAssignedTo);
TicketRoutes.get('/list/all/assigned-by/:assignedBy',getAllTicketsAssignedBy);
TicketRoutes.get('/list/all/:ticketId',getTicketById);
TicketRoutes.delete('/delete/:ticketId',deleteTicket); 
TicketRoutes.put('/:ticketId/user/:userId',patchTicketToAUser);
TicketRoutes.get('/list/project/:projectId',getTicketByProjectId);
TicketRoutes.put('/:ticketId/status/:status',patchTicketStatus);
TicketRoutes.put('/:ticketId/activity/:activityLog',patchActivityLog);
TicketRoutes.get('/list/all/filter-details',getFilteredTickets)
  
export default TicketRoutes;