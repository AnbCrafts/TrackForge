import mongoose from "mongoose";

const RoomMessageSchema = new mongoose.Schema(
  {
    roomId: {
      type: String,
      required: true,
      index: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      default: "",
    },
    mediaUrl: {
      type: String,
      default: null,
    },
    mediaType: {
      type: String,
      default: null,
    },
    filename: {
      type: String,
      default: null,
    },
    size: {
      type: Number,
      default: null,
    },
  },
  { timestamps: true }
);

const RoomMessage = mongoose.models.RoomMessage || mongoose.model("RoomMessage", RoomMessageSchema);

export default RoomMessage;
