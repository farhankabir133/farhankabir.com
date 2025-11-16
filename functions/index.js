// =======================================================
// FK-Bot Backend Functions (Standalone Node.js)
// =======================================================

const express = require("express");
const cors = require("cors");
const fetch = global.fetch || require("node-fetch");
const nodemailer = require("nodemailer");
const { getSystemPrompt } = require("./chatbot_personality");

const app = express();
app.use(cors()); // Allow cross-origin requests
app.use(express.json()); // Parse JSON bodies

// =======================================================
// Helper: Knowledge Base Context
// =======================================================
async function getKBContext(userMessage) {
  const kbEntries = [
    "Farhan Kabir is a full-stack software developer.",
    "He specializes in Flutter, Node.js, Web3, and AI projects.",
    "He has built portfolio websites, music apps, and chatbots.",
    "He is available for freelance work and consultations."
  ];
  return kbEntries.join("\n");
}

// =======================================================
// Chatbot Endpoint (DigitalOcean Agent)
// =======================================================
app.post("/api/chat", async (req, res) => {
  if (!req.body || !req.body.message) {
    return res.status(400).json({ error: 'Missing "message" in request body' });
  }

  const { message } = req.body;

  try {
    const kbContext = await getKBContext(message);
    const systemPrompt = `${getSystemPrompt()}\n\nKnowledge Base:\n${kbContext}`;

    const doEndpoint = process.env.DO_AGENT_ENDPOINT;
    const doKey = process.env.DO_AGENT_ACCESS_KEY;

    if (!doEndpoint) {
      return res.status(500).json({ error: "DigitalOcean agent endpoint not configured" });
    }

    const payload = {
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ]
    };

    const headers = { "Content-Type": "application/json" };
    if (doKey) headers["Authorization"] = `Bearer ${doKey}`;

    const resp = await fetch(doEndpoint, {
      method: "POST",
      headers,
      body: JSON.stringify(payload)
    });

    if (!resp.ok) {
      const textDump = await resp.text().catch(() => "<no body>");
      throw new Error(`DigitalOcean agent error ${resp.status}: ${textDump}`);
    }

    let json;
    try {
      json = await resp.json();
    } catch (e) {
      json = { text: await resp.text() };
    }

    const reply =
      json?.output?.text ||
      json?.text ||
      json?.response ||
      (typeof json === "string" ? json : null) ||
      json?.choices?.[0]?.message?.content ||
      json?.choices?.[0]?.text ||
      (json && JSON.stringify(json));

    if (!reply) throw new Error("No reply from DigitalOcean agent");

    return res.status(200).json({ response: String(reply) });
  } catch (error) {
    console.error("Chatbot API Error:", error);
    res.status(500).json({ error: error.message || "Unable to get response from chatbot backend" });
  }
});

// =======================================================
// Contact Form Endpoint
// =======================================================
app.post("/api/contact", async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: "Missing one or more required fields: name, email, message" });
  }

  try {
    const user = process.env.GMAIL_EMAIL;
    const pass = process.env.GMAIL_APP_PASS;

    if (!user || !pass) {
      throw new Error("Gmail credentials not configured");
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user, pass }
    });

    const mailOptions = {
      from: `"${name}" <${email}>`,
      to: user,
      subject: "New Contact Form Submission",
      text: message
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Message sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Failed to send message." });
  }
});

// =======================================================
// Start Express App
// =======================================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`FK-Bot backend running on port ${PORT}`);
});