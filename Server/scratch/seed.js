import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), ".env") });

import User from "../src/Models/User.Models.js";
import Project from "../src/Models/Project.Models.js";
import Team from "../src/Models/Team.Models.js";
import Ticket from "../src/Models/Ticket.Models.js";
import MeetingRoom from "../src/Models/MeetingRoom.Models.js";
import Activity from "../src/Models/Activity.Models.js";
import Comment from "../src/Models/Comment.Models.js";
import Message from "../src/Models/Message.Models.js";
import RoomMessage from "../src/Models/RoomMessage.Models.js";
import { DB_NAME } from "../src/Constants/Constant.js";

const seed = async () => {
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

    console.log("Connecting to database at:", connectionUrl);
    await mongoose.connect(connectionUrl);
    console.log("Connected to MongoDB!");

    // Clean existing collections
    console.log("Cleaning database collections...");
    await User.deleteMany({});
    await Project.deleteMany({});
    await Team.deleteMany({});
    await Ticket.deleteMany({});
    await MeetingRoom.deleteMany({});
    await Activity.deleteMany({});
    await Comment.deleteMany({});
    await Message.deleteMany({});
    await RoomMessage.deleteMany({});
    console.log("Database cleaned successfully.");

    // Helper to hash password
    const hashPassword = async (pass) => {
      return await bcrypt.hash(pass, 10);
    };

    // 1. Create alicesmith User
    console.log("Creating alicesmith user...");
    const alicePasswordHashed = await hashPassword("Alice@12345");
    const alice = new User({
      username: "alicesmith",
      firstName: "Alice",
      lastName: "Smith",
      email: "alice.smith@trackforge.com",
      password: alicePasswordHashed,
      role: "Admin",
      status: "Online",
      manages: [],
      teams: [],
      ticketsAssigned: []
    });
    await alice.save();

    // 2. Create 14 other users for different roles
    console.log("Creating other users...");
    const testPasswordHashed = await hashPassword("TestPass@12345");
    
    const usersData = [
      { username: "johnowner", firstName: "John", lastName: "Doe", email: "john.owner@trackforge.com", role: "Owner" },
      { username: "bobdeveloper", firstName: "Bob", lastName: "Builder", email: "bob.dev@trackforge.com", role: "Developer" },
      { username: "charliedebugger", firstName: "Charlie", lastName: "Debugger", email: "charlie.debug@trackforge.com", role: "Debugger" },
      { username: "davidetester", firstName: "David", lastName: "Tester", email: "david.test@trackforge.com", role: "Tester" },
      { username: "evemember", firstName: "Eve", lastName: "Member", email: "eve.member@trackforge.com", role: "Member" },
      { username: "frankdev", firstName: "Frank", lastName: "Developer", email: "frank.dev@trackforge.com", role: "Developer" },
      { username: "gracetester", firstName: "Grace", lastName: "Tester", email: "grace.test@trackforge.com", role: "Tester" },
      { username: "henrydebugger", firstName: "Henry", lastName: "Debugger", email: "henry.debug@trackforge.com", role: "Debugger" },
      { username: "isabelmember", firstName: "Isabel", lastName: "Member", email: "isabel.member@trackforge.com", role: "Member" },
      { username: "jackadmin", firstName: "Jack", lastName: "Admin", email: "jack.admin@trackforge.com", role: "Admin" },
      { username: "karendev", firstName: "Karen", lastName: "Developer", email: "karen.dev@trackforge.com", role: "Developer" },
      { username: "leotester", firstName: "Leo", lastName: "Tester", email: "leo.test@trackforge.com", role: "Tester" },
      { username: "miadebugger", firstName: "Mia", lastName: "Debugger", email: "mia.debug@trackforge.com", role: "Debugger" },
      { username: "nathandeveloper", firstName: "Nathan", lastName: "Developer", email: "nathan.dev@trackforge.com", role: "Developer" }
    ];

    const users = [];
    for (const u of usersData) {
      const userDoc = new User({
        username: u.username,
        firstName: u.firstName,
        lastName: u.lastName,
        email: u.email,
        password: testPasswordHashed,
        role: u.role,
        status: "Offline",
        manages: [],
        teams: [],
        ticketsAssigned: [],
        createdBy: alice._id
      });
      await userDoc.save();
      users.push(userDoc);
    }
    console.log("Users created successfully.");

    // 3. Create 5 projects and write related files to disk
    console.log("Creating projects and files on disk...");
    
    // Create folders on disk if they don't exist
    const publicFilesDir = path.join(process.cwd(), "src/public/files/projects");
    fs.mkdirSync(publicFilesDir, { recursive: true });

    const projectsData = [
      {
        name: "Calculator App",
        description: "A futuristic HTML, CSS, JS based calculator application with premium aesthetics.",
        folderName: "calculator-app",
        files: [
          {
            filename: "index.html",
            folder: "src",
            content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Neon Calculator</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="calculator">
        <div id="display" class="display">0</div>
        <div class="buttons">
            <button onclick="clearDisplay()">C</button>
            <button onclick="append('/')">/</button>
            <button onclick="append('*')">*</button>
            <button onclick="append('-')">-</button>
            <button onclick="append('7')">7</button>
            <button onclick="append('8')">8</button>
            <button onclick="append('9')">9</button>
            <button onclick="append('+')">+</button>
            <button onclick="calculate()">=</button>
        </div>
    </div>
    <script src="script.js"></script>
</body>
</html>`
          },
          {
            filename: "style.css",
            folder: "src",
            content: `body {
  background: #0f0c1b;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  margin: 0;
  font-family: sans-serif;
}
.calculator {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
}`
          },
          {
            filename: "script.js",
            folder: "src",
            content: `function append(val) {
  const display = document.getElementById("display");
  if (display.innerText === "0") {
    display.innerText = val;
  } else {
    display.innerText += val;
  }
}
function clearDisplay() {
  document.getElementById("display").innerText = "0";
}
function calculate() {
  const display = document.getElementById("display");
  try {
    display.innerText = eval(display.innerText);
  } catch (e) {
    display.innerText = "Error";
  }
}`
          }
        ]
      },
      {
        name: "TrackForge SaaS",
        description: "Next-gen bug tracking and agile team management workspace framework.",
        folderName: "trackforge-saas",
        files: [
          {
            filename: "ConnectDB.js",
            folder: "src/DB",
            content: `import mongoose from "mongoose";
export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log("DB connected:", conn.connection.host);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};`
          },
          {
            filename: "User.Models.js",
            folder: "src/Models",
            content: `import mongoose from "mongoose";
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  role: { type: String, enum: ["Admin", "User"], default: "User" }
});
export const User = mongoose.model("User", UserSchema);`
          }
        ]
      },
      {
        name: "E-Commerce API",
        description: "RESTful backend engine for high-throughput ecommerce operations and checkout workflows.",
        folderName: "ecommerce-api",
        files: [
          {
            filename: "server.js",
            folder: "",
            content: `const express = require("express");
const app = express();
app.use(express.json());
app.get("/api/products", (req, res) => {
  res.json([{ id: 1, name: "Premium Laptop", price: 1299 }]);
});
app.listen(8000, () => console.log("E-commerce API listening on port 8000"));`
          },
          {
            filename: "checkout.routes.js",
            folder: "routes",
            content: `const { Router } = require("express");
const router = Router();
router.post("/pay", (req, res) => {
  res.status(200).json({ success: true, txnId: "TXN_" + Date.now() });
});
module.exports = router;`
          }
        ]
      },
      {
        name: "Portfolio Website",
        description: "Clean, silky smooth white-purple dashboard portfolio showcasing personal accomplishments.",
        folderName: "portfolio-website",
        files: [
          {
            filename: "Navbar.jsx",
            folder: "components",
            content: `import React from 'react';
export default function Navbar() {
  return (
    <nav className="flex justify-between items-center px-8 py-4 bg-white shadow-sm">
      <div className="font-bold text-purple-600">MyBrand</div>
      <div className="flex gap-4">
        <a href="#about">About</a>
        <a href="#projects">Projects</a>
      </div>
    </nav>
  );
}`
          },
          {
            filename: "Hero.jsx",
            folder: "components",
            content: `import React from 'react';
export default function Hero() {
  return (
    <header className="py-20 text-center bg-gradient-to-br from-purple-50 to-pink-50">
      <h1 className="text-4xl font-extrabold text-gray-900">Creative Full-Stack Developer</h1>
      <p className="text-gray-500 mt-2">Crafting digital products with absolute care.</p>
    </header>
  );
}`
          }
        ]
      },
      {
        name: "Task Scheduler CLI",
        description: "A fast, lightweight Go-based scheduler command line interface to manage server cron jobs.",
        folderName: "task-scheduler-cli",
        files: [
          {
            filename: "main.go",
            folder: "cmd",
            content: `package main
import (
	"fmt"
	"time"
)
func main() {
	fmt.Println("Starting Task Scheduler...")
	for {
		fmt.Printf("[%s] Running cron jobs...\n", time.Now().Format(time.RFC3339))
		time.Sleep(5 * time.Second)
	}
}`
          }
        ]
      }
    ];

    const projects = [];
    for (const p of projectsData) {
      // Create folder schema
      const folderMap = {};
      
      for (const f of p.files) {
        const folderKey = f.folder || p.name; // default to project name if root
        
        // Write mock code file to disk
        const targetDir = path.join(publicFilesDir, p.folderName, f.folder);
        fs.mkdirSync(targetDir, { recursive: true });
        const filePathOnDisk = path.join(targetDir, f.filename);
        fs.writeFileSync(filePathOnDisk, f.content, "utf-8");

        // Calculate size
        const stats = fs.statSync(filePathOnDisk);
        
        // Generate relative URL path for the db path
        const relativeUrlPath = `/public/files/projects/${p.folderName}/${f.folder ? f.folder + '/' : ''}${f.filename}`;

        if (!folderMap[folderKey]) {
          folderMap[folderKey] = [];
        }

        folderMap[folderKey].push({
          filename: f.filename,
          path: relativeUrlPath,
          size: stats.size,
          fileType: f.filename.endsWith(".html") ? "text/html" : f.filename.endsWith(".css") ? "text/css" : f.filename.endsWith(".go") ? "text/plain" : "application/javascript",
          uploadedAt: new Date(),
          uploadedBy: alice._id
        });
      }

      // Convert folderMap to folders array
      const folders = Object.keys(folderMap).map(folderName => ({
        name: folderName,
        files: folderMap[folderName]
      }));

      const projDoc = new Project({
        name: p.name,
        description: p.description,
        folders: folders,
        owner: alice._id,
        members: [alice._id, ...users.map(u => u._id)],
        hasAuthToSee: [alice._id, ...users.map(u => u._id)],
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        startedOn: new Date(),
        archived: false,
        teams: [],
        activity: []
      });
      await projDoc.save();
      projects.push(projDoc);
    }
    console.log("Projects created and files written to disk.");

    // Update Alice manages list
    alice.manages = projects.map(p => p._id);
    await alice.save();

    // 4. Create 5 Teams and link them to projects & members
    console.log("Creating teams...");
    const teamNames = ["Alpha Avengers", "Beta Builders", "Gamma Guardians", "Delta Debuggers", "Epsilon Elite"];
    const teams = [];

    for (let i = 0; i < teamNames.length; i++) {
      const associatedProject = projects[i]; // 1:1 mapping
      
      const teamDoc = new Team({
        name: teamNames[i],
        createdBy: alice._id,
        projects: [associatedProject._id],
        members: [
          { participant: alice._id, joinedAt: new Date() },
          ...users.slice(i * 2, (i + 1) * 2).map(u => ({ participant: u._id, joinedAt: new Date() }))
        ],
        hasAuthToSee: [alice._id, ...users.map(u => u._id)],
        link: {
          url: `http://localhost:9000/api/team/invite/${associatedProject._id}`,
          createdAt: new Date(),
          validTill: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          createdBy: alice._id,
          status: "Active"
        }
      });
      await teamDoc.save();
      teams.push(teamDoc);

      // Link team inside Project
      associatedProject.teams = [teamDoc._id];
      await associatedProject.save();

      // Link team in users manages/teams
      alice.teams.push(teamDoc._id);
      for (const u of users.slice(i * 2, (i + 1) * 2)) {
        u.teams.push(teamDoc._id);
        u.manages.push(associatedProject._id);
        await u.save();
      }
    }
    await alice.save();
    console.log("Teams created successfully.");

    // 5. Create Bug Tickets for each project
    console.log("Creating bug tickets...");
    const ticketsData = [
      { title: "Division by Zero crash", description: "Calculator crashes with screen freezing when dividing by 0.", priority: "Critical", status: "Open" },
      { title: "Glow shadow overlapping buttons", description: "Glow shadow classes overlapping button click boundaries in Safari.", priority: "Low", status: "Open" },
      { title: "Mongoose schema status validation failure", description: "Mongoose updates fail due to case-sensitive status field verification check.", priority: "High", status: "In Progress" },
      { title: "Connection timeout on heavy queries", description: "Aggregation pipeline times out when retrieving large project logs.", priority: "Medium", status: "Open" },
      { title: "Token mismatch during OAuth callback", description: "GitHub authorization throws invalid token verification error intermittently.", priority: "High", status: "Closed" }
    ];

    for (let i = 0; i < ticketsData.length; i++) {
      const p = projects[i];
      const t = ticketsData[i];
      const assignedDeveloper = users[i * 2] || users[0];

      const ticketDoc = new Ticket({
        title: t.title,
        description: t.description,
        assignedTo: assignedDeveloper._id,
        assignedOn: new Date(),
        validFor: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        status: t.status,
        priority: t.priority,
        projectId: p._id,
        createdBy: alice._id,
        stepsToReproduce: [
          "Open the app workspace",
          "Perform the target trigger action",
          "Observe behavior vs expectation"
        ]
      });
      await ticketDoc.save();

      // Link ticket to assigned user
      assignedDeveloper.ticketsAssigned.push(ticketDoc._id);
      await assignedDeveloper.save();
    }
    console.log("Bug tickets created successfully.");

    // 6. Create Meeting Rooms
    console.log("Creating meeting rooms...");
    const meetingsData = [
      { title: "Agile Standup", purpose: "Daily review of open critical bugs and developer assignment.", roomId: "standup_room_calc", projectIdx: 0 },
      { title: "SaaS Launch Sync", purpose: "Verify OAuth integration security callbacks before release.", roomId: "launch_sync_saas", projectIdx: 1 },
      { title: "Database Optimizations", purpose: "Review aggregation pipelines and clean up user status enums.", roomId: "db_optimize_room", projectIdx: 2 }
    ];

    for (const m of meetingsData) {
      const p = projects[m.projectIdx];
      const meetingDoc = new MeetingRoom({
        title: m.title,
        purpose: m.purpose,
        scheduledDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // tomorrow
        projectId: p._id,
        teams: p.teams,
        users: [alice._id, ...users.map(u => u._id)],
        creator: alice._id,
        roomId: m.roomId
      });
      await meetingDoc.save();
    }
    console.log("Meeting rooms created successfully.");

    console.log("\n🚀 DATABASE SEEDING COMPLETED SUCCESSFULLY!");
    console.log("-----------------------------------------");
    console.log("Login User: alicesmith");
    console.log("Password:   Alice@12345");
    console.log("Other Users Password: TestPass@12345");
    console.log("-----------------------------------------");

    await mongoose.disconnect();
    console.log("Disconnected from database.");
    process.exit(0);

  } catch (error) {
    console.error("❌ Seeding failed with error:", error);
    process.exit(1);
  }
};

seed();
