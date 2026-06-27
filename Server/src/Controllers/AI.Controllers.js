import { GoogleGenerativeAI } from "@google/generative-ai";
import MeetingRoom from "../Models/MeetingRoom.Models.js";
import RoomMessage from "../Models/RoomMessage.Models.js";
import Ticket from "../Models/Ticket.Models.js";
import User from "../Models/User.Models.js";

const summarizeMeeting = async (req, res) => {
  try {
    const { roomId } = req.params;

    const room = await MeetingRoom.findOne({ roomId }).populate("creator", "firstName lastName username");
    if (!room) {
      return res.status(404).json({ success: false, message: "Meeting room not found" });
    }

    // Fetch messages sorted by time
    const messages = await RoomMessage.find({ roomId })
      .populate("sender", "firstName lastName username role")
      .sort({ createdAt: 1 });

    if (messages.length === 0) {
      return res.status(400).json({ success: false, message: "No conversation history found to summarize" });
    }

    // Format chat history
    const chatTranscript = messages.map(msg => {
      const senderName = msg.sender ? `${msg.sender.firstName} ${msg.sender.lastName} (@${msg.sender.username})` : "Unknown User";
      const senderRole = msg.sender ? msg.sender.role : "Attendee";
      return `[${senderName} - ${senderRole}]: ${msg.content || "[Media Attachment]"}`;
    }).join("\n");

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ success: false, message: "Gemini API key is not configured in backend .env" });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
You are an expert technical secretary and project coordinator assistant.
Given the following chat transcript from a team synchronization meeting, analyze it and generate a structured summary, key decisions made, and actionable items.

Here is the meeting info:
Title: "${room.title}"
Purpose/Agenda: "${room.purpose}"

Chat Transcript:
${chatTranscript}

You MUST return a JSON object ONLY, matching the schema below. Do not wrap the JSON in backticks, markdown markers, or any extra text.

JSON Schema:
{
  "summary": "A concise Markdown summary of the discussions (use bullet points or paragraphs as appropriate)",
  "decisions": [
    "A list of key agreements or decisions made during the meeting"
  ],
  "actionItems": [
    {
      "task": "A clear, actionable description of the task (e.g. 'Fix the database CORS issue')",
      "suggestedAssignee": "Best guess of who is responsible (use username like '@username' if mentioned in chat, or specify role like 'Developer' / 'Tester')"
    }
  ]
}
`;

    const result = await model.generateContent(prompt);
    let text = result.response.text().trim();
    
    // Clean markdown code blocks from response if present
    if (text.startsWith("```json")) {
      text = text.substring(7);
    }
    if (text.startsWith("```")) {
      text = text.substring(3);
    }
    if (text.endsWith("```")) {
      text = text.substring(0, text.length - 3);
    }
    text = text.trim();

    // Validate if it is valid JSON
    let summaryJson;
    try {
      summaryJson = JSON.parse(text);
    } catch (e) {
      console.error("Failed to parse Gemini JSON output:", text);
      return res.status(500).json({ 
        success: false, 
        message: "Failed to parse AI response into structured JSON. Please try again.", 
        rawText: text 
      });
    }

    // Save back to the room document
    room.aiSummary = JSON.stringify(summaryJson);
    await room.save();

    return res.status(200).json({
      success: true,
      message: "AI Summary generated and saved successfully",
      summary: summaryJson
    });

  } catch (error) {
    console.error("Summarize Meeting Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const analyzeBug = async (req, res) => {
  try {
    const { ticketId } = req.params;

    const ticket = await Ticket.findById(ticketId)
      .populate("projectId", "name description")
      .populate("createdBy", "firstName lastName username")
      .populate("assignedTo", "firstName lastName username");

    if (!ticket) {
      return res.status(404).json({ success: false, message: "Bug ticket not found" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ success: false, message: "Gemini API key is not configured in backend .env" });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
You are an expert Senior Debugging Engineer and Software Architect.
Analyze the following bug ticket and provide:
1. **Analysis & Root Cause**: A breakdown of why this issue is happening (based on description, steps to reproduce).
2. **Proposed Code Fix / Patch**: Write a proposed code fix or patch inside standard markdown code blocks (e.g. \`\`\`javascript ... \`\`\`).
3. **Prevention & Best Practices**: Recommendations to prevent similar bugs in the future.

Here are the Bug Ticket Details:
Title: "${ticket.title}"
Description: "${ticket.description}"
Project Name: "${ticket.projectId ? ticket.projectId.name : 'N/A'}"
Steps to Reproduce:
${ticket.stepsToReproduce && ticket.stepsToReproduce.length > 0 ? ticket.stepsToReproduce.map(s => `- ${s}`).join("\n") : "None specified"}
Priority Level: "${ticket.priority || 'Medium'}"
Assigned To: "${ticket.assignedTo ? `${ticket.assignedTo.firstName} ${ticket.assignedTo.lastName} (@${ticket.assignedTo.username})` : 'Unassigned'}"

Format your response in beautiful, readable Markdown. Make it professional and ready for a developer to follow.
`;

    const result = await model.generateContent(prompt);
    const analysisText = result.response.text().trim();

    return res.status(200).json({
      success: true,
      message: "AI Bug analysis completed successfully",
      analysis: analysisText
    });

  } catch (error) {
    console.error("Analyze Bug Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const findCodeBugs = async (req, res) => {
  try {
    const { fileContent, filename, projectId } = req.body;

    if (!fileContent) {
      return res.status(400).json({ success: false, message: "File content is required for analysis." });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ success: false, message: "Gemini API key is not configured in backend .env" });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
You are an expert static code analyzer, quality assurance engineer, and security auditor.
Analyze the following code from the file "${filename || 'unknown_file'}" and detect syntax errors, logical bugs, security vulnerabilities, or performance bottlenecks.

Code to analyze:
\`\`\`
${fileContent}
\`\`\`

You MUST return a JSON object ONLY, matching the schema below. Do not wrap the JSON in backticks, markdown markers, or any extra text.

JSON Schema:
{
  "bugs": [
    {
      "title": "Short title of the bug (e.g. Unhandled null pointer dereference)",
      "description": "Clear explanation of the bug and why it is an issue.",
      "lineRange": "Line number or line range (e.g. '12-15')",
      "severity": "One of: Low, Medium, High, Critical",
      "fixRecommendation": "Suggested code fix or correction."
    }
  ]
}
`;

    const result = await model.generateContent(prompt);
    let text = result.response.text().trim();

    // Clean markdown code blocks from response if present
    if (text.startsWith("```json")) {
      text = text.substring(7);
    }
    if (text.startsWith("```")) {
      text = text.substring(3);
    }
    if (text.endsWith("```")) {
      text = text.substring(0, text.length - 3);
    }
    text = text.trim();

    let parsedResult;
    try {
      parsedResult = JSON.parse(text);
    } catch (e) {
      console.error("Failed to parse Gemini code analysis JSON output:", text);
      return res.status(500).json({
        success: false,
        message: "Failed to parse AI response into structured JSON. Please try again.",
        rawText: text
      });
    }

    return res.status(200).json({
      success: true,
      message: "AI static code analysis completed successfully",
      bugs: parsedResult.bugs || []
    });

  } catch (error) {
    console.error("Find Code Bugs Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export { summarizeMeeting, analyzeBug, findCodeBugs };
