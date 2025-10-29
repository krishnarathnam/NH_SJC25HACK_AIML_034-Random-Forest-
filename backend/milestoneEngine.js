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
  // Use qualityTurns instead of total turns
  // qualityTurns only counts turns where student showed understanding
  return progress.qualityTurns || 0;
}

function evaluateMilestones({ session, progress, algorithm, xpPerMilestone = 100 }) {
  ensureProgressDoc(progress, algorithm);

  const defs = getList(algorithm);
  
  // Find FIRST pending milestone in the CORRECT ORDER (from defs, not from progress doc)
  let firstPendingMilestone = null;
  let firstPendingInProgress = null;
  
  for (const def of defs) {
    const progressMilestone = progress.milestones.find(m => m.key === def.key);
    if (progressMilestone && progressMilestone.status !== "done") {
      firstPendingMilestone = def;
      firstPendingInProgress = progressMilestone;
      break;
    }
  }
  
  if (!firstPendingMilestone) {
    progress.isCompleted = true;
    return { hit: null, xp: 0, percent: 100 };
  }

  const last = lastStudentMessage(session);
  if (!last) return { hit: null, xp: 0, percent: percent(progress, defs) };

  const turns = turnsSinceStart(session, progress);

  // Check ONLY the first pending milestone (in correct order)
  const meetsTurns = !firstPendingMilestone.afterTurnsMin || turns >= firstPendingMilestone.afterTurnsMin;
  const meetsDetect = firstPendingMilestone.detect ? firstPendingMilestone.detect.test(last.content) : false;

  if (meetsTurns && meetsDetect) {
    firstPendingInProgress.status = "done";
    firstPendingInProgress.completedAt = new Date();
    firstPendingInProgress.xpAwarded = xpPerMilestone;

    // recompute overall
    const pr = percent(progress, defs);
    // if all done -> completed
    progress.isCompleted = progress.milestones.every(m => m.status === "done");

    return { hit: firstPendingMilestone, xp: xpPerMilestone, percent: pr };
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
