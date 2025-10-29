const axios = require("axios");

// Parse safely even if the model wraps JSON in text
function safeParse(jsonLike) {
  try {
    const start = jsonLike.indexOf("{");
    const end = jsonLike.lastIndexOf("}");
    if (start >= 0 && end >= 0) {
      return JSON.parse(jsonLike.slice(start, end + 1));
    }
  } catch {}
  return null;
}

async function evaluateAnswer({ question, answer }) {
  if (!question || !answer) {
    return { verdict: "skip", reason: "no-question-or-answer" };
  }

  const evalPrompt = `You are an expert evaluator for a sorting algorithms tutor. Analyze if the student's answer correctly addresses the tutor's question.

TUTOR_QUESTION:
${question}

STUDENT_ANSWER:
${answer}

Return ONLY a JSON object (no other text) with these exact keys:
{
  "verdict": "correct" | "incorrect" | "partially-correct",
  "confidence": 0.0 to 1.0,
  "hint_needed": true | false,
  "short_feedback": "Brief explanation"
}

Evaluation criteria:
- "correct": Answer demonstrates clear understanding and is accurate
- "partially-correct": Answer shows some understanding but incomplete or minor errors
- "incorrect": Answer is wrong or shows misunderstanding
- hint_needed: true if student seems stuck or confused

Output ONLY the JSON, nothing else.`;

  const resp = await axios.post("http://localhost:11434/api/generate", {
    model: "llama3.1:8b",
    prompt: evalPrompt,
    stream: false
  });

  const parsed = safeParse(resp.data.response || "");
  if (!parsed || !parsed.verdict) {
    return { verdict: "skip", reason: "parse-failed" };
  }
  return parsed;
}

module.exports = { evaluateAnswer };
