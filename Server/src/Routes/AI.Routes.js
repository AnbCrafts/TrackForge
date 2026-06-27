import { Router } from "express";
import { summarizeMeeting, analyzeBug, findCodeBugs } from "../Controllers/AI.Controllers.js";

const aiRoutes = Router();

aiRoutes.post("/meeting/:roomId/summarize", summarizeMeeting);
aiRoutes.post("/bug/:ticketId/analyze", analyzeBug);
aiRoutes.post("/code/find-bugs", findCodeBugs);

export default aiRoutes;
