import { GoogleGenerativeAI } from "@google/generative-ai";
import fetch from "node-fetch";

// 🧠 Common AI Email Content Generator using Gemini
async function generateEmailContent(subject, context, senderName, receiverEmail) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Gemini API key is not configured in backend .env");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
You are an expert professional assistant.
Write a clean, professional, and concise email notification based on the details provided:

Subject/Purpose: "${subject}"
Context/Details: "${context}"
Sender Name: "${senderName}"
Recipient: "${receiverEmail || 'TrackForge Platform Admin/Owner'}"

Guidelines:
1. Write a short email (under 4 sentences).
2. Start with a proper professional greeting.
3. Be clear and specific about the context or invitation.
4. Close with a polite, professional sign-off.
5. Do NOT include any markdown subject headers or formatting blocks. Just return the raw body text of the email.
`;

  const result = await model.generateContent(prompt);
  return result.response.text().trim();
}

// ===================================================================
// 1️⃣ Complaint Mail — User → Fixed Owner/Admin
// ===================================================================
export const sendComplaintMail = async (req, res) => {
  const { senderName, senderEmail, subject, context } = req.body;

  if (!senderName || !senderEmail || !subject || !context) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  try {
    const content = await generateEmailContent(subject, context, senderName, "owner@trackforge.com");

    const brevoKey = process.env.BREVO_API_KEY;
    let brevoData = null;

    if (brevoKey) {
      const response = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          accept: "application/json",
          "api-key": brevoKey,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          sender: { name: senderName, email: senderEmail },
          to: [{ email: "owner@trackforge.com" }],
          subject,
          htmlContent: `<html><body><p>${content.replace(/\n/g, '<br>')}</p></body></html>`,
        }),
      });

      brevoData = await response.json();
      if (!response.ok) {
        console.error("❌ Brevo API Error:", brevoData);
      } else {
        console.log("📧 Complaint mail sent successfully via Brevo!");
      }
    } else {
      console.log("⚠️ BREVO_API_KEY not configured. Simulated dispatch successful.");
      console.log(`[SIMULATED EMAIL] To: owner@trackforge.com\nFrom: ${senderName} <${senderEmail}>\nSubject: ${subject}\nContent:\n${content}`);
    }

    return res.status(200).json({
      success: true,
      type: "complaint-mail",
      message: brevoKey ? "Complaint mail sent successfully!" : "AI Email content generated successfully (Simulation mode)!",
      content,
      brevoResponse: brevoData,
    });
  } catch (err) {
    console.error("🚨 Error in sendComplaintMail:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ===================================================================
// 2️⃣ Direct Mail — User ↔ User / Admin
// ===================================================================
export const sendDirectMail = async (req, res) => {
  const { senderName, senderEmail, receiverEmail, subject, context } = req.body;

  if (!senderName || !senderEmail || !receiverEmail || !subject || !context) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  try {
    const content = await generateEmailContent(subject, context, senderName, receiverEmail);

    const brevoKey = process.env.BREVO_API_KEY;
    let brevoData = null;

    if (brevoKey) {
      const response = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          accept: "application/json",
          "api-key": brevoKey,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          sender: { name: senderName, email: senderEmail },
          to: [{ email: receiverEmail }],
          subject,
          htmlContent: `<html><body><p>${content.replace(/\n/g, '<br>')}</p></body></html>`,
        }),
      });

      brevoData = await response.json();
      if (!response.ok) {
        console.error("❌ Brevo API Error:", brevoData);
      } else {
        console.log("📧 Direct mail sent successfully via Brevo!");
      }
    } else {
      console.log("⚠️ BREVO_API_KEY not configured. Simulated dispatch successful.");
      console.log(`[SIMULATED EMAIL] To: ${receiverEmail}\nFrom: ${senderName} <${senderEmail}>\nSubject: ${subject}\nContent:\n${content}`);
    }

    return res.status(200).json({
      success: true,
      type: "direct-mail",
      message: brevoKey ? "Direct mail sent successfully!" : "AI Email content generated successfully (Simulation mode)!",
      content,
      brevoResponse: brevoData,
    });
  } catch (err) {
    console.error("🚨 Error in sendDirectMail:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};
