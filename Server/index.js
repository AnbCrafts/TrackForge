import express from 'express';
import cors from 'cors';
import connectDB from './src/DB/ConnectDB.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import UserRoutes from './src/Routes/User.Route.js';
import ProjectRoutes from './src/Routes/Project.Routes.js';
import TeamRoutes from './src/Routes/Team.Routes.js';
import TicketRoutes from './src/Routes/Ticket.Routes.js';
import ActivityRoutes from './src/Routes/Activity.Routes.js';
import CommentRoutes from './src/Routes/Comment.Routes.js';
import MessageRoutes from './src/Routes/Message.Routes.js';
import MeetingRoomRoutes from './src/Routes/MeetingRoom.Routes.js';

import AIMailRoute from './src/Routes/AIMailer.Routes.js';
import AIRoutes from './src/Routes/AI.Routes.js';
import BusinessDetailsRoutes from './src/Routes/BusinessDetails.Routes.js';

import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';

import session from "express-session";
import passport from "passport";

import dotenv from "dotenv"; 
import GithubOAuthRouter from './src/Routes/GithubAuth.Routes.js';
import GoogleOAuthRouter from './src/Routes/GoogleOAuth.Routes.js';
dotenv.config();


const app = express();

connectDB();

const server = createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: (origin, callback) => callback(null, true),
    methods: ["GET", "POST"],
    credentials: true
  }
});

io.on("connection", (socket) => {
  console.log("⚡ Real-time chat: User connected", socket.id);

  socket.on("join_room", (roomName) => {
    socket.join(roomName);
    console.log(`👤 User joined room: ${roomName}`);
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("❌ Real-time chat: User disconnected", socket.id);
  });
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: (origin, callback) => callback(null, true),
  credentials: true
}));

app.use('/public', express.static(path.join(__dirname, 'src/public')));

app.use(
  session({
    secret: process.env.HASH_SECRET,   // much safer
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use('/api/user', UserRoutes);
app.use('/api/project', ProjectRoutes);
app.use('/api/team', TeamRoutes);
app.use('/api/activity', ActivityRoutes);
app.use('/api/ticket', TicketRoutes);
app.use('/api/comment', CommentRoutes);

app.use('/api/authorize', GoogleOAuthRouter);
app.use('/api/authorize', GithubOAuthRouter);

app.use('/api/ai-mail', AIMailRoute);
app.use('/api/message', MessageRoutes);
app.use('/api/meeting', MeetingRoomRoutes);
app.use('/api/ai', AIRoutes);
app.use('/api/business-details', BusinessDetailsRoutes);

app.get('/', (req, res) => {
  res.send("Server Started Successfully, you are in the homepage...");
});

const port = process.env.PORT || 9000;
server.listen(port, () => {
  console.log(`🔥 Server running on http://localhost:${port}`);
});
