// models/sessions.js
const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  role: { type: String, enum: ["student", "assistant"], required: true },
  content: { type: String, required: true },
  content_en: { type: String },
  content_kn: { type: String },
  ts: { type: Date, default: Date.now }
}, { _id: false });

const SessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  contextId: { type: String, required: true }, // e.g., "algo:Selection Sort"
  algorithm: { type: String, default: "" },

  score: { type: Number, default: 50 },
  level: { type: String, enum: ["beginner","intermediate","advanced"], default: "intermediate" },

  stats: {
    correct: { type: Number, default: 0 },
    incorrect: { type: Number, default: 0 },
    partial: { type: Number, default: 0 },
    hintsUsed: { type: Number, default: 0 },
    turns: { type: Number, default: 0 }
  },

  xp: { type: Number, default: 0 },
  xpLevel: { type: Number, default: 1 },

  messages: [MessageSchema],
}, { timestamps: true });

SessionSchema.index({ userId: 1, contextId: 1 }, { unique: true });

module.exports = mongoose.model("Session", SessionSchema);
