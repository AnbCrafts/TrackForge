import mongoose from "mongoose";

const validatePassword = (password) => {
  const regex = /^(?=(?:.*[0-9]){3,})(?=(?:.*[a-zA-Z]){4,})(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>/?]).{8,}$/;
  return regex.test(password);
};

const validateUsername = (username ) => {
  const regex = /^[a-z0-9]+$/; // only lowercase letters and numbers
  return regex.test(username);
};

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      validate: {
        validator: validateUsername,
        message: "Username must contain only lowercase letters and numbers (no special characters).",
      },
    },
    firstName: {
      type: String,
      required: true,
      minlength: [3, "First name must be at least 3 characters long."],
    },
    lastName: {
      type: String,
      required: true,
      minlength: [3, "Last name must be at least 3 characters long."],
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    picture: {
      type: String,
      default: "",
    },
    password: {
      type: String,
      required: function() {
    return !this.oauthProvider;
  },
      validate: {
        validator: validatePassword,
        message:
          "Password must be at least 8 characters, contain at least 3 numbers, 4 letters, and 1 special character.",
      },

    },
    status: {
      type: String,
      default: "Online",
      enum: ["Offline", "Online", "Blocked"]
    },
    role: {
      type: String,
      enum: ["Owner", "Admin", "Tester", "Developer", "Debugger","Member"],
      required: true,
    },
    teams: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team",
        default: [],
      },
    ],
    manages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        default: [],
      },
    ],
    activity: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Activity",
        default: [],
      },
    ],
    lastActiveOn: {
      type: Date,
      default: Date.now,
    },
    oauthProvider: {
  type: String,
  default: null
},githubAccessToken: {
  type: String,
  default: null
} ,
projectJoinRequests:[
  {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        default: [],
  },
],
teamJoinRequests:[
  {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team",
        default: [],
      },
],

ticketsAssigned:[
  {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ticket",
        
  },
],
createdBy: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  default: null,
},
    notifications: [
      {
        message: { type: String, required: true },
        read: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    skills: {
      type: [String],
      default: []
    },
    strengths: {
      type: [String],
      default: []
    },
    experience: {
      type: String,
      default: ""
    },
    resumeUrl: {
      type: String,
      default: ""
    }
    
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
