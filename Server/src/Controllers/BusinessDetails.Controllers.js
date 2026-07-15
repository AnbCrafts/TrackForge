import BusinessDetails from "../Models/BusinessDetails.Models.js";
import User from "../Models/User.Models.js";
import mongoose from "mongoose";

// Fetch business details for a user
export const getBusinessDetails = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: "Invalid User ID format" });
    }

    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    let details = await BusinessDetails.findOne({ userId });

    // If no details exist yet, return a clean default template so the frontend doesn't crash
    if (!details) {
      return res.status(200).json({
        success: true,
        message: "No business details found, returning default schema",
        details: {
          userId,
          name: "",
          logoUrl: "",
          email: "",
          phone: "",
          website: "",
          address: {
            street: "",
            city: "",
            state: "",
            zip: "",
            country: "",
          },
          taxId: "",
          regNumber: "",
          legalName: "",
          additionalNotes: "",
        },
      });
    }

    return res.status(200).json({
      success: true,
      message: "Business details retrieved successfully",
      details,
    });
  } catch (error) {
    console.error("Error fetching business details:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Update (or create) business details for a user
export const updateBusinessDetails = async (req, res) => {
  try {
    const { userId } = req.params;
    const updateData = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: "Invalid User ID format" });
    }

    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (!updateData.name || updateData.name.trim() === "") {
      return res.status(400).json({ success: false, message: "Business Name is required" });
    }

    // Find and update business details, or create if not exists
    const updatedDetails = await BusinessDetails.findOneAndUpdate(
      { userId },
      { $set: updateData },
      { new: true, upsert: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: "Business details saved successfully",
      details: updatedDetails,
    });
  } catch (error) {
    console.error("Error updating business details:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
