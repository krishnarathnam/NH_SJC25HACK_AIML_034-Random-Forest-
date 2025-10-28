// server/milestoneEngine.js
const REGISTRY = require('./milestones');

function getList(algorithm) {
  return REGISTRY[algorithm] || [];
}

function ensureProgressDoc(progressDoc, algorithm) {
  // Make sure milestones array is initialized from registry
  if (!progressDoc.milestones || progressDoc.milestones.length === 0) {
    const defs = getList(algorithm);
    progressDoc.milestones = defs.map(d => ({
      key: d.key,
      title: d.title,
      status: "pending",
      completedAt: null,
      xpAwarded: 0
    }));
  }
}

function lastStudentMessage(session) {
  return [...session.messages].reverse().find(m => m.role === "student");
}

function turnsSinceStart(session, progress) {
  const base = progress.turnsAtStart || 0;
  return Math.max(0, session.messages.length - base);
}

function evaluateMilestones({ session, progress, algorithm, xpPerMilestone = 100 }) {
  ensureProgressDoc(progress, algorithm);

  const defs = getList(algorithm);
  const pending = progress.milestones.filter(m => m.status !== "done");
  if (pending.length === 0) {
    progress.isCompleted = true;
    return { hit: null, xp: 0, percent: 100 };
  }

  const last = lastStudentMessage(session);
  if (!last) return { hit: null, xp: 0, percent: percent(progress, defs) };

  const turns = turnsSinceStart(session, progress);

  // Check first eligible match (one per turn)
  for (const p of pending) {
    const def = defs.find(d => d.key === p.key);
    if (!def) continue;

    const meetsTurns = !def.afterTurnsMin || turns >= def.afterTurnsMin;
    const meetsDetect = def.detect ? def.detect.test(last.content) : false;

    if (meetsTurns && meetsDetect) {
      p.status = "done";
      p.completedAt = new Date();
      p.xpAwarded = xpPerMilestone;

      // recompute overall
      const pr = percent(progress, defs);
      // if all done -> completed
      progress.isCompleted = progress.milestones.every(m => m.status === "done");

      return { hit: def, xp: xpPerMilestone, percent: pr };
    }
  }

  return { hit: null, xp: 0, percent: percent(progress, defs) };
}

function percent(progress, defs) {
  const total = Math.max(1, defs.length);
  const done = progress.milestones.filter(m => m.status === "done").length;
  return Math.round((done / total) * 100);
}

module.exports = {
  evaluateMilestones,
  percent
};
