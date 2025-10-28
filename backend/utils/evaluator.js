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

  const evalPrompt = `
You are an evaluator for an algorithms tutor. 
Given the TUTOR_QUESTION and STUDENT_ANSWER, return a strict JSON with keys:
- verdict: one of "correct", "incorrect", "partially-correct"
- confidence: number 0..1
- hint_needed: boolean
- short_feedback: one sentence about why

Output ONLY JSON.

TUTOR_QUESTION:
${question}

STUDENT_ANSWER:
${answer}
`;

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
