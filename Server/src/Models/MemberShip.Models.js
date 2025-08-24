import mongoose from "mongoose";

const MembershipSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      required: true,
    },
    member: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    joinedAt: {
      type: Date,
      default: Date.now,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },
  },
  { timestamps: true }
);

const Membership =
  mongoose.models.Membership || mongoose.model("Membership", MembershipSchema);

export default Membership;
