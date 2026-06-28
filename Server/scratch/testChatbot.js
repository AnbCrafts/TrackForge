import axios from "axios";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

const port = process.env.PORT || 9000;
const testUrl = `http://localhost:${port}/api/ai/chatbot`;

const runTests = async () => {
  console.log("Starting Chatbot API Verification tests...");
  
  // Test case 1: On-topic query
  try {
    console.log("\n🧪 Test Case 1: On-topic software query...");
    const res1 = await axios.post(testUrl, {
      messages: [
        { role: "user", content: "How do I upload a folder in TrackForge?" }
      ]
    });
    console.log("Status: OK");
    console.log("AI Response:\n", res1.data.reply);
  } catch (err) {
    console.error("Test Case 1 failed:", err.response?.data || err);
  }

  // Test case 2: Off-topic query (scoping block check)
  try {
    console.log("\n🧪 Test Case 2: Off-topic general query (should be blocked)...");
    const res2 = await axios.post(testUrl, {
      messages: [
        { role: "user", content: "Can you give me a recipe for chocolate chip cookies?" }
      ]
    });
    console.log("Status: OK");
    console.log("AI Response (expected rejection):\n", res2.data.reply);
  } catch (err) {
    console.error("Test Case 2 failed:", err.response?.data || err);
  }
};

runTests();
