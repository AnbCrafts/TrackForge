import User from "../Models/User.Models.js";
import fs from 'fs';
import bcrypt from 'bcryptjs';
import { createHash } from 'crypto'; 
import validationUtils from "../Utility/Validation.Utility.js";
import { uploadOnCloudinary } from "../Utility/CloudConfig.Utility.js";
import {generateToken} from "../Utility/Token.Utility.js";
import { getHashSecret } from "../Utility/SecureHash.Utility.js";
import Activity from "../Models/Activity.Models.js";
import Project from "../Models/Project.Models.js";
import Ticket from "../Models/Ticket.Models.js";
import Team from "../Models/Team.Models.js";
 



const registerUser = async (req, res) => {
  try {
    

    const { error } = validationUtils.userValidationSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { username, email, password, firstName, lastName, role } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    let secure_url = ""; 

    if (req.file) {
      const filePath = req.file.path;
      const uploadedPicture = await uploadOnCloudinary(filePath);

      if (!uploadedPicture) {
        return res.status(500).json({ success: false, message: "File can't be uploaded to cloud" });
      }

      secure_url = uploadedPicture.secure_url;
      // fs.unlinkSync(filePath);
    }

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role,
      picture: secure_url  
    });

    const token = generateToken(newUser._id);

    const loginTime = Date.now();
    const secret = getHashSecret(loginTime.toString().slice(-4));
    const payload = newUser._id.toString() + loginTime + secret;
    const secureHash = createHash('sha256').update(payload).digest('hex');

    await newUser.save();

    const user = {
     id: newUser._id,
     name:newUser.firstName+" " + newUser.lastName,
      username:newUser.username,
      email:newUser.email,
      role:newUser.role,
      picture:newUser.picture || ""
    }

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: user,
      token,
      secureHash,
      loginTime
    }); 

  } catch (error) {
    console.error("Register Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}
const loginUser = async (req, res) => {
  try {
    const { error } = validationUtils.loginValidationSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { username, password } = req.body;
    const isValidUser = await User.findOne({ username });


    if (!isValidUser) {
      return res.json({ success: false, message: "Invalid username, no user found with this username" });
    }

    const isValidPass = await bcrypt.compare(password, isValidUser.password);
    if (!isValidPass) {
      return res.status(500).json({ success: false, message: "Wrong password" });
    }

    const token = generateToken(isValidUser._id);
    const loginTime = Date.now();
    const secret = getHashSecret(loginTime.toString().slice(-4));
    const payload = isValidUser._id.toString() + loginTime + secret;
    const secureHash = createHash('sha256').update(payload).digest('hex');

    const user = isValidUser.toObject();
    delete user.password;

    return res.status(201).json({
      success: true,
      message: "User logged in successfully",
      user,
      token,
      secureHash,
      loginTime
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}
const getUserDataById = async(req,res)=>{
    try {
    const { error } = validationUtils.userIdValidationSchema.validate(req.params);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { userId } = req.params;
    const isValidUser = await User.findById(userId);
    if (!isValidUser) {
      return res.json({ success: false, message: "Invalid id, no user found with this id" });
    }

    const user = isValidUser.toObject();
    delete user.password;

    return res.status(201).json({
      success: true,
      message: "User found successfully",
      user,
      
    });
      
    } catch (error) {
      console.error("User info fetching Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}
const DeleteUserProfile = async(req,res)=>{
    try {
    const { error } = validationUtils.userIdValidationSchema.validate(req.params);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { userId } = req.params;
    const isValidUser = await User.findById(userId);
    if (!isValidUser) {
      return res.json({ success: false, message: "no user found with this id" });
    }

    const deletedUser = await User.findByIdAndDelete(userId);

    if(!deletedUser){
       return res.status(201).json({
      success: false,
      message: "User deletion failed",
      
      
    });
    }

    return res.status(201).json({
      success: true,
      message: "User deleted successfully",
      
      
    });
      
    } catch (error) {
      console.error("User info fetching Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}
const PatchUserProfile = async (req, res) => {
  try {
    const { error } = validationUtils.userIdStatusValidationSchema.validate(req.params);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { userId, status } = req.params;
    const isValidUser = await User.findById(userId);
    if (!isValidUser) {
      return res.json({ success: false, message: "no user found with this id" });
    }

    if (!status) {
      return res.json({ success: false, message: "Patching needs a status value e.g online/offline/block" });
    }

    const statusValue = status.toLowerCase();
    const validStatuses = {
      online: "Online",
      offline: "Offline",
      block: "Blocked"
    };

    if (!validStatuses[statusValue]) {
      return res.json({ success: false, message: "Invalid status value" });
    }

    await User.findByIdAndUpdate(
      userId,
      { status: validStatuses[statusValue] },
      { new: true, runValidators: true }
    );

    return res.status(201).json({
      success: true,
      message: "User Status updated successfully"
    });
  } catch (error) {
    console.error("User info fetching Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}
const ListAllUserProfiles = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const totalUsers = await User.countDocuments();
    const users = await User.find({})
      .skip(skip)
      .limit(limit);

    if (!users || users.length === 0) {
      return res.json({
        success: false,
        message: "No users found for this page",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      currentPage: page,
      totalPages: Math.ceil(totalUsers / limit),
      totalUsers,
      users,
    });

  } catch (error) {
    console.error("User list fetching Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}
const getPatchedUsers = async (req, res) => {
  const { status } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const skip = (page - 1) * limit;

  const statusValue = status.toLowerCase();
  const statusMap = {
    online: "Online",
    offline: "Offline",
    block: "Blocked"
  };

  const mappedStatus = statusMap[statusValue];

  if (!mappedStatus) {
    return res.status(400).json({ success: false, message: "Invalid status value" });
  }

  try {
    const totalUsers = await User.countDocuments({ status: mappedStatus });
    const users = await User.find({ status: mappedStatus })
      .skip(skip)
      .limit(limit);

    if (!users || users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No users found for this page",
      });
    }

    return res.status(200).json({
      success: true,
      message: `Users with status '${mappedStatus}' - Page ${page}`,
      currentPage: page,
      totalPages: Math.ceil(totalUsers / limit),
      totalUsers,
      users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}
const getUsersTeam = async (req, res) => {
  try {
    const { error } = validationUtils.userIdValidationSchema.validate(req.params);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { userId } = req.params;
    const isValidUser = await User.findById(userId);
    if (!isValidUser) {
      return res.json({ success: false, message: "Invalid id, no user found with this id" });
    }

    const teams = [];

    if (isValidUser.teams && isValidUser.teams.length > 0) {
      await Promise.all(
        isValidUser.teams.map(async (t) => {
          const team = await Team.findById(t);

          let members = [];
          if (team.members && team.members.length > 0) {
            members = await Promise.all(
              team.members.map(async (m) => {
                const member = await User.findById(m.participant).select("_id username role");
                return {
                  ...member.toObject(),
                  joinedAt: m.joinedAt, // Attach joinedAt manually
                };
              })
            );
          }

          teams.push({ team, members });
        })
      );
    }

    if (teams.length === 0) {
      return res.json({
        success: false,
        message: "No teams found for this user",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Teams found successfully",
      teams,
    });

  } catch (error) {
    console.error("User info fetching Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}
const getUsersByRole = async(req,res)=>{
      const { role } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const skip = (page - 1) * limit;

  const roleValue = role.toLowerCase();
  const roleMap = {
   owner:"Owner", 
   admin:"Admin", 
   tester:"Tester", 
   developer:"Developer", 
   debugger:"Debugger"
  };

  const mappedRole = roleMap[roleValue];

  if (!mappedRole) {
    return res.status(400).json({ success: false, message: "Invalid role value" });
  }

   try {
    const total = await User.countDocuments({ role: roleMap[roleValue] });
    const users = await User.find({ role: roleMap[roleValue] }).skip(skip).limit(limit);

    return res.status(200).json({
      success: true,
      message: `Users with role ${roleMap[roleValue]} fetched successfully`,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalUsers: total,
      users,
    });

  } catch (error) {
    console.error("User list fetching Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }


}
const getLastActiveTime = async(req,res)=>{
       try {
    const { error } = validationUtils.userIdValidationSchema.validate(req.params);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { userId } = req.params;
    const isValidUser = await User.findById(userId).select("_id lastActiveOn");
    if (!isValidUser) {
      return res.json({ success: false, message: "Invalid id, no user found with this id" });
    }

    const user = isValidUser.toObject();
    

    return res.status(201).json({
      success: true,
      message: "User found successfully",
      user,
      
    });
      
    } catch (error) {
      console.error("User info fetching Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}
const updateUserProfile = async(req,res)=>{
    try {
      const { error } = validationUtils.userIdValidationSchema.validate(req.params);
    if (error) return res.status(400).json({ error: error.details[0].message });
    const {userId} = req.params;

    const updates = req.body;
    const{bodyError} = validationUtils.updateUserValidation.validate(req.body);
    if(bodyError){
      return res.status(400).json({ error: bodyError.details[0].message });
    }
    if (!userId) {
      return res.status(400).json({ success: false, message: "ID is required" });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "user not found" });
    }
   let updatedUser = null;

updatedUser = await User.findByIdAndUpdate(userId, updates, {
  new: true,
  runValidators: true,
});

const { password } = req.body;
if (password) {
  const hashedPassword = await bcrypt.hash(password, 10);
  updatedUser.password = hashedPassword; // Directly mutate the object property
}

await updatedUser.save();

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "Seeker not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    }); 

    
    
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
}
const getUserActivities = async (req, res) => {
  try {
    const { error } = validationUtils.userIdValidationSchema.validate(req.params);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { userId } = req.params;
    const userDoc = await User.findById(userId).select("_id activity");

    if (!userDoc) {
      return res.status(404).json({ success: false, message: "Invalid id, no user found with this id" });
    }

    if (!userDoc.activity || userDoc.activity.length === 0) {
      return res.status(200).json({
        success: false,
        message: "This User has no activities",
        activities: []
      });
    }

    const activities = await Promise.all(
      userDoc.activity.map(async (activityId) => {
        const activity = await Activity.findById(activityId);
        if (!activity) return null; // Skip if not found

        const [user, project, ticket] = await Promise.all([
          User.findById(activity.performedBy).select("_id username email"),
          Project.findById(activity.performedOn).select("_id name startedOn deadline"),
          Ticket.findById(activity.ticketId).select("_id title validFor status priority")
        ]);

        return { user, project, ticket, activity };
      })
    );

    const filteredActivities = activities.filter(Boolean); // Remove nulls if any activity not found

    return res.status(200).json({
      success: true,
      message: "User activities fetched successfully",
      activities: filteredActivities
    });

  } catch (error) {
    console.error("User info fetching Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}
const SearchUserProfile = async(req,res)=>{
     try {
    const searchTerm = req.query.q;
    if (!searchTerm) {
      return res.status(400).json({ success: false, message: "Search term missing" });
    }

    const users = await User.find({
      $or: [
        { firstName: { $regex: searchTerm, $options: 'i' } },
        { lastName: { $regex: searchTerm, $options: 'i' } },
        { username: { $regex: searchTerm, $options: 'i' } },
        { email: { $regex: searchTerm, $options: 'i' } }
      ]
    });

    res.status(200).json({
      success: true,
      message: "Search successful",
      users
    });

  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}
const changeUserRole = async (req, res) => {
  try {
    const { error } = validationUtils.userIdRoleValidationSchema.validate(req.params);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { userId, role } = req.params;
    if (!role) return res.json({ success: false, message: "Provide role, role is required" });

    const user = await User.findById(userId);
    if (!user) return res.json({ success: false, message: "Invalid id, no user found with this id" });

    const currentRole = user.role;
    const roleValue = role.toLowerCase();

    const roleMap = {
      owner: "Owner",
      admin: "Admin",
      tester: "Tester",
      developer: "Developer",
      debugger: "Debugger"
    };

    const mappedRole = roleMap[roleValue];
    if (!mappedRole) return res.status(400).json({ success: false, message: "Invalid role value" });

    if (currentRole === "Owner" && mappedRole !== "Owner") {
      return res.json({ success: false, message: "Owner cannot be demoted to any other role" });
    }

    if (mappedRole === "Owner" && currentRole !== "Admin") {
      return res.json({ success: false, message: "Only Admin can be promoted to Owner" });
    }

    if (currentRole === mappedRole) {
      return res.json({ success: false, message: `This user is already a/an ${mappedRole}` });
    }

    await User.findByIdAndUpdate(userId, { role: mappedRole }, { new: true, runValidators: true });

    return res.status(201).json({
      success: true,
      message: "User Role changed successfully"
    });

  } catch (error) {
    console.error("User role change Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}
const getUserIDByUsername = async(req,res)=>{
      try {
        const {username} = req.params;
        if(!username){
          return res.json({success:false,message:"Username is required"});
        }

        const user = await User.findOne({username:username}).select("_id");
        if(user){
          return res.json({success:true,message:"User ID found",userId:user._id});

        }else{
          return res.json({success:false,message:"User ID not found"});

        }
        
      } catch (error) {
          return res.json({success:false,message:"Internal Server error"});
        
      }
}
const getUserByUsernameAndEmail = async(req,res)=>{
    try {
        const {username,email} = req.params;
        if(!username){
          return res.json({success:false,message:"Username is required"});
        }

        const user = await User.findOne({username:username,email:email});
        if(user){
          return res.json({success:true,message:"User  found",user});

        }else{
          return res.json({success:false,message:"User  not found"});

        }
        
      } catch (error) {
          return res.json({success:false,message:"Internal Server error"});
        
      }
}
const pushTeam = async(req,res)=>{
  try {
    
    const {userId,projectId} = req.params;

    if(!userId || !projectId){
    return res.json({success:false})

    }

    const user = await User.findById(userId);
    user.manages.push(projectId);

    await user.save();

    return res.json({success:true})

  } catch (error) {
    console.log(error);
    return res.json({success:false})
  }



}








export {registerUser,loginUser,getUserDataById,DeleteUserProfile,PatchUserProfile,ListAllUserProfiles,getUsersTeam,getPatchedUsers,getUsersByRole,getLastActiveTime,updateUserProfile,getUserActivities,SearchUserProfile,changeUserRole,getUserIDByUsername,getUserByUsernameAndEmail,pushTeam}