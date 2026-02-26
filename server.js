import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import OpenAI from "openai";
import path from "path";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

app.get("/", (req, res) => {
  res.sendFile(path.join(process.cwd(), "public", "index.html"));
});

app.post("/chat", async (req, res) => {
  try {
    const completion = await client.chat.completions.create({
      model: "llama-3.1-8b-instant",   // ⭐ NEW MODEL
      messages: [
        {
          role: "system",
          content:
            "You are a friendly AI health assistant. Talk naturally and give safe medical guidance.",
        },
        { role: "user", content: req.body.message },
      ],
    });

    res.json({
      reply: completion.choices[0].message.content,
    });
  } catch (err) {
    console.log(err);
    res.json({ reply: "⚠ Server error" });
  }
});

app.listen(5000, () => console.log("🔥 Groq AI Running"));