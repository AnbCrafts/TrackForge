# 🌌 TrackForge Platform Architecture & Special Feature Flows

This document details the high-level system architecture and the step-by-step logic flows for specialized features inside TrackForge (Recursive Member aggregation, Scheduled Meeting Rooms, AI code review ticketing, and AI ranked assignment suggestions).

---

## 🧭 1. System Topology

TrackForge is structured as a MERN stack application with three major layers: the Client interface, the API engine, and the DB/Cloud services layer.

```
+--------------------------------------------------------------+
|                       1. CLIENT LAYER                        |
|                                                              |
|   +------------------+  +------------------+  +----------+   |
|   |  Vite/React UI   |  |   Context API    |  |  Socket  |   |
|   +--------+---------+  +--------+---------+  +----+-----+   |
+------------|---------------------|-----------------|---------+
             | REST                | State Hooks     | WS Handshakes
             v                     v                 v
+------------+---------------------+-----------------+---------+
|                       2. SERVER API LAYER                    |
|                                                              |
|         +--------------------------------------------+       |
|         |               Express Server               |       |
|         |  - Security & Authentication Middleware    |       |
|         |  - HTTP Endpoint Controllers               |       |
|         |  - Socket.io Real-time Rooms               |       |
|         +---------------------+----------------------+       |
+-------------------------------|------------------------------+
                                v Mongoose ODM Queries
+-------------------------------+------------------------------+
|                    3. DATABASE & CLOUD LAYER                 |
|                                                              |
|         +--------------+  +--------------+  +------------+   |
|         |  MongoDB DB  |  |  Groq/Gemini |  | Cloudinary |   |
|         +--------------+  +--------------+  +------------+   |
+--------------------------------------------------------------+
```

---

## 🔄 2. Special Feature Flowcharts

### Flow A: Recursive Project Assignee Aggregation
When matching candidates or looking up eligible assignees for a project's ticket, the server resolves both direct project members and indirect members associated with teams joined to that project.

```
       [Request Project/Ticket ID]
                    |
                    v
       Fetch Project record from DB
                    |
                    v
    Extract "project.members" array
                    |
                    v
    Loop: Add each direct member to Map (Key: MemberID)
                    |
                    v
   Does "project.teams" array have items?
       /                         \
    (Yes)                        (No)
      |                            |
      v                            |
Fetch all Team records             |
      |                            |
      v                            |
Loop: Extract "team.members.participant" for each team
      |                            |
      v                            |
Add participants to Map ----------->
(Automatically filters duplicates)
                    |
                    v
      [Return Final Map Values Array]
```

---

### Flow B: Scheduled Event Meeting Rooms (Time-Locked Sync)
Provides calendar-bounded, time-locked messaging chambers for teams.

```
      Owner schedules Meeting Room (date, time, attendees)
                                |
                                v
      Send Invitation Inbox alerts to all invited members
                                |
                                v
           Member attempts to enter Meeting Room
                                |
                                v
           Is the current time matches the schedule?
               /                         \
            (No)                        (Yes)
              |                            |
              v                            v
    Render visual locked banner      Establish socket connection
    Disable chat inputs & logs       Join roomId socket room
                                     Enable message streams & media uploads
```

---

### Flow C: AI Code review & Auto-Bug Ticket creation
Bridges the Code Editor static code reviewer with the workspace bug tracker.

```
   Open active code file -> Trigger "AI Code Review" (Gemini API)
                                    |
                                    v
            Render flagged code concerns in review drawer
                                    |
                                    v
     Developer clicks "Report Ticket" on a specific review issue
                                    |
                                    v
            Pulls concern details & maps to modal states:
            - Title: "Code issue in [file]"
            - Description: [AI analysis details]
            - Steps to Reproduce: [Line range code snippet]
                                    |
                                    v
      User designates priority/assignee -> Click Submit
                                    |
                                    v
      Dispatches POST /api/ticket/create (Registers bug in DB)
```

---

### Flow D: Ranked AI Assignee Suggestion
Matches bug complexity and technology requirements to developer skillsets and experience.

```
             Ticket ID submitted to Suggest API
                             |
                             v
         Populate eligible candidates' profiles from DB:
         (Role, Skills array, Strengths, Experience summary)
                             |
                             v
        Build prompt describing bug title, description, priority,
        along with candidate expertise details
                             |
                             v
           Submit evaluation request to Groq LLaMA 3.3
                             |
                             v
       LLaMA evaluates matching scores & outputs ranked candidates list
       (capped at max 3 items, filters irrelevant profiles)
                             |
                             v
         Return ranked array of candidates + reasonings to Client
                             |
                             v
       Renders ranked cards in bug view -> Click to assign user
```
