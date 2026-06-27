import mongoose from "mongoose";
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  role: { type: String, enum: ["Admin", "User"], default: "User" }
});
export const User = mongoose.model("User", UserSchema);