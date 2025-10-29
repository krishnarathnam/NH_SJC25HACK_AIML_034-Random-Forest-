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

// Get user's total XP across all sessions (for navbar)
app.get("/api/user/total-xp", requireAuth, async (req, res) => {
  try {
    const userId = req.userId;
    
    // Aggregate total XP from all sessions
    const result = await Session.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: null, totalXP: { $sum: "$xp" } } }
    ]);
    
    const totalXP = result.length > 0 ? result[0].totalXP : 0;
    const levelInfo = calculateLevel(totalXP);
    
    return res.json({
      xpLevel: levelInfo.level,
      currentLevelXP: levelInfo.currentLevelXP,
      xpForNextLevel: levelInfo.xpForNextLevel,
      totalXP: totalXP,
    });
  } catch (e) {
    console.error("Total XP fetch error:", e);
    return res.status(500).json({ error: "Failed to fetch total XP" });
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

    // 3) Evaluate student's answer against last tutor question (for adaptive scoring)
    let evalResult = null;
    const lastTutorMessage = [...session.messages].reverse().find(m => m.role === "assistant");
    if (lastTutorMessage && lastTutorMessage.content) {
      try {
        evalResult = await evaluateAnswer({
          question: lastTutorMessage.content,
          answer: message
        });
        console.log(`🎯 Answer Evaluation: ${evalResult.verdict} (confidence: ${evalResult.confidence || 'N/A'})`);
      } catch (e) {
        console.error("Answer evaluation error:", e.message);
        evalResult = { verdict: "skip", reason: "error" };
      }
    }

    // 4) Apply adaptive scoring based on evaluation
    if (evalResult && evalResult.verdict !== "skip") {
      applyScoring(session, evalResult);
      console.log(`📊 Adaptive Score Updated: ${session.score}/100 (Level: ${session.level})`);
      console.log(`   Stats - Correct: ${session.stats.correct}, Incorrect: ${session.stats.incorrect}, Partial: ${session.stats.partial}, Hints: ${session.stats.hintsUsed}, Turns: ${session.stats.turns}`);
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
    console.log(`⭐ Current Adaptive Score: ${session.score}/100 (${session.level})`);

    // 5) Increment qualityTurns only if student showed good understanding
    // Only count turns where confidence >= 0.6 OR verdict is correct/partially-correct
    if (evalResult && evalResult.verdict !== "skip") {
      const isQualityTurn = 
        evalResult.verdict === "correct" || 
        evalResult.verdict === "partially-correct" ||
        (evalResult.confidence && evalResult.confidence >= 0.6);
      
      if (isQualityTurn) {
        progress.qualityTurns = (progress.qualityTurns || 0) + 1;
        console.log(`✅ Quality Turn Count: ${progress.qualityTurns} (Good understanding shown)`);
      } else {
        console.log(`⚠️  Quality Turn NOT counted: Low confidence (${evalResult.confidence || 'N/A'}) or incorrect answer`);
      }
    }

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
      // Find first pending milestone in CORRECT ORDER (from defs, not progress)
      for (const def of allMilestones) {
        const progressMilestone = progress.milestones.find(m => m.key === def.key);
        if (progressMilestone && progressMilestone.status !== "done") {
          return def;
        }
      }
      return null;
    })();

    const totalTurns = session.messages.filter(
      (m) => m.role === "student"
    ).length;

    const qualityTurns = progress.qualityTurns || 0;

    // Console log what concept LLM should teach
    console.log(`\n📖 TEACHING CONTEXT for ${userId}:`);
    console.log(`   Algorithm: ${algoForProgress}`);
    console.log(`   Total Turns: ${totalTurns} | Quality Turns (counted): ${qualityTurns}`);
    console.log(`   Completed Milestones: ${completedMilestones.length}/${allMilestones.length}`);
    if (completedMilestones.length > 0) {
      console.log(`   ✅ Done: ${completedMilestonesList.join(', ')}`);
    }
    if (nextMilestone) {
      console.log(`   🎯 CURRENT FOCUS: "${nextMilestone.title}"`);
      console.log(`   📊 Min Quality Turns Required: ${nextMilestone.afterTurnsMin}, Current: ${qualityTurns}`);
      console.log(`   ${qualityTurns < nextMilestone.afterTurnsMin ? '⚠️  NOT ready yet - building concept' : '✅ Ready for demonstration'}`);
    } else {
      console.log(`   🎉 All milestones completed!`);
    }
    console.log('');

    let systemPrompt = `You are Sorty the Monster, a friendly, energetic AI tutor for sorting algorithms.

## 🎯 CORE RULES - READ CAREFULLY:
1. **BE CONCISE BUT COMPLETE**: Keep responses to 5-6 lines (sentences)
2. **STRICT MILESTONE FOCUS**: ONLY teach the current milestone. NEVER jump ahead.
3. **RESPECT MINIMUM TURNS**: Do NOT complete milestone before afterTurnsMin turns.
4. **ONE IDEA PER TURN**: Focus on one concept at a time
5. **EXPLAIN THOROUGHLY**: Give enough context to understand the concept
6. **ASK ENGAGING QUESTIONS**: Make questions interesting and thought-provoking
7. **NO REPETITION**: Don't repeat what the student already said

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

## 🎓 CURRENT MILESTONE (STRICT FOCUS):
${
  nextMilestone
    ? `**ONLY teach: "${nextMilestone.title}"**
