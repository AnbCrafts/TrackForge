import Comment from "../Models/Comment.Models.js";
import Project from "../Models/Project.Models.js";
import Ticket from "../Models/Ticket.Models.js";
import User from "../Models/User.Models.js";
import { checkTicketValidity } from "../Utility/checkTicketValidity.utils.js";
import validationUtils from "../Utility/Validation.Utility.js";


const postComment = async (req, res) => {
  try {
    const { error } = validationUtils.commentValidationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        errors: error.details.map(err => err.message),
      });
    }

    let { message, userId, projectId, ticket, type } = req.body;

    const validity = await checkTicketValidity(ticket);

if (!validity.success) {
  return res.status(400).json({ success: false, message: validity.message });
}
    
    // Create comment with proper schema field mapping
    const newComment = new Comment({
      message,
      userId,
      projectId,
      ticket: ticket, // Schema field is 'ticket'
      type
    });

    // Validate references
    const [user, project, tick] = await Promise.all([
      User.findById(userId).select("_id username"),
      Project.findById(projectId).select("_id name"),
      Ticket.findById(ticket).select("_id title comments")
    ]);

    if (!user || !project || !tick) {
      return res.status(400).json({
        success: false,
        message: "Invalid userId, projectId, or ticketId"
      });
    }

    // Save comment first
    await newComment.save();

    // Push comment into ticket
    tick.comments.push(newComment._id);
    await tick.save();

    const comment = {
      id: newComment._id,
      message,
      type,
      user,
      project,
      ticket: { _id: tick._id, title: tick.title }
    };

    return res.status(201).json({
      success: true,
      message: "Comment created successfully",
      comment
    });

  } catch (error) {
    console.error("Error posting comment:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};

const getCommentsOfProject = async (req, res) => {
  try {
    const { error } = validationUtils.projectIdValidationSchema.validate(req.params);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { projectId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const skip = (page - 1) * limit;

    const tickets = await Ticket.find({ projectId }).select("comments").populate({
      path: "comments",
      options: { skip, limit }
    });

    const allComments = tickets.flatMap(ticket => ticket.comments || []);
    return res.status(200).json({
      success: true,
      message: "Comments fetched",
      comments: allComments,
      currentPage: page,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
const getCommentsOfTicket = async (req, res) => {
  try {
    const { error } = validationUtils.ticketIdValidationSchema.validate(req.params);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { ticketId } = req.params;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = 5;
    const skip = (page - 1) * limit;

    const ticket = await Ticket.findById(ticketId)
      .select("comments")
      .populate({
        path: "comments",
        options: { skip, limit, sort: { createdAt: -1 } },
        populate: { path: "userId", select: "_id username" } // ✅ correct field name
      });

    if (!ticket) {
      return res.status(404).json({ success: false, message: "Ticket not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Comments fetched successfully",
      comments: ticket.comments || [],
      currentPage: page
    });

  } catch (err) {
    console.error("Error fetching comments:", err);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};



const getCommentsOfUser = async (req, res) => {
  try {
    const { error } = validationUtils.userIdValidationSchema.validate(req.params);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { userId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const skip = (page - 1) * limit;

    const totalComments = await Comment.countDocuments({ createdBy: userId });
    const comments = await Comment.find({ createdBy: userId }).skip(skip).limit(limit);

    return res.status(200).json({
      success: true,
      message: "Comments fetched",
      comments,
      currentPage: page,
      totalPages: Math.ceil(totalComments / limit),
      totalComments
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const deletedComment = await Comment.findByIdAndDelete(commentId);
    if (!deletedComment) return res.status(404).json({ success: false, message: "Comment not found" });

    await Ticket.updateMany({}, { $pull: { comments: commentId } });
    return res.status(200).json({ success: true, message: "Comment deleted" });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};




export {postComment,getCommentsOfProject,getCommentsOfUser,deleteComment,getCommentsOfTicket};