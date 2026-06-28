# 🌌 TrackForge Backend Architecture Specification

This document provides a comprehensive breakdown of the TrackForge server-side architecture, detailing every architectural design decision, database design, security cipher design, real-time gateway, and AI integration layer.

---

## 🧭 1. Architectural Overview

The backend is built as a **highly responsive monolithic Node.js & Express REST API combined with a Socket.io real-time event engine**. It utilizes MongoDB as its primary persistence layer and interacts with external cloud services (Cloudinary, Groq, Gemini) to handle media assets and AI processing.

```
                                  +-----------------------+
                                  |    HTTP / WebSocket   |
                                  +-----------+-----------+
                                              |
                                              v
                                  +-----------+-----------+
                                  |     Express App       |
                                  | (CORS, Parsers, Auth) |
                                  +-----+-----------+-----+
                                        |           |
                      +-----------------+           +-----------------+
                      |                                               |
                      v                                               v
            +---------+---------+                           +---------+---------+
            |    Socket.io      |                           |   REST Controllers|
            |  Real-time Engine |                           | (Auth, Tickets...)|
            +---------+---------+                           +---------+---------+
                      |                                               |
                      +-----------------------+-----------------------+
                                              |
                                              v
                                  +-----------+-----------+
                                  |  Mongoose ODM Layer   |
                                  +-----------+-----------+
                                              |
                                              v
                                  +-----------+-----------+
                                  |     MongoDB Server    |
                                  +-----------------------+
```

---

## 🔌 2. Server Entrypoint (`index.js`)

The entrypoint [index.js](file:///E:/Anb_Carfts_Projects/Target%20CV/TrackForge/Server/index.js) orchestrates the server boot sequence, handles socket bindings, and maps global middleware.

### 🔑 Critical Design Choices:
1. **Express & HTTP Wrapper**: Since Socket.io requires binding to a native Node.js HTTP server, Express is instantiated and wrapped inside `http.createServer(app)`.
2. **Dynamic CORS Origin Reflection**:
   To prevent multi-environment CORS blocks (local testing vs. production Render deployments), the server dynamically authorizes any requesting origin with credentials enabled:
   ```javascript
   app.use(cors({
     origin: (origin, callback) => callback(null, true),
     credentials: true
   }));
   ```
3. **Socket.io CORS Matching**:
   Socket.io CORS uses the exact same dynamic mapping to ensure client connections never fail handshake checks:
   ```javascript
   const io = new Server(server, {
     cors: {
       origin: (origin, callback) => callback(null, true),
       credentials: true,
       methods: ["GET", "POST", "PUT", "DELETE"]
     }
   });
   ```

---

## 🗄️ 3. Database Architecture (Mongoose Models)

MongoDB stores data inside collections mapped through strict Mongoose schemas inside `Server/src/Models/`.

```
                  +-----------------------------------+
                  |            Project                |
                  +--+-----------------------------+--+
                     |                             |
                     | 1:N (members)               | 1:N (teams)
                     v                             v
            +--------+--------+           +--------+--------+
            |      User       |           |      Team       |
            +---+-----------+-+           +--------+--------+
                |           |                      ^
   1:1 (AIChat) |           | 1:N (ticketsAssigned)| 1:N (participants)
                v           v                      |
         +------+---+   +---+------+               |
         |  AIChat  |   |  Ticket  +---------------+
         +----------+   +----+-----+
                             |
                             | 1:N
                             v
                       +-----+----+
                       | Activity |
                       +----------+
```

### 📁 Schema Breakdowns:

#### 1. User Model (`User.Models.js`)
Stores authentication records, credentials, workspace roles, and the newly added AI optimization fields:
* **Added Fields**:
  * `skills` (`[String]`): Coding toolchains.
  * `strengths` (`[String]`): Specializations.
  * `experience` (`String`): Professional history.
  * `resumeUrl` (`String`): Resume download URL.
* **Indexes**: Unique index on `username` and `email` for \(O(1)\) authentication lookups.

#### 2. Ticket Model (`Ticket.Models.js`)
Tracks bug reports and issue logs:
* **Relations**: Linked to `giver` (Creator - User ref), `doer` (Assignee - User ref), and `projectId` (Project ref).
* **States**: Priority (`Low`, `Medium`, `High`, `Critical`) and Status (`Open`, `In Progress`, `Under Review`, `Resolved`, `Closed`).

#### 3. AIChat Model (`AIChat.Models.js`)
Persists custom Groq chatbot logs:
* **Structure**:
  ```javascript
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true },
  messages: [
    {
      role: { type: String, enum: ["user", "model"], required: true },
      parts: [
        {
          text: { type: String, required: true }
        }
      ],
      timestamp: { type: Date, default: Date.now }
    }
  ]
  ```

#### 4. Team Model (`Team.Models.js`)
Tracks user groups. Direct project memberships are expanded recursively to include team participants when compiling assignee candidates.

---

## 🔐 4. Security & Cryptographic Cipher System

TrackForge isolates user sessions and URLs using a custom **64-character cryptographic token** (a SHA-256 secure hash) instead of standard sequential database IDs.

### 🔄 The Session Cipher Generation Flow:
```
User Logins -> Create Payload (UserID + Current Epoch Timestamp + Cryptographic Salt)
                     |
                     v
             Generate SHA-256 Hash -> Store as Session Cipher
                     |
                     v
    Navigate Workspace URL: /auth/:hash/:username/workspace
```

### 🛡️ Authentication Middleware (`VerifyUser.js`):
1. Client requests include the user's `userId` in headers or URL parameters.
2. The server compares this against the active session token hash.
3. Restricts unauthorized users from spoofing workspace routing.

---

## 💬 5. Socket.io Real-time Gateway

WebSocket channels handle real-time team interactions, inbox chat rooms, and scheduled meeting rooms.

### 🔑 Architectural Designs:
* **Global Connection Mapping**: When a client connects, they join their own private room using their `userId` so targeted private messages can be dispatched to them: `socket.join(userId)`.
* **Room-based Partitioning**:
  * **Inbox Chat**: Users chat in rooms named `chat_userId1_userId2`.
  * **Meeting Rooms**: Users join room keys named after the `roomId` to receive real-time streams during scheduled team syncs.
* **Auto-Invite Alerts**: Creating a scheduled room automatically posts invite alert cards into target participants' private inbox rooms.

---

## 🤖 6. AI Integrations & LLM Layer

The server orchestrates API queries to external LLM services:

### 1. Groq LLaMA 3.3 API Layer
Used for Chatbot and Ranked Assignee Suggestions.
* **Llama Model**: `llama-3.3-70b-versatile` (chosen for sub-second completions and JSON schema compliance).
* **System Prompts**: Bounds responses to programming topics and requires JSON structures.

### 2. Gemini Generative AI Layer
Used for deep Bug Analysis and Code Reviews.
* **Gemini Model**: Generative model loaded via `@google/generative-ai` SDK.
* **Markdown Parsing**: Delivers rich markdown listings with inline code highlighting blocks.
