// controllers/aiMailerController.js
import { pipeline } from "@huggingface/transformers";
import fetch from "node-fetch";

// Load the model ONCE when the controller is imported
console.log("⏳ Loading local AI model...");
const generator = await pipeline("text-generation", "Xenova/distilgpt2", { dtype: "fp32" });
console.log("✅ Local AI model ready!");

// 🧠 Common AI Email Content Generator
async function generateEmailContent(context) {
  const prompt = `Write a short, friendly, professional email notifying about: ${context}. Keep it under 3 sentences.`;
  const out = await generator(`${prompt}\n\nEmail:`, {
    max_new_tokens: 80,
    temperature: 0.9,
    top_p: 0.9,
  });
  return out[0].generated_text.trim();
}

// ===================================================================
// 1️⃣ Complaint Mail — User → Fixed Owner/Admin
// ===================================================================
export const sendComplaintMail = async (req, res) => {
  const { senderName, senderEmail, subject, context } = req.body;

  try {
    const content = await generateEmailContent(context);

    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        accept: "application/json",
        "api-key": process.env.BREVO_API_KEY, // ✅ using your original config key
        "content-type": "application/json",
      },
      body: JSON.stringify({
        sender: { name: senderName, email: senderEmail }, // dynamic sender (user)
        to: [{ email: "owner@trackforge.com" }], // fixed receiver (admin/owner)
        subject,
        htmlContent: `<html><body><p>${content}</p></body></html>`,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      console.error("❌ Brevo API Error:", data);
      return res.status(400).json({ success: false, error: data });
    }

    console.log("📧 Complaint mail sent successfully!");
    return res.status(200).json({
      success: true,
      type: "complaint-mail",
      message: "Complaint mail sent successfully!",
      content,
      brevoResponse: data,
    });
  } catch (err) {
    console.error("🚨 Error in sendComplaintMail:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// ===================================================================
// 2️⃣ Direct Mail — User ↔ User / Admin
// ===================================================================
export const sendDirectMail = async (req, res) => {
  const { senderName, senderEmail, receiverEmail, subject, context } = req.body;

  try {
    const content = await generateEmailContent(context);

    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        accept: "application/json",
        "api-key": process.env.BREVO_API_KEY, // ✅ same API key
        "content-type": "application/json",
      },
      body: JSON.stringify({
        sender: { name: senderName, email: senderEmail }, // dynamic sender
        to: [{ email: receiverEmail }], // dynamic receiver
        subject,
        htmlContent: `<html><body><p>${content}</p></body></html>`,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      console.error("❌ Brevo API Error:", data);
      return res.status(400).json({ success: false, error: data });
    }

    console.log("📧 Direct mail sent successfully!");
    return res.status(200).json({
      success: true,
      type: "direct-mail",
      message: "Direct mail sent successfully!",
      content,
      brevoResponse: data,
    });
  } catch (err) {
    console.error("🚨 Error in sendDirectMail:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};
