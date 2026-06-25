import mongoose from "mongoose";

const MeetingRoomSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    purpose: {
      type: String,
      required: true,
    },
    scheduledDate: {
      type: Date,
      required: true,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      default: null,
    },
    teams: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team",
        default: [],
      },
    ],
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    roomId: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

const MeetingRoom = mongoose.models.MeetingRoom || mongoose.model("MeetingRoom", MeetingRoomSchema);

export default MeetingRoom;
