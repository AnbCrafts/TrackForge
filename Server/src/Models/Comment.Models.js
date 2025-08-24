import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },
    ticket:{
         type: mongoose.Schema.Types.ObjectId,
      ref: "Ticket",
    },
    type:{
        type:String,
        enum:["Text","Status Change","System"]
    }
  },
  { timestamps: true }
);

const Comment =
  mongoose.models.Comment || mongoose.model("Comment", CommentSchema);

export default Comment;
