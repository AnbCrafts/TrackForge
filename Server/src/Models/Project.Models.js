import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true,
  },
  path: { // <-- add this
    type: String,
    required: true, // because you’ll need it to fetch/open the file
  },
  
  size: {
     type: Number 
  },                       // in bytes
  fileType: { 
    type: String 
  },                   // e.g., "text/html", "application/javascript"
  uploadedAt: { 
    type: Date, 
    default: Date.now 
  },
  uploadedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User" 
  }

})


const FolderSchema = new mongoose.Schema({
  name: { type: String, 
    
  required: true 
},
  files: [fileSchema], 
});


const ProjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    folders:[
      FolderSchema
    ],
    description: {
      type: String,
      required: true,
    },
    teams: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team",
      },
    ],
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    startedOn: {
      type: Date,
      default: Date.now,
    },
    deadline: {
      type: Date,
      required: true,
    },
    archived: {
      type: Boolean,
      default: false,
    },
    activity: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Activity",
        default: [],
      },
    ],
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

const Project =
  mongoose.models.Project || mongoose.model("Project", ProjectSchema);

export default Project;
