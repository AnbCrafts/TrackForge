import { Router } from "express";
import {
  createMeetingRoom,
  getMeetingRoomDetails,
  getRoomMessages,
  sendRoomMessage,
  getTeamMeetings,
  uploadChatMedia,
  updateMeetingRoom,
  deleteMeetingRoom,
  getMeetingsByCreator,
} from "../Controllers/MeetingRoom.Controllers.js";
import upload from "../Middlewares/ProjectFiles.Middleware.js";

const meetingRoomRoutes = Router();

meetingRoomRoutes.post("/create", createMeetingRoom);
meetingRoomRoutes.get("/details/:roomId", getMeetingRoomDetails);
meetingRoomRoutes.get("/messages/:roomId", getRoomMessages);
meetingRoomRoutes.post("/messages/:roomId/send", sendRoomMessage);
meetingRoomRoutes.get("/list/team/:teamId", getTeamMeetings);
meetingRoomRoutes.post("/upload", upload.single("file"), uploadChatMedia);
meetingRoomRoutes.patch("/update/:roomId", updateMeetingRoom);
meetingRoomRoutes.delete("/delete/:roomId", deleteMeetingRoom);
meetingRoomRoutes.get("/list/creator/:creatorId", getMeetingsByCreator);

export default meetingRoomRoutes;
