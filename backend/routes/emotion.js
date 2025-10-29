// server/routes/emotion.js
import express from "express";
import fetch from "node-fetch";

const router = express.Router();

const EMOTION_URL = process.env.EMOTION_URL || "http://localhost:8000";

router.post("/predict", async (req, res) => {
  try {
    const { answer_text, time_gap_s } = req.body;
    if (!answer_text || typeof time_gap_s !== "number" || time_gap_s < 0) {
      return res.status(400).json({ error: "Invalid payload" });
    }

    const ctrl = new AbortController();
    const timeout = setTimeout(() => ctrl.abort(), 800); // hard 800ms timeout for snappy demo

    const r = await fetch(`${EMOTION_URL}/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answer_text, time_gap_s }),
      signal: ctrl.signal
    }).catch((err) => {
      throw new Error(`emotion service fetch failed: ${err.message}`);
    });

    clearTimeout(timeout);

    if (!r.ok) {
      const txt = await r.text();
      return res.status(502).json({ error: "Emotion service bad response", detail: txt });
    }

    const data = await r.json();
    return res.json({ emotion: data.emotion });
  } catch (err) {
    // graceful fallback so your demo never stalls
    console.error("Emotion proxy error:", err.message);
    return res.json({ emotion: "Neutral" });
  }
});

export default router;
