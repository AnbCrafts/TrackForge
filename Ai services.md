# 🤖 AI Services Architecture & Flows

This document outlines the architecture, data flows, APIs, and file structures of all AI-integrated features in **TrackForge**.

---

## 🧭 System Overview

```
                      +-------------------+
                      |   React Client    |
                      +---------+---------+
                                |
                                | REST / JSON
                                v
                      +---------+---------+
                      |   Express Server  |
                      +----+---------+----+
                           |         |
      MongoDB Queries /    |         |  API Queries
      Chat Persistence     |         |  (LLaMA & Gemini)
                           v         v
                      +----+--+   +--+----+
                      |  DB   |   | LLM's |
                      +-------+   +-------+
```

---

## 🤖 1. Global AI Chatbot (Groq LLaMA 3.3)

A context-locked, scope-bounded floating chatbot widget that assists developers with software development issues. Chat logs are persisted to MongoDB when the user is logged in.

### 📁 File Locations
* **Frontend Widget**: [ChatbotWidget.jsx](file:///E:/Anb_Carfts_Projects/Target%20CV/TrackForge/Client/src/Components/ChatbotWidget.jsx)
* **Backend Controller**: [AI.Controllers.js](file:///E:/Anb_Carfts_Projects/Target%20CV/TrackForge/Server/src/Controllers/AI.Controllers.js) (`getChatbotResponse`, `getChatbotHistory`)
* **Backend Routes**: [AI.Routes.js](file:///E:/Anb_Carfts_Projects/Target%20CV/TrackForge/Server/src/Routes/AI.Routes.js)
* **Database Model**: [AIChat.Models.js](file:///E:/Anb_Carfts_Projects/Target%20CV/TrackForge/Server/src/Models/AIChat.Models.js)

### 🔄 Data Flow
```
User Types -> Widget Checks login -> POST /api/ai/chatbot (payload: message, userId)
                                          |
        +---------------------------------+---------------------------------+
        | (If userId exists)                                                |
        v                                                                   v
Load mongo chat history (max 15 messages)                      Execute scope filtering prompt
        |                                                                   |
        +---------------------------------+---------------------------------+
                                          |
                                          v
                            Send query to Groq LLaMA 3.3
                                          |
                                          v
                        Receive response & write to MongoDB
                                          |
                                          v
                               Return answer to Client
```

### 🔌 API Endpoints

#### 1. POST `/api/ai/chatbot`
Processes chat messages and returns the context-bounded response.
* **Payload**:
  ```json
  {
    "message": "How do I upload a folder in TrackForge?",
    "userId": "6a3fec036ef384a7d7b3e4d4"
  }
  ```
* **Response**:
  ```json
  {
    "success": true,
    "reply": "To upload a folder in TrackForge, you can use the File Explorer inside the Code Editor page..."
  }
  ```

#### 2. GET `/api/ai/chatbot/history/:userId`
Retrieves chat history logs for logged-in sessions.
* **Response**:
  ```json
  {
    "success": true,
    "history": [
      { "role": "user", "parts": [{ "text": "Hello" }] },
      { "role": "model", "parts": [{ "text": "Hello! How can I assist you with software development today?" }] }
    ]
  }
  ```

---

## 🎯 2. Ranked AI Assignee Suggestion (Groq LLaMA 3.3)

Analyzes a bug ticket and evaluates all eligible project developers (skills, strengths, experience) to recommend a ranked match list of the top 3 candidates.

### 📁 File Locations
* **Client Pages**:
  * [ViewDetailedBug.jsx](file:///E:/Anb_Carfts_Projects/Target%20CV/TrackForge/Client/src/Pages/ViewDetailedBug.jsx) (Desktop / Mobile sidebars)
  * [Bugs.jsx](file:///E:/Anb_Carfts_Projects/Target%20CV/TrackForge/Client/src/Pages/Bugs.jsx) (Direct bugs view panel)
* **Backend Controller**: [AI.Controllers.js](file:///E:/Anb_Carfts_Projects/Target%20CV/TrackForge/Server/src/Controllers/AI.Controllers.js) (`suggestAssignee`)
* **Backend Routes**: [AI.Routes.js](file:///E:/Anb_Carfts_Projects/Target%20CV/TrackForge/Server/src/Routes/AI.Routes.js)
* **Database Models**:
  * [User.Models.js](file:///E:/Anb_Carfts_Projects/Target%20CV/TrackForge/Server/src/Models/User.Models.js) (Added `skills`, `strengths`, `experience`, `resumeUrl`)
  * [Ticket.Models.js](file:///E:/Anb_Carfts_Projects/Target%20CV/TrackForge/Server/src/Models/Ticket.Models.js)

### 🔄 Data Flow
```
User clicks "Suggest Assignee" -> POST /api/ai/ticket/suggest-assignee (payload: ticketId)
                                          |
                                          v
                     Fetch ticket details & project members list
                                          |
                                          v
               Populate profile fields for all candidates from DB
                                          |
                                          v
               Format analysis prompt with ticket details & profiles
                                          |
                                          v
                    Request ranked match evaluation from LLaMA 3.3
                                          |
                                          v
                 Receive recommendations array (capped at max 3 items)
                                          |
                                          v
                        Render UI ranked card stack in client
```

### 🔌 API Endpoints

#### 1. POST `/api/ai/ticket/suggest-assignee`
Compiles developer profiles and returns ranked recommendations.
* **Payload**:
  ```json
  {
    "ticketId": "6a3fec096ef384a7d7b3e524"
  }
  ```
* **Response**:
  ```json
  {
    "success": true,
    "recommendations": [
      {
        "rank": 1,
        "suggestedUserId": "6a3fec046ef384a7d7b3e4ec",
        "suggestedUsername": "nathandeveloper",
        "suggestedName": "Nathan Developer",
        "reasoning": "Nathan Developer is ranked first due to his experience as a full stack engineer and his skills in TypeScript, which directly map to resolving the calculator crash."
      }
    ]
  }
  ```

---

## ⚡️ 3. AI Bug Analyst (Gemini)

Conducts a deep logical review of a bug ticket, detailing the root cause, providing patch code suggestions, and detailing preventative measures.

### 📁 File Locations
* **Client Pages**:
  * [ViewDetailedBug.jsx](file:///E:/Anb_Carfts_Projects/Target%20CV/TrackForge/Client/src/Pages/ViewDetailedBug.jsx) (AI Bug Analyst box)
  * [Bugs.jsx](file:///E:/Anb_Carfts_Projects/Target%20CV/TrackForge/Client/src/Pages/Bugs.jsx) (Middle view panel)
* **Backend Controller**: [AI.Controllers.js](file:///E:/Anb_Carfts_Projects/Target%20CV/TrackForge/Server/src/Controllers/AI.Controllers.js) (`analyzeBug`)
* **Backend Routes**: [AI.Routes.js](file:///E:/Anb_Carfts_Projects/Target%20CV/TrackForge/Server/src/Routes/AI.Routes.js)

### 🔄 Data Flow
```
User clicks "Analyze Bug" -> POST /api/ai/bug/:ticketId/analyze
                                   |
                                   v
                      Retrieve ticket information from DB
                                   |
                                   v
             Assemble prompt describing title, description, reproduce steps
                                   |
                                   v
                     Call Gemini Generative model API
                                   |
                                   v
                 Returns detailed Markdown response to Client
```

### 🔌 API Endpoints

#### 1. POST `/api/ai/bug/:ticketId/analyze`
Generates root cause analysis and patch codes.
* **Response**:
  ```json
  {
    "success": true,
    "analysis": "## Root Cause...\n\n```javascript\n// proposed patch...\n```"
  }
  ```

---

## 🔎 4. AI Code Analyzer & Bug Finder (Gemini)

Performs static code review in the workspace code editor, checking for syntax mistakes, logical bugs, security flaws, and resource/performance bottlenecks.

### 📁 File Locations
* **Frontend Component**: [CodeEditor.jsx](file:///E:/Anb_Carfts_Projects/Target%20CV/TrackForge/Client/src/Pages/CodeEditor.jsx) (AI Review sidebar drawer)
* **Backend Controller**: [AI.Controllers.js](file:///E:/Anb_Carfts_Projects/Target%20CV/TrackForge/Server/src/Controllers/AI.Controllers.js) (`analyzeCode`)
* **Backend Routes**: [AI.Routes.js](file:///E:/Anb_Carfts_Projects/Target%20CV/TrackForge/Server/src/Routes/AI.Routes.js)

### 🔌 API Endpoints

#### 1. POST `/api/ai/code/analyze`
* **Payload**:
  ```json
  {
    "code": "const divide = (a, b) => a / b;",
    "filename": "mathUtils.js"
  }
  ```
* **Response**:
  ```json
  {
    "success": true,
    "analysis": "### Issues Found\n- **Division by Zero Risk**: Ensure variable 'b' is validated..."
  }
  ```

---

## 📝 5. Auto-Bug Ticket Reporter (Auto-Mapper)

Allows engineers to immediately register code review concerns flagged by the AI Code Analyzer as full tickets in the bug tracker workspace.

### 📁 File Locations
* **Frontend modal**: [CodeEditor.jsx](file:///E:/Anb_Carfts_Projects/Target%20CV/TrackForge/Client/src/Pages/CodeEditor.jsx) (Modal triggers with mapped states)
* **Backend Controllers**: [Ticket.Controllers.js](file:///E:/Anb_Carfts_Projects/Target%20CV/TrackForge/Server/src/Controllers/Ticket.Controllers.js) (`createTicket`)
* **Backend Routes**: [Ticket.Routes.js](file:///E:/Anb_Carfts_Projects/Target%20CV/TrackForge/Server/src/Routes/Ticket.Routes.js)

### 🔄 Data Flow
```
Flagged issue in code review -> Click "Report Ticket"
                                    |
                                    v
     Auto-populate Modal inputs: Title (Concern), Description (AI analysis details),
     Steps to reproduce (Line ranges & code snippet)
                                    |
                                    v
     Manager submits modal -> POST /api/ticket/create (registers ticket in DB)
```
