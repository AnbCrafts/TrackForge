// utils/checkTicketValidity.js
import Ticket from "../Models/Ticket.Models.js";

export const checkTicketValidity = async (id) => {
  if (!id) {
    return { success: false, message: "No ticket ID provided to check validity" };
  }

  try {
    const ticket = await Ticket.findById(id);
    if (!ticket) {
      return { success: false, message: "Ticket not found" };
    }

    const validFor = new Date(ticket.validFor);
    const today = new Date();

    // Strip time so only date is compared
    today.setHours(0, 0, 0, 0);
    validFor.setHours(0, 0, 0, 0);

    if (today > validFor) {
      return { success: false, message: "Invalid action!!! This ticket has expired" };
    }

    // If valid, return the ticket
    return { success: true, ticket };
  } catch (error) {
    console.error("Error checking ticket validity:", error);
    return { success: false, message: "Server error while checking ticket validity" };
  }
};
