import Message from "../Models/Message.Models.js";

const getMessages = async (req, res) => {
  try {
    const { userId1, userId2 } = req.params;

    if (!userId1 || !userId2) {
      return res.status(400).json({ success: false, message: "User IDs are required" });
    }

    const messages = await Message.find({
      $or: [
        { sender: userId1, receiver: userId2 },
        { sender: userId2, receiver: userId1 },
      ],
    }).sort({ createdAt: 1 });

    return res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    console.error("Get Messages Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { sender, receiver, content } = req.body;

    if (!sender || !receiver || !content?.trim()) {
      return res.status(400).json({ success: false, message: "Invalid payload: sender, receiver, and content are required" });
    }

    const newMessage = new Message({
      sender,
      receiver,
      content: content.trim(),
    });

    await newMessage.save();

    return res.status(201).json({
      success: true,
      message: "Message sent successfully",
      messageData: newMessage,
    });
  } catch (error) {
    console.error("Send Message Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export { getMessages, sendMessage };
