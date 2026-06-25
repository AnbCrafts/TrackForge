import MeetingRoom from "../Models/MeetingRoom.Models.js";
import RoomMessage from "../Models/RoomMessage.Models.js";
import Message from "../Models/Message.Models.js";
import User from "../Models/User.Models.js";
import Team from "../Models/Team.Models.js";
import Project from "../Models/Project.Models.js";
import crypto from "crypto";
import { uploadOnCloudinary } from "../Utility/CloudConfig.Utility.js";

const createMeetingRoom = async (req, res) => {
  try {
    const { title, purpose, scheduledDate, projectId, teams, users, creator } = req.body;

    if (!title || !purpose || !scheduledDate || !creator) {
      return res.status(400).json({ success: false, message: "Required fields missing" });
    }

    // Sanitize year format for two-digit entries (e.g. year 26 -> 2026)
    let sanitizedDate = scheduledDate;
    const dateObj = new Date(scheduledDate);
    if (!isNaN(dateObj.getTime())) {
      const year = dateObj.getFullYear();
      if (year < 100) {
        dateObj.setFullYear(2000 + year);
        sanitizedDate = dateObj.toISOString();
      } else if (year < 1000) {
        dateObj.setFullYear(2000 + (year % 100));
        sanitizedDate = dateObj.toISOString();
      }
    }

    // Resolve all group member IDs from selected teams and project first to deduplicate
    const groupMemberIds = new Set();

    // 1. Add all members of selected teams
    if (teams && teams.length > 0) {
      for (const tId of teams) {
        const teamObj = await Team.findById(tId);
        if (teamObj && teamObj.members) {
          teamObj.members.forEach((m) => {
            if (m.participant) {
              groupMemberIds.add(m.participant.toString());
            }
          });
        }
      }
    }

    // 2. Add all members of selected project
    if (projectId) {
      const projectObj = await Project.findById(projectId);
      if (projectObj && projectObj.members) {
        projectObj.members.forEach((mId) => {
          if (mId) {
            groupMemberIds.add(mId.toString());
          }
        });
      }
    }

    // 3. Filter individually selected users to exclude those who are already invited via teams/projects
    const filteredUsers = [];
    if (users && users.length > 0) {
      users.forEach((uId) => {
        const uIdStr = uId.toString();
        if (!groupMemberIds.has(uIdStr)) {
          filteredUsers.push(uId);
        }
      });
    }

    // Generate unique Room ID
    const roomId = crypto.randomBytes(8).toString("hex");

    // Save room with filtered users array to prevent duplicate listings in Guests list
    const newRoom = new MeetingRoom({
      title,
      purpose,
      scheduledDate: sanitizedDate,
      projectId: projectId || null,
      teams: teams || [],
      users: filteredUsers,
      creator,
      roomId,
    });

    await newRoom.save();

    // Combine filtered users and group members for inbox notifications
    const inviteeIds = new Set();
    filteredUsers.forEach((uId) => inviteeIds.add(uId.toString()));
    groupMemberIds.forEach((mId) => inviteeIds.add(mId));

    // Remove the creator from target invitees
    inviteeIds.delete(creator.toString());

    // Send direct inbox messages to each invitee
    const formattedDate = new Date(scheduledDate).toLocaleString();
    const inviteLink = `/workspace/meeting-room/${roomId}`;
    const inviteContent = `📅 INVITATION: You have been invited to the scheduled meeting: "${title}" (${purpose}) on ${formattedDate}. Click the link to join: ${inviteLink}`;

    for (const inviteeId of inviteeIds) {
      const invitationMessage = new Message({
        sender: creator,
        receiver: inviteeId,
        content: inviteContent,
      });
      await invitationMessage.save();
    }

    return res.status(201).json({
      success: true,
      message: "Meeting room created and invitations dispatched successfully",
      room: newRoom,
    });
  } catch (error) {
    console.error("Create Meeting Room Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const getMeetingRoomDetails = async (req, res) => {
  try {
    const { roomId } = req.params;

    const roomObj = await MeetingRoom.findOne({ roomId })
      .populate("projectId", "name description members")
      .populate("creator", "firstName lastName username email picture role")
      .populate("teams", "name members")
      .populate("users", "firstName lastName username email picture role");

    if (!roomObj) {
      return res.status(404).json({ success: false, message: "Meeting room not found" });
    }

    return res.status(200).json({
      success: true,
      room: roomObj,
    });
  } catch (error) {
    console.error("Get Meeting Room Details Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const getRoomMessages = async (req, res) => {
  try {
    const { roomId } = req.params;

    const messages = await RoomMessage.find({ roomId })
      .populate("sender", "firstName lastName username email picture role")
      .sort({ createdAt: 1 });

    return res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    console.error("Get Room Messages Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const sendRoomMessage = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { sender, content, mediaUrl, mediaType, filename, size } = req.body;

    if (!sender) {
      return res.status(400).json({ success: false, message: "Sender is required" });
    }

    const newMessage = new RoomMessage({
      roomId,
      sender,
      content: content || "",
      mediaUrl: mediaUrl || null,
      mediaType: mediaType || null,
      filename: filename || null,
      size: size || null,
    });

    await newMessage.save();

    const populatedMessage = await RoomMessage.findById(newMessage._id).populate(
      "sender",
      "firstName lastName username email picture role"
    );

    return res.status(201).json({
      success: true,
      message: "Room message sent successfully",
      messageData: populatedMessage,
    });
  } catch (error) {
    console.error("Send Room Message Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const getTeamMeetings = async (req, res) => {
  try {
    const { teamId } = req.params;

    const meetings = await MeetingRoom.find({ teams: teamId }).sort({ scheduledDate: 1 });

    return res.status(200).json({
      success: true,
      meetings,
    });
  } catch (error) {
    console.error("Get Team Meetings Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const uploadChatMedia = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file provided" });
    }

    const uploaded = await uploadOnCloudinary(req.file.path);
    if (!uploaded) {
      return res.status(500).json({ success: false, message: "Cloudinary upload failed" });
    }

    return res.status(200).json({
      success: true,
      mediaUrl: uploaded.secure_url,
      mediaType: req.file.mimetype,
      filename: req.file.originalname,
      size: req.file.size,
    });
  } catch (error) {
    console.error("Upload Chat Media Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const updateMeetingRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { title, purpose, scheduledDate } = req.body;

    const room = await MeetingRoom.findOne({ roomId });
    if (!room) {
      return res.status(404).json({ success: false, message: "Meeting room not found" });
    }

    if (title !== undefined) room.title = title;
    if (purpose !== undefined) room.purpose = purpose;
    if (scheduledDate !== undefined) {
      let sanitizedDate = scheduledDate;
      const dateObj = new Date(scheduledDate);
      if (!isNaN(dateObj.getTime())) {
        const year = dateObj.getFullYear();
        if (year < 100) {
          dateObj.setFullYear(2000 + year);
          sanitizedDate = dateObj.toISOString();
        } else if (year < 1000) {
          dateObj.setFullYear(2000 + (year % 100));
          sanitizedDate = dateObj.toISOString();
        }
      }
      room.scheduledDate = sanitizedDate;
    }

    await room.save();

    return res.status(200).json({
      success: true,
      message: "Meeting room updated successfully",
      room,
    });
  } catch (error) {
    console.error("Update Meeting Room Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const deleteMeetingRoom = async (req, res) => {
  try {
    const { roomId } = req.params;

    const room = await MeetingRoom.findOneAndDelete({ roomId });
    if (!room) {
      return res.status(404).json({ success: false, message: "Meeting room not found" });
    }

    // Delete messages associated with this room
    await RoomMessage.deleteMany({ roomId });

    return res.status(200).json({
      success: true,
      message: "Meeting room and its chat logs deleted successfully",
    });
  } catch (error) {
    console.error("Delete Meeting Room Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const getMeetingsByCreator = async (req, res) => {
  try {
    const { creatorId } = req.params;

    const meetings = await MeetingRoom.find({ creator: creatorId }).sort({ scheduledDate: 1 });

    return res.status(200).json({
      success: true,
      meetings,
    });
  } catch (error) {
    console.error("Get Meetings By Creator Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export {
  createMeetingRoom,
  getMeetingRoomDetails,
  getRoomMessages,
  sendRoomMessage,
  getTeamMeetings,
  uploadChatMedia,
  updateMeetingRoom,
  deleteMeetingRoom,
  getMeetingsByCreator,
};
