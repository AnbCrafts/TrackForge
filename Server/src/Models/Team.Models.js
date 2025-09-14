import mongoose from "mongoose";

const MemberSchema = new mongoose.Schema(
  {
    participant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const LinkSchema = new mongoose.Schema(
  {
    url: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    validTill: {
      type: Date,
      default: Date.now,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: ["Expired", "Active"],
    },
  },
  { _id: false }
);

const TeamSchema = new mongoose.Schema(
  { 
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    members: [MemberSchema],
    link: LinkSchema,
    projects: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    }],
    name:{
      type:String,
      
      unique:true
    },
    hasAuthToSee:[{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }],
    joinRequests:[{
              type: mongoose.Schema.Types.ObjectId,
              ref: "User",
        }],
        rejectedJoinRequests:[{
              type: mongoose.Schema.Types.ObjectId,
              ref: "User",
        }],
  },
  { timestamps: true }
);



const Team = mongoose.models.Team || mongoose.model("Team", TeamSchema);

export default Team;