${
  qualityTurns < (nextMilestone.afterTurnsMin || 0)
    ? `⚠️ MINIMUM ${nextMilestone.afterTurnsMin} quality turns required! Current: ${qualityTurns}
→ DO NOT rush. Build this concept gradually over ${(nextMilestone.afterTurnsMin || 0) - qualityTurns} more meaningful conversation(s).
→ NEVER mention or teach future milestones yet.
→ Stay focused ONLY on: "${nextMilestone.title}"
→ Note: Only turns where student shows understanding count toward progress.`
    : `✅ Minimum quality turns met (${qualityTurns}/${nextMilestone.afterTurnsMin})
→ Now guide student to demonstrate understanding of: "${nextMilestone.title}"
→ Still DO NOT move to next topic until student shows understanding.`
}`
    : `✅ All milestones completed! Review and reinforce.`
}

## 🎁 XP:
${xpGainTurn >= 8 ? `+${xpGainTurn} XP! Start with brief praise (2-3 words).` : ""}
${milestoneDef ? `🎯 Milestone hit: "${milestoneDef.title}" - Say "Nice!" and move on.` : ""}

## 🌐 LANGUAGE - CRITICAL:
${language === "kannada" 
  ? `**KANNADA ONLY**: Your ENTIRE response must be in Kannada script (ಕನ್ನಡ). 
   - NO English words or phrases allowed
   - NO mixing languages
   - Use ONLY Kannada characters
   - Technical terms can stay in English but write in Kannada script if possible` 
  : `**ENGLISH ONLY**: Your ENTIRE response must be in English.
   - NO Kannada words or phrases
   - NO mixing languages`}

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

// Get all user sessions with scores for dashboard
app.get("/api/user/sessions", requireAuth, async (req, res) => {
  try {
    const userId = req.userId;
    const sessions = await Session.find({ userId });
    
    const sessionData = sessions.map(s => ({
      algorithm: s.algorithm,
      contextId: s.contextId,
      score: s.score || 50,
      level: s.level || "intermediate",
      xp: s.xp || 0,
      stats: s.stats || { correct: 0, incorrect: 0, partial: 0, hintsUsed: 0, turns: 0 }
    }));
    
    res.json({ success: true, sessions: sessionData });
  } catch (e) {
    console.error("User sessions fetch error:", e);
    res.status(500).json({ success: false });
  }
});

// Generate hint based on last LLM response
app.post("/api/generate-hint", requireAuth, async (req, res) => {
  try {
    const { lastMessage, algorithm } = req.body;

    if (!lastMessage) {
      return res.json({ success: false, hint: '' });
    }

    // Use LLM to generate a short hint
    const hintPrompt = `Based on this tutor message about ${algorithm}:

"${lastMessage}"

Generate ONE short hint (max 15 words) to help the student respond or think about the next step. The hint should be encouraging and guide them toward understanding.

