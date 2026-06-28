import axios from "axios";
import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "../src/Models/User.Models.js";
import AIChat from "../src/Models/AIChat.Models.js";
import { DB_NAME } from "../src/Constants/Constant.js";

dotenv.config();

const port = process.env.PORT || 9000;
const serverUrl = `http://localhost:${port}/api`;

const verify = async () => {
  try {
    // 1. Connect to DB
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

    // 2. Find alicesmith
    const alice = await User.findOne({ username: "alicesmith" });
    if (!alice) {
      console.error("Alice Smith user not found in database.");
      process.exit(1);
    }
    console.log(`Found Alice with ID: ${alice._id}`);

    // 3. Clear existing chats
    await AIChat.deleteMany({ userId: alice._id });
    console.log("Cleared existing AIChat entries for Alice.");

    // 4. Send on-topic message with Alice's userId
    console.log("\n🧪 Test Case 1: Send message and save to DB...");
    const payload = {
      messages: [
        { role: "user", content: "Write a small code block showing a javascript array filter." }
      ],
      userId: alice._id
    };

    const res1 = await axios.post(`${serverUrl}/ai/chatbot`, payload);
    console.log("Response Status:", res1.status);
    console.log("AI Response:\n", res1.data.reply);

    // 5. Verify database storage
    console.log("\n🔍 Verification: Checking MongoDB for saved history...");
    const storedChat = await AIChat.findOne({ userId: alice._id });
    if (!storedChat) {
      console.error("❌ FAILURE: Chat was not saved to MongoDB.");
      process.exit(1);
    }
    console.log("✅ SUCCESS: Chat found in MongoDB.");
    console.log("Stored Messages count:", storedChat.messages.length);
    console.log("User message stored:", storedChat.messages[0].content);
    console.log("Assistant reply stored:", storedChat.messages[1].content.substring(0, 50) + "...");

    // 6. Verify fetch endpoint
    console.log("\n🧪 Test Case 2: Fetch history endpoint check...");
    const res2 = await axios.get(`${serverUrl}/ai/chatbot/history/${alice._id}`);
    console.log("Fetch Status:", res2.status);
    console.log("Fetched messages count:", res2.data.messages.length);

    if (res2.data.messages.length === storedChat.messages.length) {
      console.log("✅ SUCCESS: Fetch history matches database record perfectly!");
    } else {
      console.error("❌ FAILURE: Fetch history count mismatch.");
    }

    await mongoose.disconnect();
    console.log("\nAll persistence tests completed successfully.");
    process.exit(0);

  } catch (err) {
    console.error("Verification failed:", err.response?.data || err);
    process.exit(1);
  }
};

verify();
