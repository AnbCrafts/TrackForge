import express from 'express';
import cors from 'cors'; 
import connectDB from './src/DB/ConnectDB.js';
import UserRoutes from './src/Routes/User.Route.js';
import Config from './src/Config/Config.js';
import projectRoutes from './src/Routes/Project.Routes.js';
import TeamRoutes from './src/Routes/Team.Routes.js';
import TicketRoutes from './src/Routes/Ticket.Routes.js';
import ActivityRoutes from './src/Routes/Activity.Routes.js';
import CommentRoutes from './src/Routes/Comment.Routes.js';
import Project from './src/Models/Project.Models.js';
import Team from './src/Models/Team.Models.js';

  
const app = express();
connectDB();

const port = Config.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors()); 
 
   
app.use('/api/user',UserRoutes);
app.use('/api/project',projectRoutes);
app.use('/api/team',TeamRoutes);
app.use('/api/activity',ActivityRoutes);
app.use('/api/ticket',TicketRoutes);
app.use('/api/comment',CommentRoutes);  
 
app.get('/', (req, res) => {
    res.send("Server Started Successfully, you are in the homepage...");
}); 

app.listen(port, () => {
    console.log(`✅ Server running on: http://localhost:${port}`);
});

const updateExistingProjects = async () => {
  try {
    const result = await Team.updateMany(
      { joinRequests: { $exists: false } }, // Filter: finds projects missing the field
      { $set: { joinRequests: [] } }         // Update: sets the field to an empty array
    );
    console.log('Migration complete!');
    console.log(`Documents matched: ${result.matchedCount}`);
    console.log(`Documents modified: ${result.modifiedCount}`);
  } catch (error) {
    console.error('Error during data migration:', error);
  }
};

// updateExistingProjects();

