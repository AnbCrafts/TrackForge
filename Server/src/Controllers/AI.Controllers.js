import { GoogleGenerativeAI } from "@google/generative-ai";
import MeetingRoom from "../Models/MeetingRoom.Models.js";
import RoomMessage from "../Models/RoomMessage.Models.js";
import Ticket from "../Models/Ticket.Models.js";
import User from "../Models/User.Models.js";
import axios from "axios";
import AIChat from "../Models/AIChat.Models.js";
import Project from "../Models/Project.Models.js";
import Team from "../Models/Team.Models.js";

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

const getChatbotResponse = async (req, res) => {
  try {
    const { messages, userId } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ success: false, message: "Messages history is required." });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ success: false, message: "Groq API key is not configured in backend .env" });
    }

    // System prompt enforcing strict TrackForge boundaries and preventing off-topic tokens
    const systemMessage = {
      role: "system",
      content: `You are TrackForge AI, a dedicated, highly specialized assistant for TrackForge (the Next-Gen Bug Tracking & Team Workflow Platform).

Scope and Boundaries:
1. You can ONLY answer queries relating to TrackForge features (bug tracking, file upload, folders explorer, meeting rooms), software engineering, programming advice, debugging/fixing code blocks, and agile project management.
2. If the user asks ANY question that is irrelevant, personal, conversational (beyond greeting), or outside the scope of software engineering or TrackForge (e.g. general knowledge, history, maths, sports, pop culture, recipes, or casual chat), you MUST politely refuse to answer.
3. In case of off-topic queries, respond EXACTLY with:
"I am sorry, but as TrackForge AI, I am restricted to assisting with software development, debugging, and project management tasks within the TrackForge workspace. Please ask a project-related question."
4. Do not offer any preambles, explanations, or follow-ups for off-topic queries. Keep answers to allowed topics clear, concise, and professional.`
    };

    // Format messages for Groq API
    const groqMessages = [systemMessage, ...messages];

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.3-70b-versatile",
        messages: groqMessages,
        temperature: 0.2, // Lower temperature to strictly adhere to system prompt guidelines
        max_tokens: 1024
      },
      {
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        }
      }
    );

    const reply = response.data.choices[0].message.content.trim();

    // If userId is provided, save user chat history to MongoDB
    if (userId) {
      const userMessage = messages[messages.length - 1];
      const assistantReply = { role: "assistant", content: reply };

      let chat = await AIChat.findOne({ userId });
      if (!chat) {
        chat = new AIChat({ userId, messages: [] });
      }

      // Add user message if not already recorded (avoid duplicate push checks)
      const lastMsg = chat.messages[chat.messages.length - 1];
      if (!lastMsg || lastMsg.content !== userMessage.content || lastMsg.role !== userMessage.role) {
        chat.messages.push({ role: userMessage.role, content: userMessage.content });
      }
      chat.messages.push(assistantReply);
      await chat.save();
    }

    return res.status(200).json({
      success: true,
      reply
    });

  } catch (error) {
    console.error("Groq Chatbot Error:", error.response?.data || error.message);
    return res.status(500).json({ success: false, message: "Failed to connect to AI Chatbot. Please check your Groq API Key." });
  }
};

const getChatbotHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required." });
    }

    const chat = await AIChat.findOne({ userId });
    return res.status(200).json({
      success: true,
      messages: chat ? chat.messages : []
    });
  } catch (error) {
    console.error("Get Chatbot History Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const suggestAssignee = async (req, res) => {
  try {
    const { ticketId } = req.body;

    if (!ticketId) {
      return res.status(400).json({ success: false, message: "Ticket ID is required." });
    }

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({ success: false, message: "Ticket not found." });
    }

    const project = await Project.findById(ticket.projectId).populate("members", "firstName lastName username role skills strengths experience resumeUrl");
    if (!project) {
      return res.status(404).json({ success: false, message: "Associated project not found." });
    }

    // Retrieve all project team members and team-associated members
    const memberMap = new Map();

    // 1. Add direct project members
    if (project.members && project.members.length > 0) {
      project.members.forEach(m => {
        if (m) memberMap.set(m._id.toString(), m);
      });
    }

    // 2. Add members of project teams
    if (project.teams && project.teams.length > 0) {
      const teams = await Team.find({ _id: { $in: project.teams } }).populate("members.participant", "firstName lastName username role skills strengths experience resumeUrl");
      teams.forEach(t => {
        if (t.members) {
          t.members.forEach(m => {
            if (m.participant) {
              memberMap.set(m.participant._id.toString(), m.participant);
            }
          });
        }
      });
    }

    const availableMembers = Array.from(memberMap.values());
    if (availableMembers.length === 0) {
      return res.status(200).json({
        success: false,
        message: "No team members found associated with this project to recommend assignment."
      });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ success: false, message: "Groq API key is not configured in backend .env" });
    }

    const prompt = `
You are an expert technical project coordinator and agile manager.
Your task is to analyze the following bug ticket and suggest a list of the most suitable team members (ranked in order of matching fit) to assign it to.

Bug Ticket details:
Title: "${ticket.title}"
Description: "${ticket.description}"
Priority: "${ticket.priority || 'Medium'}"

Available Team Members Profiles:
${availableMembers.map(m => {
  const skills = m.skills && m.skills.length > 0 ? m.skills.join(", ") : "None specified";
  const strengths = m.strengths && m.strengths.length > 0 ? m.strengths.join(", ") : "None specified";
  const exp = m.experience ? m.experience : "None specified";
  return `* Name: ${m.firstName} ${m.lastName} (Username: @${m.username})
  - Role: ${m.role}
  - User ID: ${m._id}
  - Skills: ${skills}
  - Strengths: ${strengths}
  - Experience: "${exp}"`;
}).join("\n\n")}

Guidelines:
1. First, summarize and evaluate each candidate's professional profile against the bug ticket requirements:
   - Match the bug technology/topic (e.g. databases, CORS, UI components, calculation crashes) with the user's Skills.
   - Match the bug complexity with the user's Role (Developer for coding tasks, Debugger for complex root causes, Tester for verification/unit tests).
2. Rank the candidates in order of best-fit to good-fit.
3. Suggest a MAXIMUM of 3 matching candidates.
4. DO NOT list all members; only include members who have some relevant skills, strengths, or a role matching the bug. If a member is completely irrelevant or a member is a Member/Admin without any matching skills, exclude them from the list.
5. You MUST return a JSON object ONLY, matching the schema below. Do not wrap the JSON in backticks, markdown markers, or any extra text.

JSON Schema:
{
  "recommendations": [
    {
      "rank": 1,
      "suggestedUserId": "Exact MongoDB ObjectId string of the user",
      "suggestedUsername": "Username of the user (without @)",
      "suggestedName": "First and last name of the user",
      "reasoning": "A clear, professional 1-2 sentence explaining why this candidate is ranked here and how their skills/experience fit the bug."
    }
  ]
}
`;

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: "You are a professional project management helper. You output valid JSON matching the requested schema exactly." },
          { role: "user", content: prompt }
        ],
        temperature: 0.1,
        max_tokens: 1024
      },
      {
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        }
      }
    );

    let text = response.data.choices[0].message.content.trim();

    // Clean JSON wrappers if present
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
      console.error("Failed to parse suggest-assignee AI JSON response:", text);
      return res.status(500).json({
        success: false,
        message: "Failed to parse AI recommendation response. Please try again.",
        rawText: text
      });
    }

    return res.status(200).json({
      success: true,
      recommendations: parsedResult.recommendations || []
    });

  } catch (error) {
    console.error("Suggest Assignee Error:", error.response?.data || error.message);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export { summarizeMeeting, analyzeBug, findCodeBugs, getChatbotResponse, getChatbotHistory, suggestAssignee };
