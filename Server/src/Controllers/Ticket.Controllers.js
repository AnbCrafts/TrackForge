import Activity from "../Models/Activity.Models.js";
import Comment from "../Models/Comment.Models.js";
import Project from "../Models/Project.Models.js";
import Ticket from "../Models/Ticket.Models.js";
import User from "../Models/User.Models.js";
import validationUtils from "../Utility/Validation.Utility.js";
import { checkTicketValidity } from "../Utility/checkTicketValidity.utils.js";

// const checkTicketValidity = async (id, res) => {
//   if (!id) {
//     return res.status(400).json({
//       success: false,
//       message: "No ticket ID provided to check validity",
//     });
//   }

//   try {
//     const ticket = await Ticket.findById(id);
//     if (!ticket) {
//       return res.status(404).json({
//         success: false,
//         message: "Ticket not found",
//       });
//     }

//     const validFor = new Date(ticket.validFor);
//     const today = new Date();

//     // Strip time so only date is compared
//     today.setHours(0, 0, 0, 0);
//     validFor.setHours(0, 0, 0, 0);

//     if (today > validFor) {
//       return res.status(400).json({
//         success: false,
//         message: "This ticket has expired",
//       });
//     }

//     // If valid, return the ticket
//     return { success: true, ticket };
//   } catch (error) {
//     console.error("Error checking ticket validity:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Server error while checking ticket validity",
//     });
//   }
// };

