import { Router } from "express";
import { getMessages, sendMessage } from "../Controllers/Message.Controllers.js";

const messageRoutes = Router();

messageRoutes.get("/:userId1/:userId2", getMessages);
messageRoutes.post("/send", sendMessage);

export default messageRoutes;
