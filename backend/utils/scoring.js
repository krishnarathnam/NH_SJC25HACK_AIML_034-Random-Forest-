// utils/scoring.js
function computeLevel(score) {
  if (score <= 30) return "beginner";
  if (score > 70) return "advanced";
  return "intermediate";
}

function applyScoring(session, evalResult) {
  if (!evalResult || evalResult.verdict === "skip") {
    session.stats.turns += 1;
    return session;
  }

  let delta = 0;

  if (evalResult.verdict === "correct") {
    delta += 5;
    session.stats.correct += 1;
  } else if (evalResult.verdict === "incorrect") {
    delta -= 5;
    session.stats.incorrect += 1;
  } else if (evalResult.verdict === "partially-correct") {
    delta += 2;
    session.stats.partial += 1;
  }

  if (evalResult.hint_needed === true) {
    delta -= 3;
    session.stats.hintsUsed += 1;
  }

  // clamp 0..100
  const current = typeof session.score === "number" ? session.score : 50;
  session.score = Math.max(0, Math.min(100, current + delta));
  session.level = computeLevel(session.score);
  session.stats.turns += 1;

  return session;
}

module.exports = { applyScoring, computeLevel };
