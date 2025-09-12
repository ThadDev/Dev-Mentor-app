import dotenv from "dotenv";
import express from "express";
import axios from "axios";
import cors from "cors";

dotenv.config();
console.log(
  "Loaded key:",
  process.env.OPENROUTER_API_KEY ? "✅ Found" : "❌ Missing"
);

const app = express();
app.use(cors());
app.use(express.json());

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

// ----- Normal POST route (existing) -----
app.post("/api/chat", async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: "Message is required" });

  try {
    const response = await axios.post(
      OPENROUTER_API_URL,
      {
        model: "openai/gpt-4o",
        messages: [
          {
            role: "system",
            content:
              "You are Dev Mentor, an AI that suggests project ideas, guides learning roadmaps, and helps developers choose tech stacks. If the user is vague, ask for clarification before answering.",
          },
          { role: "user", content: message },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:3000",
          "X-Title": "Idea Generator App",
        },
      }
    );

    const reply =
      response.data.choices?.[0]?.message?.content || "⚠️ No response.";
    res.json({ reply });
  } catch (err) {
    console.error("OpenRouter Error:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to generate idea." });
  }
});

// ----- Streaming SSE route -----
app.get("/api/chat-stream", async (req, res) => {
  const message = req.query.message;
  if (!message) return res.status(400).send("Message is required");

  try {
    const response = await axios.post(
      OPENROUTER_API_URL,
      {
        model: "openai/gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are DevMentor, an AI that suggests project ideas, guides learning roadmaps, and helps developers choose tech stacks. If the user is vague, ask for clarification before answering.",
          },
          { role: "user", content: message },
        ],
        temperature: 0.7,
        max_tokens: 400,
        stream: true,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:3000",
          "X-Title": "Idea Generator App",
        },
        responseType: "stream",
      }
    );

    // SSE headers
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    // Stream chunks to frontend
    response.data.on("data", (chunk) => {
      const payloads = chunk
        .toString()
        .split("\n\n")
        .filter((line) => line.trim() !== "");

      for (const payload of payloads) {
        if (payload.includes("[DONE]")) {
          res.write("data: [DONE]\n\n");
          res.end();
          return;
        }

        try {
          const data = JSON.parse(payload.replace(/^data: /, ""));
          const token = data.choices?.[0]?.delta?.content;
          if (token) res.write(`data: ${token}\n\n`);
        } catch (e) {
          console.error("Stream parse error:", payload, e);
        }
      }
    });

    response.data.on("end", () => {
      res.write("data: [DONE]\n\n");
      res.end();
    });

    response.data.on("error", (err) => {
      console.error("Stream error:", err.message);
      res.end();
    });
  } catch (err) {
    console.error(
      "OpenRouter Stream Error:",
      err.response?.data || err.message
    );
    res.status(500).send("Failed to generate idea.");
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`🚀 Backend running on http://localhost:${PORT}`)
);
