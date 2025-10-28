const express = require("express");
const cors = require("cors");
const axios = require("axios");
const { evaluateAnswer } = require("./utils/evaluator");
const { applyScoring } = require("./utils/scoring");

const Progress = require("./models/progress.js");
const { evaluateMilestones } = require("./mileStoneEngine.js");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3001;

const mongoose = require("mongoose");
const Session = require("./models/sessions.js");
const cookieParser = require("cookie-parser");

app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true, // Allow cookies
  })
);
app.use(express.json());

// Auth routes
app.use("/api/auth", require("./routes/auth"));

// Auth middleware
const requireAuth = require("./middleware/requireAuth");

// Calculate level from total XP
// Level 1: 0-99, Level 2: 100-249, Level 3: 250-449, etc.
// Each level requires 50 more XP than the previous: 100, 150, 200, 250...
function calculateLevel(totalXP) {
  let level = 1;
  let xpRequired = 100;
  let cumulativeXP = 0;

  while (totalXP >= cumulativeXP + xpRequired) {
    cumulativeXP += xpRequired;
    level++;
    xpRequired += 50;
  }

  const currentLevelXP = totalXP - cumulativeXP;
  const xpForNextLevel = xpRequired;

  return { level, currentLevelXP, xpForNextLevel, cumulativeXP };
}
mongoose
  .connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 10000, // helpful timeout
    family: 4, // force IPv4 (fixes some Windows/DNS issues)
  })
  .catch((err) => {
    console.error("Mongo connection error:", err.message);
  });

// --- Translation helpers using local Ollama ---
async function translateText(text, target) {
  try {
    const to = target === "kn" ? "Kannada" : "English";
    const prompt = `Translate to ${to}. Keep code and proper nouns in English. No emojis or bullet points.\n\n${text}\n\n${to}:`;
    const { data } = await axios.post("http://localhost:11434/api/generate", {
      model: "llama3.1:8b",
      prompt,
      stream: false,
    });
    return data && data.response ? data.response.trim() : text;
  } catch (e) {
    console.error("Translation error:", e.message);
    return text;
  }
}

async function ensureBilingual(text, sourceLang) {
  // Returns { en, kn }
  if (sourceLang === "kannada") {
    const kn = text;
    const en = await translateText(text, "en");
    return { en, kn };
  }
  const en = text;
  const kn = await translateText(text, "kn");
  return { en, kn };
}

// History
app.get("/api/history/:contextId", requireAuth, async (req, res) => {
  try {
    const { contextId } = req.params;
    const { language } = req.query;
    const userId = req.userId;

    const session = await Session.findOne({ userId, contextId });
    console.log(`🔍 Searching for session: userId=${userId}, contextId=${contextId}, found=${!!session}`);

    const msgs = session ? session.messages : [];
    const lang = language === "kannada" ? "kannada" : "english";

    const history = msgs.map((m) => {
      const base = m.toObject ? m.toObject() : m;
      const content =
        lang === "kannada"
          ? base.content_kn || base.content
          : base.content_en || base.content;
      return { role: base.role, content };
    });

    console.log(`📜 Returning ${history.length} messages for ${contextId}`);
    return res.json({ history });
  } catch (e) {
    console.error("History error:", e);
    res.status(500).json({ history: [] });
  }
});

app.get("/", (req, res) => {
  res.json({ message: "SortIt Backend API is running!" });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Backend is healthy" });
});

// Get leaderboard (all users ranked by total XP)
app.get("/api/leaderboard", async (req, res) => {
  try {
    // Aggregate total XP for each user across all their sessions
    const leaderboard = await Session.aggregate([
      {
        $group: {
          _id: "$userId",
          totalXP: { $sum: "$xp" }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user"
        }
      },
      {
        $unwind: "$user"
      },
      {
        $project: {
          _id: 0,
          userId: "$_id",
          name: "$user.name",
          email: "$user.email",
          totalXP: 1
        }
      },
      {
        $sort: { totalXP: -1 }
      },
      {
        $limit: 100 // Top 100 users
      }
    ]);

    // Calculate levels for each user
    const leaderboardWithLevels = leaderboard.map((entry, index) => {
      const levelInfo = calculateLevel(entry.totalXP);
      return {
        rank: index + 1,
        userId: entry.userId,
        name: entry.name || "Anonymous",
        totalXP: entry.totalXP,
        level: levelInfo.level
      };
    });

    res.json({ leaderboard: leaderboardWithLevels });
  } catch (e) {
    console.error("Leaderboard error:", e);
    res.status(500).json({ error: "Failed to fetch leaderboard", leaderboard: [] });
  }
});

