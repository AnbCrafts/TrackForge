import express from 'express';
import cors from 'cors';
import connectDB from './src/DB/ConnectDB.js';

import UserRoutes from './src/Routes/User.Route.js';
import ProjectRoutes from './src/Routes/Project.Routes.js';
import TeamRoutes from './src/Routes/Team.Routes.js';
import TicketRoutes from './src/Routes/Ticket.Routes.js';
import ActivityRoutes from './src/Routes/Activity.Routes.js';
import CommentRoutes from './src/Routes/Comment.Routes.js';

import AIMailRoute from './src/Routes/AIMailer.Routes.js';

import session from "express-session";
import passport from "passport";

import dotenv from "dotenv"; 
import GithubOAuthRouter from './src/Routes/GithubAuth.Routes.js';
import GoogleOAuthRouter from './src/Routes/GoogleOAuth.Routes.js';
dotenv.config();


const app = express();

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

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

// app.use('/api/ai-mail', AIMailRoute);

app.get('/', (req, res) => {
  res.send("Server Started Successfully, you are in the homepage...");
});

const port = process.env.PORT || 9000;
app.listen(port, () => {
  console.log(`🔥 Server running on http://localhost:${port}`);
});
