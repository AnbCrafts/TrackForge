import axios from "axios";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Ticket from "../src/Models/Ticket.Models.js";
import { DB_NAME } from "../src/Constants/Constant.js";

dotenv.config();

const port = process.env.PORT || 9000;
const serverUrl = `http://localhost:${port}/api`;

const run = async () => {
  try {
    const url = process.env.MONGO_DB_URI;
    const db_name = DB_NAME;
    let connectionUrl = url;
    if (url.includes("?")) {
      const parts = url.split("?");
      connectionUrl = `${parts[0]}${db_name}?${parts[1]}`;
    } else {
      connectionUrl = `${url}/${db_name}`;
    }
    await mongoose.connect(connectionUrl);
    console.log("Connected to MongoDB");

    // Fetch a single ticket
    const ticket = await Ticket.findOne();
    if (!ticket) {
      console.error("No tickets found in the database to test with.");
      process.exit(1);
    }
    console.log(`Testing with Ticket: "${ticket.title}" (ID: ${ticket._id})`);

    const response = await axios.post(`${serverUrl}/ai/ticket/suggest-assignee`, {
      ticketId: ticket._id
    });

    console.log("Response Status:", response.status);
    console.log("AI Suggestion Data:\n", JSON.stringify(response.data, null, 2));

    await mongoose.disconnect();
    console.log("Persistence disconnect successful.");
    process.exit(0);
  } catch (err) {
    console.error("Assignee suggestion test failed:", err.response?.data || err);
    process.exit(1);
  }
};

run();
