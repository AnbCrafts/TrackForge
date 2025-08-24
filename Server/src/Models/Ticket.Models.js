import mongoose from "mongoose";

const TicketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: { 
      type: String,
      required: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    assignedOn: {
      type: Date,
      default: Date.now,
    },
   validFor: {
  type: Date,
  default: () => Date.now() + 7 * 24 * 60 * 60 * 1000, 
},
    status: {
      type: String,
      default: "Open",
      enum: ["Open", "Closed", "Expired", "In Progress"],
    },
    priority: {
      type: String,
      default: "Low",
      enum: ["Low", "Medium", "High", "Critical"],
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    stepsToReproduce: [
      {
        type: String,
      },
    ],
    attachments: [
      {
        type: String,
      },
    ],
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    activityLog: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Activity",
      }, 
    ],
  },
  { timestamps: true }
);

const Ticket = mongoose.models.Ticket || mongoose.model("Ticket", TicketSchema);

export default Ticket;