const createTicket = async(req,res)=>{
    try {

        const { error } = validationUtils.ticketValidationSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res.status(400).json({
        success: false,
        errors: error.details.map((err) => err.message),
      });
    }

      const {title,description,assignedTo,assignedOn,validFor,status,priority,projectId,createdBy,stepsToReproduce,comments,activityLog} = req.body;

  const existingTicket = await Ticket.findOne({
  title,
  description,
  projectId,
  createdBy
});

if(existingTicket){

    const giver = await User.findById(existingTicket.createdBy).select("_id username");

    const doer = await User.findById(existingTicket.assignedTo).select("_id username");

    const project = await Project.findById(existingTicket.projectId).select("_id name");

    return res.status(201).json({
      success: true,
      message: `This ticket was already created by ${giver?.username} and assigned to ${doer?.username} for the project - ${project.name}`,
      existingTicket,
      attachment:{
        giver,doer,project
      }

    });

    
}



  

    const attachments = req.files?.map(file => file.path) || [];

    const ticket = new Ticket({
      title,
      description,
      createdBy,
      attachments,
      assignedTo,assignedOn,validFor,status,priority,projectId,stepsToReproduce,comments,activityLog 
    });

    await ticket.save();

    return res.status(201).json({
      success: true,
      message: "✅ Ticket created",
      ticket,
    });

        
    } catch (error) {
        return res.status(500).json({
      success: false,
      message: "❌ Failed to create ticket",
      error: error.message,
    });
    }
}
const getAllTickets = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const priorityOrder = {
      Critical: 4,
      High: 3,
      Medium: 2,
      Low: 1
    };

    const totalTickets = await Ticket.countDocuments();

    const tickets = await Ticket.aggregate([
      {
        $addFields: {
          priorityRank: {
            $switch: {
              branches: [
                { case: { $eq: ["$priority", "Critical"] }, then: 4 },
                { case: { $eq: ["$priority", "High"] }, then: 3 },
                { case: { $eq: ["$priority", "Medium"] }, then: 2 },
                { case: { $eq: ["$priority", "Low"] }, then: 1 },
              ],
              default: 0
            }
          }
        }
      },
      { $sort: { priorityRank: -1 } },
      { $skip: skip },
      { $limit: limit },
      { $project: { priorityRank: 0 } } // Remove rank from final output
    ]);

    if (!tickets || tickets.length === 0) {
      return res.json({
        success: false,
        message: "No tickets found for this page",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Tickets fetched successfully",
      currentPage: page,
      totalPages: Math.ceil(totalTickets / limit),
      totalTickets,
      tickets,
    });

  } catch (error) {
    console.error("Ticket list fetching error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
const getTicketById = async(req,res)=>{
    try {
    const { error } = validationUtils.ticketIdValidationSchema.validate(req.params);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { ticketId } = req.params;
    const isValidTicket = await Ticket.findById(ticketId);
    if (!isValidTicket) {
      return res.json({ success: false, message: "Invalid id, no ticket found with this id" });
    }
    
    const giver = await User.findById(isValidTicket.createdBy).select("_id username");

    const doer = await User.findById(isValidTicket.assignedTo).select("_id username");

    const project = await Project.findById(isValidTicket.projectId).select("_id name");


   const mergedData = {
  ...isValidTicket.toObject(),
  giver,
  doer,
  project
};


  
 
    return res.status(201).json({
      success: true,
      message: "Ticket found successfully",
      ticket:mergedData,
      
      
    });
      
    } catch (error) {
      console.error("Ticket info fetching Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}
const deleteTicket = async (req, res) => {
  try {
    const { error } = validationUtils.ticketIdValidationSchema.validate(req.params);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { ticketId } = req.params;

    const ticketToDelete = await Ticket.findById(ticketId);
    if (!ticketToDelete) {
      return res.status(404).json({
        success: false,
        message: "Invalid id, no ticket found with this id, deletion failed",
      });
    }

    const activities = await Activity.find({ ticketId });

    if (activities?.length) {
      const activityIds = activities.map(a => a._id);

      await Project.updateMany(
        { activityLog: { $in: activityIds } },
        { $pull: { activityLog: { $in: activityIds } } }
      );

      await User.updateMany(
        { activity: { $in: activityIds } },
        { $pull: { activity: { $in: activityIds } } }
      );

      await Activity.deleteMany({ _id: { $in: activityIds } });
    }

    await Ticket.findByIdAndDelete(ticketId);

    return res.status(200).json({
      success: true,
      message: "Ticket deleted successfully",
    });

  } catch (error) {
    console.error("Ticket deletion Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const patchTicketToAUser = async(req,res)=>{

         try {
    const { error } = validationUtils.ticketUserIdValidationSchema.validate(req.params);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { ticketId,userId } = req.params;
    const isValidTicket = await Ticket.findById(ticketId);
    if (!isValidTicket) {
      return res.json({ success: false, message: "Invalid id, no ticket found with this id" });
    }

       const validity = await checkTicketValidity(ticketId);

if (!validity.success) {
  return res.status(400).json({ success: false, message: validity.message });
}

    
    
    if(isValidTicket.assignedTo && isValidTicket.assignedTo.toString() === userId.toString()){

        const doer = await User.findById(isValidTicket.assignedTo).select("_id username");
        const giver = await User.findById(isValidTicket.createdBy).select("_id username")

    const project = await Project.findById(isValidTicket.projectId).select("_id name");

    return res.status(201).json({
      success: true,
      message: `This ticket was already created by ${giver?.username} and assigned to ${doer?.username} for the project - ${project.name}`,
      isValidTicket,
      attachment:{
        giver,doer,project
      }

    });

    
}




const done = isValidTicket.assignedTo = userId;

if(!done){
    return res.status(401).json({
      success: false,
      message:"Failed to assign user to this ticket"
    });
}

await isValidTicket.save();
return res.status(201).json({
      success: true,
      message:" Assigned user to this ticket"
    });
    

        
    } catch (error) {
        return res.status(500).json({
      success: false,
      message:" Internal Server Error"
    });
    }
}
const patchTicketStatus = async(req,res)=>{
       try {
    const { error } = validationUtils.ticketStatusValidationSchema.validate(req.params);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { ticketId,status } = req.params;
    const isValidTicket = await Ticket.findById(ticketId);
    if (!isValidTicket) {
      return res.json({ success: false, message: "Invalid id, no ticket found with this id" });
    }
 
   const done = isValidTicket.status = status.toString();
   if (status.toString() === "Open") {
  isValidTicket.validFor = new Date(
    isValidTicket.validFor.getTime() + 7 * 24 * 60 * 60 * 1000 // 7 days in ms
  );
  await isValidTicket.save();
}
   
   if(!done){
    return res.status(401).json({
      success: false,
      message:"Failed to update status of the ticket"
    });
}
await isValidTicket.save();

    return res.status(201).json({
      success: true,
      message:`Status updated to - ${status} successfully`

    });
   
}





    

        
     catch (error) {
        return res.status(500).json({
      success: false,
      message:" Internal Server Error"
    });
    }
}
const patchActivityLog = async(req,res)=>{
       try {
    const { error } = validationUtils.ticketActivityLogValidationSchema.validate(req.params);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { ticketId,activityLog } = req.params;
    const isValidTicket = await Ticket.findById(ticketId);
    if (!isValidTicket) {
      return res.json({ success: false, message: "Invalid id, no ticket found with this id" });
    }

       const validity = await checkTicketValidity(ticketId);

if (!validity.success) {
  return res.status(400).json({ success: false, message: validity.message });
}

    const activitiesFromParams =[activityLog];
    const activities = [];

    if(activitiesFromParams && activitiesFromParams.length>0){
       await Promise.all(
            activitiesFromParams.map(async(a)=>{
                const activity = await Activity.findById(a);

                if(activity && !isValidTicket.activityLog.includes(a)){
                    activities.push(a);
                }
            })
        )

    }

    if(activities.length>0){
        isValidTicket.activityLog = activities;
        return res.status(201).json({
          success: true,
          message:`Activity Log added to ticket`
    
        });
    }else{
        return res.status(401).json({
          success: false,
          message:`Cannot get valid IDs to push`
    
        });
    }


   
}





    

        
     catch (error) {
        return res.status(500).json({
      success: false,
      message:" Internal Server Error"
    });
    }
}
const searchTicket = async(req,res)=>{
    try {
        const searchTerm = req.query.q;
        if (!searchTerm || searchTerm.trim() === "") {
          return res.status(400).json({
            success: false,
            message: "❌ Search term is missing or empty",
          });
        }
    
        const tickets = await Ticket.find({
          name: { $regex: searchTerm, $options: "i" },
          description: { $regex: searchTerm, $options: "i" },
        }).select("name _id");
    
        return res.status(200).json({
          success: true,
          message: "✅ Ticket fetched successfully",
          tickets,
        });
      } catch (error) {
        console.error("❌ Search error:", error);
        return res.status(500).json({
          success: false,
          message: "❌ Internal Server Error",
          error: error.message,
        });
      }
}
const getFilteredTickets = async(req,res)=>{
     try {
    const { name, projectId,assignedTo,assignedOn,validFor,status,priority,createdBy } = req.query;

    const filters = {};

    if (createdBy) {
      filters.createdBy = createdBy;
    }

    if (name) {
      filters.name = { $regex: name, $options: "i" };
    }

    if (projectId) {
      filters.projectId = projectId;
    }

    if(assignedTo){
        filters.assignedTo = assignedTo
    }
    if(assignedOn){
        filters.assignedOn = assignedOn
    }
    if(validFor){
        filters.validFor = validFor
    }
    if(status){
        filters.status = status
    }
    if(priority){
        filters.priority = priority
    }

    const tickets = await Ticket.find(filters)
      

    return res.status(200).json({
      success: true,
      message: "✅ Filtered tickets retrieved successfully",
      tickets,
    });
  } catch (error) {
    console.error("❌ Filtering error:", error);
    return res.status(500).json({
      success: false,
      message: "❌ Failed to retrieve filtered tickets",
      error: error.message,
    });
  }
}
const getTicketsCreatedBy = async (req, res) => {
  try {
    const { error } = validationUtils.creatorIdValidationSchema.validate(req.params);
    if (error) {
      return res.status(400).json({ success: false, message: error.message });
    }

    const { createdBy } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const skip = (page - 1) * limit;

    const tickets = await Ticket.find({ createdBy })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "🎯 Tickets fetched successfully",
      page,
      count: tickets.length,
      tickets,
    });
  } catch (err) {
    console.error("Error fetching created tickets:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
const getTicketsAssignedTo = async (req, res) => {
  try {
    const { error } = validationUtils.assignedToIdValidationSchema.validate(req.params);
    if (error) {
      return res.status(400).json({ success: false, message: error.message });
    }

    const { assignedTo } = req.params;
    const page = parseInt(req.query.page) || 1;

    const limit = req.query.limit === "all" ? 0 : parseInt(req.query.limit) || 5;
                              

    const skip = (page - 1) * limit;

    const tickets = await Ticket.find({ assignedTo })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "📌 Assigned tickets fetched",
      page,
      count: tickets.length,
      tickets,
    });
  } catch (err) {
    console.error("Error fetching assigned tickets:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
const getTicketsExpiringSoon = async (req, res) => {
  try {
    const now = new Date();
    const inTwoDays = new Date();
    inTwoDays.setDate(now.getDate() + 2);

    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const skip = (page - 1) * limit;

    const [tickets, total] = await Promise.all([
      Ticket.find({
        validFor: { $lte: inTwoDays, $gte: now },
      })
        .sort({ validFor: 1 })
        .skip(skip)
        .limit(limit),

      Ticket.countDocuments({
        validFor: { $lte: inTwoDays, $gte: now },
      }),
    ]);

    res.status(200).json({
      success: true,
      message: "⏰ Tickets expiring soon",
      page,
      totalPages: Math.ceil(total / limit),
      total,
      tickets,
    });
  } catch (err) {
    console.error("Error fetching expiring tickets:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const getCommentsOfTicket = async (req, res) => {
  try {
    const { ticketId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(ticketId)) {
      return res.status(400).json({ success: false, message: "❌ Invalid ticketId" });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const skip = (page - 1) * limit;

    const [comments, total] = await Promise.all([
      Comment.find({ ticketId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),

      Comment.countDocuments({ ticketId }),
    ]);

    res.status(200).json({
      success: true,
      message: "🗨️ Fetched comments for ticket",
      page,
      totalPages: Math.ceil(total / limit),
      total,
      comments,
    });
  } catch (err) {
    console.error("Error fetching comments:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const getTicketByUserId = async (req, res) => {
  try {
    const { error } = validationUtils.userIdValidationSchema.validate(req.params);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { userId } = req.params;
    const page = parseInt(req.query.page) || 1; // Default page = 1
    const limit = 1; // Always 1 ticket per page

    const isValidUser = await User.findById(userId);
    if (!isValidUser) {
      return res.json({ success: false, message: "Invalid id, no user found with this id" });
    }

    const totalTickets = await Ticket.countDocuments({ assignedTo: userId });

    const tickets = await Ticket.find({ assignedTo: userId })
      .populate("createdBy", "_id username")
      .populate("assignedTo", "_id username")
      .populate("projectId", "_id name")
      .populate({
    path: "activityLog",
    populate: [
      { path: "performedBy", select: "_id username" },
      { path: "performedOn", select: "_id name" },
      { path: "ticketId" }
    ]
  })
      .skip((page - 1) * limit)
      .limit(limit);


    if (!tickets.length) {
      return res.json({ success: false, message: "No tickets found for this page/user" });
    }

    const ticketData = tickets.map(ticket => ({
      raw: ticket,
      giver: ticket.createdBy,
      doer: ticket.assignedTo,
      project: ticket.projectId
    }));

    return res.status(200).json({
      success: true,
      message: "Tickets found successfully",
      page,
      totalPages: Math.ceil(totalTickets / limit),
      totalTickets,
      tickets: ticketData
    });

  } catch (error) {
    console.error("Ticket info fetching Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


const getTicketAssignedByUser = async (req, res) => {
  try {
    const { error } = validationUtils.userIdValidationSchema.validate(req.params);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { userId } = req.params;
    const page = parseInt(req.query.page) || 1; // Default page = 1
    const limit = 1; // Always 1 ticket per page

    const isValidUser = await User.findById(userId);
    if (!isValidUser) {
      return res.json({ success: false, message: "Invalid id, no user found with this id" });
    }

    const totalTickets = await Ticket.countDocuments({ createdBy: userId });

    const tickets = await Ticket.find({ createdBy: userId })
      .populate("createdBy", "_id username")
      .populate("assignedTo", "_id username")
      .populate("projectId", "_id name")
      .populate({
    path: "activityLog",
    populate: [
      { path: "performedBy", select: "_id username" },
      { path: "performedOn", select: "_id name" },
      { path: "ticketId" }
    ]
  })
      .skip((page - 1) * limit)
      .limit(limit);


    if (!tickets.length) {
      return res.json({ success: false, message: "No tickets found for this page/user" });
    }

    const ticketData = tickets.map(ticket => ({
      raw: ticket,
      giver: ticket.createdBy,
      doer: ticket.assignedTo,
      project: ticket.projectId
    }));

    return res.status(200).json({
      success: true,
      message: "Tickets found successfully",
      page,
      totalPages: Math.ceil(totalTickets / limit),
      totalTickets,
      tickets: ticketData
    });

  } catch (error) {
    console.error("Ticket info fetching Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const getTicketByProjectId = async (req, res) => {
  try {
    // ✅ Validate projectId param
    const { error } = validationUtils.projectIdValidationSchema.validate(req.params);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { projectId } = req.params;

    // ✅ Pagination setup
    const page = parseInt(req.query.page) || 1;   // default page 1
    const limit =parseInt(req.query.limit) || 5;                              // fixed limit
    const skip = (page - 1) * limit;

    // ✅ Fetch total tickets count for pagination
    const totalTickets = await Ticket.countDocuments({ projectId });

    if (totalTickets === 0) {
      return res.json({
        success: false,
        message: "No tickets found for this project",
        tickets: [],
        pagination: {
          totalTickets,
          totalPages: 0,
          currentPage: page,
        },
      });
    }

    // ✅ Fetch paginated tickets
    const ticketsData = await Ticket.find({ projectId })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }); // latest first (optional)

    // ✅ Enrich with user info
    const tickets = await Promise.all(
      ticketsData.map(async (p) => {
        const giver = await User.findById(p.createdBy).select("_id username");
        const doer = p.assignedTo
          ? await User.findById(p.assignedTo).select("_id username")
          : null;

        return {
          ...p.toObject(),
          giver,
          doer,
        };
      })
    );

    // ✅ Response with pagination info
    return res.status(200).json({
      success: true,
      message: "Tickets fetched successfully",
       
      tickets: {
        tickets,
        totalTickets,
        totalPages: Math.ceil(totalTickets / limit),
        currentPage: page,
        limit,
      },
    });

  } catch (error) {
    console.error("Ticket info fetching Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const getAllTicketsAssignedToUser = async(req,res)=>{
  try {
    const { error } = validationUtils.assignedToIdValidationSchema.validate(req.params);
    if (error) {
      return res.status(400).json({ success: false, message: error.message });
    }

    const { assignedTo } = req.params;
                   
    const tickets = await Ticket.find({ assignedTo })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "📌 Assigned tickets fetched",
      count: tickets.length,
      tickets,
    });
  } catch (err) {
    console.error("Error fetching assigned tickets:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

const getAllTicketsAssignedBy = async (req, res) => {
  try {
    const { error } = validationUtils.assignedByIdValidationSchema.validate(req.params);
    if (error) {
      return res.status(400).json({ success: false, message: error.message });
    }

    const { assignedBy } = req.params;
    const page = parseInt(req.query.page) || 1;

    const limit = req.query.limit === "all" ? 0 : parseInt(req.query.limit) || 5;
                              

    const skip = (page - 1) * limit;

    const tickets = await Ticket.find({ createdBy:assignedBy })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    
  const totalLength = await Ticket.countDocuments({ createdBy: assignedBy });


    res.status(200).json({
      success: true,
      message: "📌 Assigned tickets fetched",
      page,
      count: tickets.length,
      tickets,
      totalLength
    });
  } catch (err) {
    console.error("Error fetching assigned tickets:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};







export {getAllTicketsAssignedBy,getTicketByProjectId,createTicket,getAllTickets,getTicketById,deleteTicket,patchTicketToAUser,patchTicketStatus,patchActivityLog,searchTicket,getFilteredTickets,getTicketsAssignedTo,getTicketsCreatedBy,getTicketsExpiringSoon,getCommentsOfTicket,getTicketByUserId,getTicketAssignedByUser}