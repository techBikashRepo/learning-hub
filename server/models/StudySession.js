const mongoose = require("mongoose");

const StudySessionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  subject: {
    type: String,
    required: true,
    enum: [
      "AWS",
      "System Design",
      "DSA",
      "Docker",
      "AWS Revision",
      "System Design Revision",
      "DSA Revision",
      "Docker Revision",
    ],
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    default: null,
  },
  duration: {
    type: Number, // in minutes
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  notes: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Calculate duration before saving
StudySessionSchema.pre("save", function (next) {
  if (this.endTime && this.startTime) {
    this.duration = Math.round((this.endTime - this.startTime) / (1000 * 60)); // Convert to minutes
    this.isActive = false;
  }
  next();
});

module.exports = mongoose.model("StudySession", StudySessionSchema);
