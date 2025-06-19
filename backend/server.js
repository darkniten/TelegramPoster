import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();

// 👇 ВСТАВ СЮДИ СВІЙ АКТУАЛЬНИЙ API-КЛЮЧ
const API_KEY = "AIzaSyCfQ2E06JEstc8DzA2yFFjYLCnU5eoExW4";

app.use(cors());
app.use(express.json());

app.post("/generate", async (req, res) => {
  const prompt = req.body.prompt;

  console.log("➡️ Отримано prompt:", prompt);

  if (!prompt) {
    console.error("❌ Помилка: prompt відсутній у запиті");
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Створи грамотний, лаконічний пост для Telegram українською мовою з емодзі, заголовком і закликом до дії. Ось суть:\n${prompt}`,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await geminiRes.json();

    // 🔍 Виводимо повний JSON для дебагу
    console.log("✅ Відповідь від Gemini:", JSON.stringify(data, null, 2));

    const result = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!result) {
      console.error("⚠️ Gemini не повернув текст:", data);
      return res
        .status(500)
        .json({ error: "Gemini не повернув текст. Перевір запит." });
    }

    res.json({ text: result.trim() });
  } catch (error) {
    console.error("❌ Помилка сервера:", error);
    res.status(500).json({ error: "Внутрішня помилка сервера." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Сервер запущено на порті ${PORT}`));