// Get session XP/level info
app.get("/api/session/:contextId", requireAuth, async (req, res) => {
  try {
    const { contextId } = req.params;
    const userId = req.userId;
    const session = await Session.findOne({ userId, contextId });

    if (!session) {
      return res.json({
        xpLevel: 1,
        currentLevelXP: 0,
        xpForNextLevel: 100,
        totalXP: 0,
      });
    }

    const levelInfo = calculateLevel(session.xp);
    return res.json({
      xpLevel: levelInfo.level,
      currentLevelXP: levelInfo.currentLevelXP,
      xpForNextLevel: levelInfo.xpForNextLevel,
      totalXP: session.xp,
    });
  } catch (e) {
    console.error("Session fetch error:", e);
    return res.status(500).json({ error: "Failed to fetch session" });
  }
});

app.post("/api/chat", requireAuth, async (req, res) => {
  try {
    const { contextId, message, algorithm, learnMode, language } = req.body;
    const userId = req.userId;

    if (!message)
      return res.status(400).json({ success: false, error: "Missing message" });
    if (!contextId) {
      return res.status(400).json({ success: false, error: "Missing contextId" });
    }

    // 1) Find/Create session using findOneAndUpdate to avoid duplicate key errors
    let session = await Session.findOneAndUpdate(
      { userId, contextId },
      {
        $setOnInsert: {
          userId,
          contextId,
          algorithm: algorithm || "",
          messages: [],
          score: 50,
          level: "intermediate",
          stats: { correct: 0, incorrect: 0, partial: 0, hintsUsed: 0, turns: 0 },
          xp: 0,
          xpLevel: 1,
        }
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    console.log(`🔍 Chat: Session for userId=${userId}, contextId=${contextId} ready`);

    // 2) Find/Create progress using findOneAndUpdate to avoid duplicate key errors
    const algoForProgress = algorithm || session.algorithm || "Selection Sort";
    let progress = await Progress.findOneAndUpdate(
      { userId, algorithm: algoForProgress },
      {
        $setOnInsert: {
          userId,
          algorithm: algoForProgress,
          milestones: [],
          isCompleted: false,
          totalXpFromMilestones: 0,
          turnsAtStart: session.messages.length,
        }
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // 2) Calculate XP for this turn (based on message length)
    const msgLen = message.length;
    let xpGainTurn = 0;
    if (msgLen > 0) {
      if (msgLen < 20) xpGainTurn = 6;
      else if (msgLen < 50) xpGainTurn = 7;
      else if (msgLen < 100) xpGainTurn = 8;
      else if (msgLen < 200) xpGainTurn = 9;
      else xpGainTurn = 10;
    }

    // Add student message to session history
    session.messages.push({
      role: "student",
      content: message,
      content_en: language === "english" ? message : "",
      content_kn: language === "kannada" ? message : "",
    });

    // Translate student message in background (non-blocking)
    const studentMsgIndex = session.messages.length - 1;
    setImmediate(async () => {
      try {
        const studentBilingual = await ensureBilingual(
          message,
          language === "kannada" ? "kannada" : "english"
        );
        const sess = await Session.findOne({ userId, contextId });
        if (sess && sess.messages[studentMsgIndex]) {
          sess.messages[studentMsgIndex].content_en = studentBilingual.en;
          sess.messages[studentMsgIndex].content_kn = studentBilingual.kn;
          await sess.save();
        }
      } catch (e) {
        console.error("Background student translation error:", e.message);
      }
    });

    // Award XP for this turn
    session.xp = (session.xp || 0) + xpGainTurn;
    
    // Calculate current level info
    const levelInfo = calculateLevel(session.xp);
    
    console.log(`💎 XP awarded this turn: +${xpGainTurn} (total: ${session.xp}, level: ${levelInfo.level}) for userId=${userId} contextId=${contextId}`);

    // Evaluate against latest student message
    const {
      hit: milestoneDef,
      xp: xpDeltaMilestone,
      percent,
    } = await (async () => {
      try {
        return evaluateMilestones({
          session,
          progress,
          algorithm: algoForProgress,
          xpPerMilestone: 100,
        });
      } catch (e) {
        console.error("Milestone evaluation error:", e.message);
        return { hit: null, xp: 0, percent: 0 };
      }
    })();

    // Apply milestone XP if any
    if (xpDeltaMilestone > 0) {
      progress.totalXpFromMilestones += xpDeltaMilestone;
      session.xp = (session.xp || 0) + xpDeltaMilestone;
    }

    progress.updatedAt = new Date();
    await progress.save();
    session.updatedAt = new Date();
    await session.save();

    // Console log milestone progress
    try {
      console.log(
        `📊 Milestone Progress for ${algoForProgress}: ${percent}% (${
          progress.milestones.filter((m) => m.status === "done").length
        }/${progress.milestones.length} completed)`
      );
      if (milestoneDef) {
        console.log(
          `🎯 Milestone HIT: "${milestoneDef.title}" (+${xpDeltaMilestone} XP)`
        );
      }
    } catch (_) {}

    // 4) Build short conversation history (last 6 messages) in the selected language
    const lastMessages = session.messages.slice(-6);
    const formattedHistory = lastMessages
      .map((m) => {
        // Use language-specific content if available
        let content = m.content;
        if (language === "kannada" && m.content_kn) {
          content = m.content_kn;
        } else if (language === "english" && m.content_en) {
          content = m.content_en;
        }
        return `${m.role === "student" ? "Student" : "Tutor"}: ${content}`;
      })
      .join("\n");

    // 5) Build intelligent adaptive system prompt
    const milestonesData = require("./milestones.js");
    function getMilestones(algorithm) {
      return milestonesData[algorithm] || [];
    }

    const allMilestones = getMilestones(algoForProgress);
    const completedMilestones = progress.milestones.filter(
      (m) => m.status === "done"
    );
    const completedMilestonesList = completedMilestones.map((m) => {
      const def = allMilestones.find((d) => d.key === m.key);
      return def ? def.title : m.title;
    });

    const nextMilestone = (() => {
      const pending = progress.milestones.filter((m) => m.status !== "done");
      if (pending.length === 0) return null;
      const firstPendingKey = pending[0].key;
      return allMilestones.find((d) => d.key === firstPendingKey);
    })();

    const totalTurns = session.messages.filter(
      (m) => m.role === "student"
    ).length;

    let systemPrompt = `You are Sorty the Monster, a friendly, energetic AI tutor for sorting algorithms.

## 🎯 CORE RULES - READ CAREFULLY:
1. **BE BRIEF**: Keep responses to 1-3 short sentences MAX
2. **ONE IDEA PER TURN**: Focus on one concept at a time
3. **ASK SHORT QUESTIONS**: Make questions simple and direct
4. **NO REPETITION**: Don't repeat what the student already said
5. **NO FLUFF**: Cut all unnecessary words and explanations

## 📚 STUDENT CONTEXT:
- Mastery: ${session.level} | XP: ${session.xp} (Lvl ${levelInfo.level})
- Learning: ${algoForProgress} | Turn: ${totalTurns}

## 🧭 TEACHING STYLE:
${
  learnMode === "guide"
    ? `**GUIDED**: Ask SHORT questions. Never give direct answers. Guide discovery.`
    : `**DIRECT**: Answer briefly. One step at a time.`
}

## 💙 TONE:
- Encouraging but concise
- Celebrate wins quickly (e.g., "Nice! ✨")
- If frustrated → simpler hint, shorter
- If engaged → harder question, still short

## 🎓 CURRENT FOCUS:
${
  nextMilestone
    ? `Teaching: "${nextMilestone.title}"
${
  totalTurns < (nextMilestone.afterTurnsMin || 0)
    ? `→ Build concept gradually (${(nextMilestone.afterTurnsMin || 0) - totalTurns} more turns needed)`
    : `→ Student ready. Ask them to demonstrate understanding.`
}`
    : `✅ All concepts mastered!`
}

## 🎁 XP:
${xpGainTurn >= 8 ? `+${xpGainTurn} XP! Start with brief praise (2-3 words).` : ""}
${milestoneDef ? `🎯 Milestone hit: "${milestoneDef.title}" - Say "Nice!" and move on.` : ""}

## 🌐 LANGUAGE:
${language === "kannada" ? "Respond in simple Kannada." : "Respond in simple English."}

**YOUR RESPONSE MUST BE:**
- Maximum 1-3 sentences
- One clear idea or question
- No repetition, no fluff, no long explanations
- Direct and engaging

Focus: ${algoForProgress}. Make it fun and fast!`;

    // 6) Generate next tutor turn
    const ollamaResponse = await axios.post(
      "http://localhost:11434/api/generate",
      {
        model: "llama3.1:8b",
        prompt: `${systemPrompt}\n\n${formattedHistory}\nTutor:`,
        stream: false,
      }
    );

    const reply =
      ollamaResponse.data?.response || "Let's think about that step by step.";

    // 7) Store assistant reply and translate in background
    session.messages.push({
      role: "assistant",
      content: reply,
      content_en: language === "english" ? reply : "",
      content_kn: language === "kannada" ? reply : "",
    });
    session.updatedAt = new Date();
    await session.save();

    // Translate assistant reply in background (non-blocking)
    const assistantMsgIndex = session.messages.length - 1;
    setImmediate(async () => {
      try {
        const assistantBilingual = await ensureBilingual(
          reply,
          language === "kannada" ? "kannada" : "english"
        );
        const sess = await Session.findOne({ userId, contextId });
        if (sess && sess.messages[assistantMsgIndex]) {
          sess.messages[assistantMsgIndex].content_en = assistantBilingual.en;
          sess.messages[assistantMsgIndex].content_kn = assistantBilingual.kn;
          await sess.save();
        }
      } catch (e) {
        console.error("Background assistant translation error:", e.message);
      }
    });

    // 8) Send response immediately in the requested language
    const responseText = reply;

    // 9) Return AI reply + XP + adaptive + progress bar info
    return res.json({
      success: true,
      response: responseText,
      xpGain: xpGainTurn + (xpDeltaMilestone || 0), // per-turn + milestone burst
      totalXP: session.xp,
      xpLevel: levelInfo.level,
      currentLevelXP: levelInfo.currentLevelXP,
      xpForNextLevel: levelInfo.xpForNextLevel,
      adaptive: {
        score: session.score,
        level: session.level,
        stats: session.stats,
      },
      progress: {
        algorithm: algoForProgress,
        percent, // for your hidden progress bar
        xpEarned: xpDeltaMilestone || 0,
        xpTotalFromMilestones: progress.totalXpFromMilestones,
        isCompleted: progress.isCompleted,
      },
    });
  } catch (error) {
    console.error("Chat error:", error.message);
    return res.status(500).json({ error: "AI error", success: false });
  }
});

//milestone progress bar and xp
// Get progress snapshot
app.get("/api/progress/:algorithm", requireAuth, async (req, res) => {
  try {
    const { algorithm } = req.params;
    const userId = req.userId;
    const progress = await Progress.findOne({ userId, algorithm });
    
    if (!progress)
      return res.json({
        success: true,
        percent: 0,
        isCompleted: false,
        milestones: [],
      });

    const total = progress.milestones.length || 1;
    const done = progress.milestones.filter(
      (m) => m.status === "done"
    ).length;
    const percent = Math.round((done / total) * 100);
    res.json({
      success: true,
      percent,
      isCompleted: progress.isCompleted,
      totalXpFromMilestones: progress.totalXpFromMilestones,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false });
  }
});

// Get session XP summary
app.get("/api/session/summary/:contextId", requireAuth, async (req, res) => {
  try {
    const { contextId } = req.params;
    const userId = req.userId;
    const s = await Session.findOne({ userId, contextId });
    
    if (!s)
      return res.json({
        success: true,
        xp: 0,
        level: "intermediate",
        score: 50,
      });
    res.json({
      success: true,
      xp: s.xp || 0,
      level: s.level,
      score: s.score,
      turns: s.stats?.turns || 0,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}`);
});
