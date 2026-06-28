import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "../src/Models/User.Models.js";
import { DB_NAME } from "../src/Constants/Constant.js";

dotenv.config();

const usersProfileData = {
  bobdeveloper: {
    skills: ["JavaScript", "Node.js", "Express.js", "React.js", "HTML5", "CSS3", "Git"],
    strengths: ["Web App Development", "Frontend Integration", "UI/UX Styling"],
    experience: "Junior Full Stack Developer with 1.5 years of experience building responsive dashboards, React components, and REST APIs.",
    resumeUrl: "https://trackforge-resumes.s3.amazonaws.com/bob_builder_resume.pdf"
  },
  frankdev: {
    skills: ["Python", "Django", "Flask", "PostgreSQL", "REST APIs", "Docker"],
    strengths: ["Backend Architectures", "Database Optimization", "API Design"],
    experience: "Software Engineer focused on high-performance backend microservices and relational database management. 3 years experience.",
    resumeUrl: "https://trackforge-resumes.s3.amazonaws.com/frank_dev_resume.pdf"
  },
  karendev: {
    skills: ["Java", "Spring Boot", "MySQL", "Redis", "Kafka", "AWS"],
    strengths: ["Distributed Systems", "Cloud Deployments", "Caching Strategies"],
    experience: "Senior Java Developer with 5 years experience designing scalable enterprise systems and cloud architectures on AWS.",
    resumeUrl: "https://trackforge-resumes.s3.amazonaws.com/karen_dev_resume.pdf"
  },
  nathandeveloper: {
    skills: ["TypeScript", "NestJS", "GraphQL", "MongoDB", "Jest", "CI/CD"],
    strengths: ["Strict Type Safety", "API Testing", "Continuous Integration"],
    experience: "Full Stack TypeScript engineer specializing in NestJS backends, MongoDB aggregation pipelines, and fully automated testing pipelines.",
    resumeUrl: "https://trackforge-resumes.s3.amazonaws.com/nathan_dev_resume.pdf"
  },
  charliedebugger: {
    skills: ["C++", "Python", "GDB", "Memory Profiling", "Valgrind", "Linux System Administration"],
    strengths: ["Root Cause Investigation", "Memory Leak Diagnostic", "System Debugging"],
    experience: "Systems Debugger specializing in memory leaks, race conditions, stack trace analysis, and native code profiling using GDB and Valgrind.",
    resumeUrl: "https://trackforge-resumes.s3.amazonaws.com/charlie_debugger_resume.pdf"
  },
  henrydebugger: {
    skills: ["JavaScript", "Node.js", "Chrome DevTools", "Sentry", "Error Logging", "Postman"],
    strengths: ["API Debugging", "Error Monitoring", "Network Profiling"],
    experience: "QA Debugging Specialist focusing on monitoring frontend error states, tracking API bottlenecks, and writing diagnostic Sentry reports.",
    resumeUrl: "https://trackforge-resumes.s3.amazonaws.com/henry_debugger_resume.pdf"
  },
  miadebugger: {
    skills: ["Python", "Pytest", "APM Tools", "Log Analysis", "Docker", "Linux Shell"],
    strengths: ["Automated Debugging", "Log Analysis", "Container Monitoring"],
    experience: "DevOps Debugging Engineer. Analyzes server log traces, tracks down production server crashes, and manages Docker container state diagnostics.",
    resumeUrl: "https://trackforge-resumes.s3.amazonaws.com/mia_debugger_resume.pdf"
  },
  davidetester: {
    skills: ["Selenium", "Cypress", "Appium", "Mocha", "Manual Testing", "Test Cases"],
    strengths: ["End-to-End Automated Testing", "UI Verification", "Regression Testing"],
    experience: "QA Automation Engineer with 2 years of experience writing comprehensive end-to-end browser test suites using Cypress and Selenium.",
    resumeUrl: "https://trackforge-resumes.s3.amazonaws.com/david_tester_resume.pdf"
  },
  gracetester: {
    skills: ["JMeter", "Postman", "K6", "Load Testing", "API Security Verification"],
    strengths: ["Performance Load Testing", "API Security Verification", "Stress Testing"],
    experience: "Performance Engineer specializing in server load testing, stress simulation, and validating endpoint limits under concurrent client traffic.",
    resumeUrl: "https://trackforge-resumes.s3.amazonaws.com/grace_tester_resume.pdf"
  },
  leotester: {
    skills: ["Manual Testing", "Black Box Testing", "Bug Reporting", "Jira", "TestRail"],
    strengths: ["Exploratory Testing", "Bug Reproduction Reports", "Usability Testing"],
    experience: "QA Specialist focusing on exploratory black-box testing, detailed bug reproduction documentation, and validating user workflows.",
    resumeUrl: "https://trackforge-resumes.s3.amazonaws.com/leo_tester_resume.pdf"
  }
};

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
    console.log("Connected to MongoDB for update profiles operation.");

    for (const [username, details] of Object.entries(usersProfileData)) {
      const updated = await User.findOneAndUpdate(
        { username: username },
        {
          $set: {
            skills: details.skills,
            strengths: details.strengths,
            experience: details.experience,
            resumeUrl: details.resumeUrl
          }
        },
        { new: true }
      );
      if (updated) {
        console.log(`Successfully updated profile for user: ${username}`);
      } else {
        console.warn(`User profile not found in database to update: ${username}`);
      }
    }

    await mongoose.disconnect();
    console.log("Database disconnected successfully.");
    process.exit(0);
  } catch (err) {
    console.error("Updates seeding script failed:", err);
    process.exit(1);
  }
};

run();
