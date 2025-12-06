// routes/AIMailer.Route.js
import express from "express";
import {
  sendComplaintMail,
  sendDirectMail
} from "../Controllers/AIMailer.Controllers.js";

const AIMailRoute = express.Router();

// 🧠 1️⃣ Complaint Mail — user → platform owner/admin
// Endpoint: POST /api/ai-mail/complaint
AIMailRoute.post("/complaint", sendComplaintMail);

// 👥 2️⃣ Direct Mail — user ↔ user/admin
// Endpoint: POST /api/ai-mail/direct
AIMailRoute.post("/direct", sendDirectMail);

export default AIMailRoute;
