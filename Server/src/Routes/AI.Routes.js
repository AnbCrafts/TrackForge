import { Router } from "express";
import { summarizeMeeting, analyzeBug, findCodeBugs, getChatbotResponse, getChatbotHistory, suggestAssignee } from "../Controllers/AI.Controllers.js";

const aiRoutes = Router();

aiRoutes.post("/meeting/:roomId/summarize", summarizeMeeting);
aiRoutes.post("/bug/:ticketId/analyze", analyzeBug);
aiRoutes.post("/code/find-bugs", findCodeBugs);
aiRoutes.post("/chatbot", getChatbotResponse);
aiRoutes.get("/chatbot/history/:userId", getChatbotHistory);
aiRoutes.post("/ticket/suggest-assignee", suggestAssignee);

export default aiRoutes;