Return ONLY the hint text, no extra formatting or explanation.`;

    const ollamaResponse = await axios.post(
      "http://localhost:11434/api/generate",
      {
        model: "llama3.1:8b",
        prompt: hintPrompt,
        stream: false,
      }
    );

    const hint = (ollamaResponse.data?.response || '').trim();
    
    res.json({ 
      success: true, 
      hint: hint || 'Think about what you just learned and try to explain it in your own words.'
    });
  } catch (error) {
    console.error("Hint generation error:", error);
    res.json({ 
      success: true, 
      hint: 'Try explaining the concept in your own words or ask a question!'
    });
  }
});

// Get completed puzzles for an algorithm
app.get("/api/puzzle/completed/:algorithm", requireAuth, async (req, res) => {
  try {
    const { algorithm } = req.params;
    const userId = req.userId;

    const progress = await Progress.findOne({ userId, algorithm });
    
    if (!progress) {
      return res.json({ 
        success: true, 
        completedPuzzles: [],
        allPuzzlesCompleted: false
      });
    }

    res.json({ 
      success: true, 
      completedPuzzles: progress.completedPuzzles || [],
      allPuzzlesCompleted: progress.allPuzzlesCompleted || false
    });
  } catch (error) {
    console.error("Fetch completed puzzles error:", error);
    res.status(500).json({ success: false });
  }
});

// Check puzzle solution using LLM
app.post("/api/puzzle/check", requireAuth, async (req, res) => {
  try {
    const { algorithm, puzzleId, userCode, solution, testCases } = req.body;
    const userId = req.userId;

    if (!userCode || !solution) {
      return res.json({ success: false, isCorrect: false, feedback: 'Code is required' });
    }

    // Use LLM to evaluate the code
    const evalPrompt = `You are a code evaluation expert. Compare the user's code with the expected solution.

EXPECTED SOLUTION:
${solution}

USER'S CODE:
${userCode}

Evaluate if the user's code is functionally correct and solves the same problem as the expected solution.
The code doesn't need to be identical, but it should implement the same logic and handle edge cases.

Return ONLY a JSON object (no other text) with these exact keys:
{
  "isCorrect": true or false,
  "feedback": "Brief explanation of what's right or wrong",
  "hint": "A helpful hint if the code is incorrect (or empty string if correct)"
}`;

    const ollamaResponse = await axios.post(
      "http://localhost:11434/api/generate",
      {
        model: "llama3.1:8b",
        prompt: evalPrompt,
        stream: false,
      }
    );

    const responseText = ollamaResponse.data?.response || '';
    
    // Parse LLM response
    let evaluation;
    try {
      const start = responseText.indexOf('{');
      const end = responseText.lastIndexOf('}');
      if (start >= 0 && end >= 0) {
        evaluation = JSON.parse(responseText.slice(start, end + 1));
      } else {
        evaluation = { isCorrect: false, feedback: 'Could not evaluate code', hint: 'Try again' };
      }
    } catch (parseErr) {
      console.error('Parse error:', parseErr);
      evaluation = { isCorrect: false, feedback: 'Could not evaluate code', hint: 'Try again' };
    }

    // If correct, award XP and mark puzzle as completed
    if (evaluation.isCorrect) {
      const contextId = `algo:${algorithm}`;
      const session = await Session.findOne({ userId, contextId });
      
      if (session) {
        session.xp = (session.xp || 0) + 200; // Puzzle XP reward
        await session.save();
        console.log(`🎮 Puzzle solved! +200 XP awarded to userId=${userId} for ${algorithm}`);
      }

      // Mark puzzle as completed in progress
      const progress = await Progress.findOne({ userId, algorithm });
      if (progress) {
        // Add puzzle ID to completedPuzzles if not already there
        if (!progress.completedPuzzles.includes(puzzleId)) {
          progress.completedPuzzles.push(puzzleId);
          await progress.save();
          console.log(`✅ Puzzle ${puzzleId} marked as completed for ${algorithm}`);
        }
      }
    }

    res.json({ 
      success: true, 
      isCorrect: evaluation.isCorrect,
      feedback: evaluation.feedback,
      hint: evaluation.hint
    });
  } catch (error) {
    console.error("Puzzle check error:", error);
    res.status(500).json({ success: false, isCorrect: false, feedback: 'Error checking solution' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}`);
});
