import mongoose from "mongoose";

const ChatMessageSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      required: true,
      enum: ["user", "assistant"]
    },
    content: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { _id: false }
);

const AIChatSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },
    messages: [ChatMessageSchema]
  },
  { timestamps: true }
);

const AIChat = mongoose.models.AIChat || mongoose.model("AIChat", AIChatSchema);

export default AIChat;
