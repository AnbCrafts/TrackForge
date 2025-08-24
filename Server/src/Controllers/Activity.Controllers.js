import Activity from "../Models/Activity.Models.js";
import Project from "../Models/Project.Models.js";
import Ticket from "../Models/Ticket.Models.js";
import User from "../Models/User.Models.js";
import validationUtils from "../Utility/Validation.Utility.js";
import { checkTicketValidity } from "../Utility/checkTicketValidity.utils.js";

const createActivity = async(req,res)=>{
    try {
         const { error } = validationUtils.activityValidationSchema.validate(req.body);
         if (error) return res.status(400).json({ error: error.details[0].message });

         const {ticketId,actionType,performedBy,performedOn,details,doneOn} = req.body;

         const validity = await checkTicketValidity(ticketId);

if (!validity.success) {
  return res.status(400).json({ success: false, message: validity.message });
}
         
        const newActivity = new Activity({
            ticketId,actionType,performedBy,performedOn,details,doneOn
        })

        if(!newActivity){
        return res.status(400).json({ success: false, message: "cannot create new Activity" });

        }


        const ticket = await Ticket.findById(ticketId);
        if(!ticket){
        return res.status(401).json({ success: false, message: "Ticket not found" });

        }
       await ticket.activityLog.push(newActivity._id);
        
        const user = await User.findById(performedBy);
        if(!user){
        return res.status(401).json({ success: false, message: "User not found" });

        }
       await user.activity.push(newActivity._id)
        const project = await Project.findById(performedOn);
         if(!project){
        return res.status(401).json({ success: false, message: "Project not found" });

        }
       await project.activity.push(newActivity._id)



      await newActivity.save();
      await user.save();
      await project.save();
      await ticket.save();


    return res.status(201).json({ success: true, message: "Activity Created Successfully",activity:newActivity });
       
    } catch (error) {
        console.error("Activity Creation Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}
const getAllActivities = async(req,res)=>{
     try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const totalActivities = await Activity.countDocuments();
    const activities = await Activity.find({})
      .skip(skip)
      .limit(limit);

    if (!activities || activities.length === 0) {
      return res.json({
        success: false,
        message: "No activities found for this page",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Activity fetched successfully",
      currentPage: page,
      totalPages: Math.ceil(totalActivities / limit),
      totalActivities,
      activities,
    });

  } catch (error) {
    console.error("Activity list fetching Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}
const getActivityById = async(req,res)=>{ 
     try {
    const { error } = validationUtils.activityIdValidationSchema.validate(req.params);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { activity } = req.params;
    const isValidActivity = await Activity.findById(activity);
    if (!isValidActivity) {
      return res.json({ success: false, message: "Invalid id, no activity found with this id" });
    }

   

    return res.status(201).json({
      success: true,
      message: "User found successfully",
      activity:isValidActivity,
      
    });
      
    } catch (error) {
      console.error("Activity info fetching Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}
const getActivityByTicket = async(req,res)=>{ 
       try {
    const { error } = validationUtils.activityTicketIdValidationSchema.validate(req.params);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { ticketId } = req.params;
    const isValidActivity = await Activity.find({ticketId:ticketId});
    if (!isValidActivity) {
      return res.json({ success: false, message: "Invalid id, no activity found with this id" });
    }

   

    return res.status(201).json({
      success: true,
      message: "Activity found successfully",
      activities:isValidActivity,
      
    });
      
    } catch (error) {
      console.error("Activity info fetching Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
} 
const getActivityByUser = async(req,res)=>{
     try {
    const { error } = validationUtils.activityUserIdValidationSchema.validate(req.params);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { user } = req.params;
    const isValidActivity = await Activity.findOne({performedBy:user});
    if (!isValidActivity) {
      return res.json({ success: false, message: "Invalid id, no activity found with this id" });
    }

   

    return res.status(201).json({
      success: true,
      message: "Activity found successfully",
      activity:isValidActivity,
      
    });
      
    } catch (error) {
      console.error("Activity info fetching Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
    }   
}
const getActivityByProject = async(req,res)=>{ 
    try {
    const { error } = validationUtils.activityUserIdValidationSchema.validate(req.params);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { project } = req.params;
    const isValidActivity = await Activity.findOne({performedOn:project});
    if (!isValidActivity) {
      return res.json({ success: false, message: "Invalid id, no activity found with this id" });
    }

   

    return res.status(201).json({
      success: true,
      message: "Activity found successfully",
      activity:isValidActivity,
      
    });
      
    } catch (error) {
      console.error("Activity info fetching Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
    } 
}
const updateActivity = async(req,res)=>{ 
    try {
    const { error } = validationUtils.activityIdValidationSchema.validate(req.params);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { activity } = req.params;
    const {updates} = req.body;
    const isValidActivity = await Activity.findById(activity);
    if (!isValidActivity) {
      return res.json({ success: false, message: "Invalid id, no activity found with this id" });
    }

    const updatedActivity= await Activity.findByIdAndUpdate(activity, updates, {
      new: true,
      runValidators: true,
    });
     if (!updatedActivity) {
      return res.json({ success: false, message: "Update failed for activity" });
    }


    return res.status(201).json({
      success: true,
      message: "Activity Updated successfully",
      activity:updatedActivity,
      
    });
      
    } catch (error) {
      console.error("Activity info fetching Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}
const deleteActivity = async (req, res) => {
  try {
    const { error } = validationUtils.activityDeletionValidationSchema.validate(req.params);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { activity, ticketId } = req.params;

    const activityToDelete = await Activity.findById(activity);
    if (!activityToDelete) {
      return res.status(404).json({
        success: false,
        message: "Invalid id, no activity found with this id, deletion failed",
      });
    }

    if (ticketId) {
      const ticket = await Ticket.findById(ticketId);
      if (ticket && ticket.activityLog?.length) {
        ticket.activityLog.pull(activity);
        await ticket.save();
      }
    }

    await Project.updateMany(
      { activityLog: activity },
      { $pull: { activityLog: activity } }
    );

    await User.updateMany(
      { activity: activity },
      { $pull: { activity: activity } }
    );

    await Activity.findByIdAndDelete(activity);

    return res.status(200).json({
      success: true,
      message: "Activity deleted successfully",
    });

  } catch (error) {
    console.error("Activity deletion Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const searchActivity = async(req,res)=>{ 
    try {
        const searchTerm = req.query.q;
        if (!searchTerm) {
          return res.status(400).json({ success: false, message: "Search term missing" });
        }
    
        const activities = await Activity.find({
          $or: [
            { details: { $regex: searchTerm, $options: 'i' } },
            { actionType: { $regex: searchTerm, $options: 'i' } },
           
          ]
        });
    
        res.status(200).json({
          success: true,
          message: "Search successful",
          activities
        });
    
      } catch (error) {
        console.error("Search error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
      } 
}
const getFilteredActivities = async (req, res) => {
  try {
    const { userId, projectId, ticketId, from, to } = req.query;

    const filter = {};

    if (userId) {
      filter.performedBy = userId;
    }

    if (projectId) {
      filter.performedOn = projectId;
    }

    if (ticketId) {
      filter.ticketId = ticketId;
    }

    if (from || to) {
      filter.doneOn = {};
      if (from) filter.doneOn.$gte = new Date(from);
      if (to) filter.doneOn.$lte = new Date(to);
    }

    const activities = await Activity.find(filter)
      .populate("performedBy", "_id username email")
      .populate("performedOn", "_id name")
      .populate("ticketId", "_id title status")
      .sort({ doneOn: -1 }); // latest first

    return res.status(200).json({
      success: true,
      activities,
    });

  } catch (error) {
    console.error("Error fetching activities:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};



export {createActivity,getAllActivities,getActivityById,getActivityByTicket,getActivityByUser,getActivityByProject,updateActivity,deleteActivity,searchActivity,getFilteredActivities}