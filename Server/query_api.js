import axios from "axios";
import mongoose from "mongoose";
import Project from "./src/Models/Project.Models.js";
import dotenv from "dotenv";

dotenv.config();

const url = process.env.MONGO_DB_URI;
const db_name = "TrackForge";

let connectionUrl = url;
if (url.includes("?")) {
  const parts = url.split("?");
  connectionUrl = `${parts[0]}${db_name}?${parts[1]}`;
} else {
  connectionUrl = `${url}/${db_name}`;
}

try {
  await mongoose.connect(connectionUrl);
  const project = await Project.findOne();
  if (!project) {
    console.log("No project found!");
    process.exit(0);
  }
  
  const projectId = project._id.toString();
  const ownerId = project.owner.toString();
  console.log(`Found Project ID: ${projectId}, Owner ID: ${ownerId}`);

  // Query database directly
  console.log("Folders in DB:", JSON.stringify(project.folders, null, 2));

  // Query running API server
  const apiURL = `http://localhost:9000/api/project/list/${ownerId}/${projectId}/folders`;
  console.log(`Querying API: ${apiURL}`);
  const response = await axios.get(apiURL);
  console.log("API Response status:", response.status);
  console.log("API Response data:", JSON.stringify(response.data, null, 2));

} catch (err) {
  console.error("Error:", err.message);
  if (err.response) {
    console.error("API error response data:", err.response.data);
  }
} finally {
  await mongoose.disconnect();
}
