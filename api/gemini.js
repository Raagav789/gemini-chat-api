// api/gemini.js (Vercel Serverless Function)
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { question } = req.body;
  const API_KEY = process.env.GEMINI_API_KEY;

  try {
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: question }] }],
        }),
      }
    );
    const data = await geminiRes.json();

    const answer =
      data.candidates?.[0]?.content?.parts?.[0]?.text || "No response.";
    res.status(200).json({ answer });
  } catch (err) {
    res.status(500).json({ error: "Gemini API error", details: err.message });
  }
}
