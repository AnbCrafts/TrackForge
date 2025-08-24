import mongoose from "mongoose";

const ActivitySchema = new mongoose.Schema(
  { 
    ticketId: { 
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ticket",
      required: true
    },
    actionType: {
      type: String,
      required: true
    },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    performedOn: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },
    details: {
      type: String,
      required: true
    },
    doneOn: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true } 
);

const Activity =
  mongoose.models.Activity || mongoose.model("Activity", ActivitySchema);

export default Activity;
