import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
const API_KEY = "AIzaSyCfQ2E06JEstc8DzA2yFFjYLCnU5eoExW4";

app.use(cors());
app.use(express.json());

app.post("/generate", async (req, res) => {
  const prompt = req.body.prompt;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Создай стильный и грамотный пост для Telegram на основе:\n${prompt}\nИспользуй заголовок, emoji, призыв к действию.`
          }]
        }]
      })
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
