// models/progress.js
const mongoose = require("mongoose");

const MilestoneSchema = new mongoose.Schema({
  key: { type: String, required: true },
  title: { type: String, required: true },
  status: { type: String, enum: ["pending", "in_progress", "done"], default: "pending" },
  completedAt: { type: Date, default: null },
  xpAwarded: { type: Number, default: 0 }
}, { _id: false });

const ProgressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  algorithm: { type: String, required: true },
  milestones: [MilestoneSchema],
  isCompleted: { type: Boolean, default: false },
  totalXpFromMilestones: { type: Number, default: 0 },

  // to pace milestones "in between"
  turnsAtStart: { type: Number, default: 0 },
  qualityTurns: { type: Number, default: 0 }, // Only counts turns with good understanding
  
  // Puzzle completion tracking
  completedPuzzles: [{ type: String }], // Array of puzzle IDs (e.g., ["sel_puzzle_1", "sel_puzzle_2"])
  allPuzzlesCompleted: { type: Boolean, default: false },
}, { timestamps: true });

ProgressSchema.index({ userId: 1, algorithm: 1 }, { unique: true });

module.exports = mongoose.model("Progress", ProgressSchema);
