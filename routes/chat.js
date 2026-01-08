// backend/chat.js
import express from "express";

const chatRouter = express.Router();
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

chatRouter.post("/chat", async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Messages required" });
    }

    // Хамгийн сүүлчийн мессежийг авна (эсвэл бүтнээр нь contents болгож хөрвүүлж болно)
    const userMessage = messages[messages.length - 1].text;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: userMessage }],
          },
        ],
      }),
    });

    const data = await response.json();

    // Дата болон candidates байгаа эсэхийг шалгах
    if (data && data.candidates && data.candidates.length > 0) {
      const reply = data.candidates[0].content.parts[0].text;
      res.json({ reply });
    } else {
      console.error("API Error Response:", data);
      res.status(500).json({
        error: "Gemini-аас хариу ирсэнгүй.",
        details: data.error || "Unknown error",
      });
    }
  } catch (err) {
    console.error("Chat API error:", err);
    res.status(500).json({ error: "Chat failed" });
  }
});

export default chatRouter;
