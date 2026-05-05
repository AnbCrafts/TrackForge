import jwt from "jsonwebtoken";
import User from "../Models/User.Models.js";


const authorizeUserContext = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authorization token missing",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId).select(
      "_id username firstName lastName email manages ticketsAssigned projectJoinRequests teamJoinRequests role status"
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found or unauthorized",
      });
    }

    // 🔐 Attach authorized user context
    req.user = {
      _id: user._id,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      status: user.status,

      projectsManagedCount: user.manages?.length || 0,
      ticketsAssignedCount: user.ticketsAssigned?.length || 0,
      projectJoinRequestsCount: user.projectJoinRequests?.length || 0,
      teamJoinRequestsCount: user.teamJoinRequests?.length || 0,
    };

    next();
  } catch (error) {
    console.error("Authorization middleware error:", error.message);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

export default authorizeUserContext;
