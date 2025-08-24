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
      required: true,
      validate: {
        validator: validatePassword,
        message:
          "Password must be at least 8 characters, contain at least 3 numbers, 4 letters, and 1 special character.",
      },
    },
    status: {
      type: String,
      default: "Online",
      enum: ["Offline", "Online", "Blocked"],
      toLowerCase:true
    },
    role: {
      type: String,
      enum: ["Owner", "Admin", "Tester", "Developer", "Debugger"],
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
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
