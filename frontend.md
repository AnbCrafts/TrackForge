# 🎨 TrackForge Frontend Architecture Specification

This document details the frontend architecture, state management, styling design system, routing, and workflows of **TrackForge**.

---

## 🧭 1. Architectural Structure

The client is built using **React** compiled with **Vite** for rapid development and optimization. It follows a modular page-and-component architectural pattern:

```
                            +--------------------------+
                            |          App.jsx         |
                            |  (Router & Auth Wrapper) |
                            +------------+-------------+
                                         |
                       +-----------------+-----------------+
                       |                                   |
                       v                                   v
             +---------+---------+               +---------+---------+
             |    Context API    |               |   Layout Wrapper  |
             | (State, Socket,   |               |   (SideBar, Nav,  |
             |  API Requests)    |               |    ChatbotWidget) |
             +-------------------+               +---------+---------+
                                                           |
                                 +-------------------------+-------------------------+
                                 |                         |                         |
                                 v                         v                         v
                       +---------+---------+     +---------+---------+     +---------+---------+
                       |    Projects /     |     |   Bugs / Ticket   |     |  User Profile /   |
                       |    Code Editor    |     |      Details      |     |   Settings Edit   |
                       +-------------------+     +-------------------+     +-------------------+
```

---

## 🔄 2. State Management & API Gateway (`TrackForgeContextAPI.jsx`)

All server communication, real-time socket connections, and global application state reside inside the **TrackForge Context API**.

### 📁 File Location:
* **Context Core**: [TrackForgeContextAPI.jsx](file:///E:/Anb_Carfts_Projects/Target%20CV/TrackForge/Client/src/ContextAPI/TrackForgeContextAPI.jsx)

### 🔑 Critical Responsibilities:
1. **Dynamic Environment Hosting**:
   Detects the active browser hostname to dynamically toggle between the production backend URL and local development fallbacks:
   ```javascript
   const serverURL = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
     ? "http://127.0.0.1:9000/api"
     : "https://trackforge-server-side.onrender.com/api";
   ```
2. **Global Auth State**: Holds the active user object (`authUserData`), managing token allocations and route clearances.
3. **Socket.io Handlers**: Establishes WebSockets, handles auto-reconnections, manages online/offline user states, and receives real-time inbox/meeting events.
4. **CRUD Actions**: Exports API handlers for projects, teams, bug tickets, comments, and activities using Axios.

---

## 🎨 3. Styling Design System (Vanilla CSS & Tailwind)

TrackForge implements a custom, premium design system using TailwindCSS utility classes combined with custom tokens defined in **`index.css`**.

### 🎨 Colors & Theme Tokens:
* **`bg-primary`**: Sleek deep-dark background color.
* **`bg-secondary`**: Solid dark card background.
* **`bg-card`**: Glassmorphic semi-transparent backdrop (`backdrop-blur-md bg-secondary/80`).
* **`border-default`**: Thin boundary outline (`border-default/40`).
* **`text-primary`**: Off-white for high-readability text headers.
* **`text-secondary`**: Gray-purple text for descriptions.
* **`text-neon`**: Vibrant neon pink/purple accent coloring.
* **`btn-gradient`**: Glowing gradient for action buttons (`bg-gradient-to-r from-purple-600 to-pink-500 hover:scale-[1.02]`).

---

## 🧭 4. Routing & Session Cipher Isolation

React Router DOM manages the page locations. All pages are mounted inside a workspace layout that checks user credentials using session ciphers.

### 📁 Routes Breakdown (`App.jsx`):
* **Workspace Isolation Wrapper**:
  `/auth/:hash/:username/workspace`
  * Matches the 64-character SHA-256 session token (`hash`) and the user's `username`.
  * Renders the layout sidebar, floating chatbot widget, and active routes.
* **Core Views**:
  * `/dashboard`: Dynamic Quick-Action cards.
  * `/projects`: Grid of user projects.
  * `/projects/:projectId`: Folder explorers, repository uploads, and files.
  * `/bugs`: Split-pane ticket tracker.
  * `/ticket-detail/:ticketId`: Detailed ticket logs, activity timelines, AI analysis, and assignee matching.
  * `/profile`: User profiles (skills, strengths, experience, resume link, stats).
  * `/settings/update-profile`: Profile update form.

---

## 🛠️ 5. Key Workflows & Pages

### 🤖 1. Global AI Chatbot Widget (`ChatbotWidget.jsx`)
* Floating globally on the bottom-right corner of the workspace dashboard.
* Pulls user session history logs (`/history/:userId`) on mounting.
* Uses custom code parsers (`SyntaxHighlighter` and code block wrappers) to render copyable code boxes from Markdown replies.

### 🎯 2. Ranked AI Assignee Suggestion UI
* Integrated inside [ViewDetailedBug.jsx](file:///E:/Anb_Carfts_Projects/Target%20CV/TrackForge/Client/src/Pages/ViewDetailedBug.jsx) and [Bugs.jsx](file:///E:/Anb_Carfts_Projects/Target%20CV/TrackForge/Client/src/Pages/Bugs.jsx).
* Dispatches `POST /api/ai/ticket/suggest-assignee`.
* Maps the returned array to display a ranked card stack detailing Ranks (`Rank #1`, `Rank #2`), full candidate names, and matching reasonings.
* Assign button routes directly to backend assignment updates and refreshes the parent ticket list dynamically.

### 👤 3. Profile & Portfolio Details
* **Profile Edit**: Converts comma-separated text strings for Skills and Strengths into clean string arrays inside [EditProfile.jsx](file:///E:/Anb_Carfts_Projects/Target%20CV/TrackForge/Client/src/Pages/EditProfile.jsx) on submission.
* **Profile View**: Maps skills and strengths to custom-pill badges next to stats grids, renders experiences as blockquotes, and adds resume buttons.
* **GitHub Linkage**: Displays links to associate user profiles with GitHub accounts.
