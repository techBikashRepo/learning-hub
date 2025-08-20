const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  startStudySession,
  endStudySession,
  getActiveSession,
  getAllStudySessions,
  getStudyAnalytics,
  getDailyStudySummary,
  getTodayLearningStats,
  deleteStudySession,
} = require("../controllers/studySessionController");

// @route   POST /api/study-sessions/start
// @desc    Start a study session
// @access  Private
router.post("/start", auth, startStudySession);

// @route   POST /api/study-sessions/end
// @desc    End a study session
// @access  Private
router.post("/end", auth, endStudySession);

// @route   GET /api/study-sessions/active
// @desc    Get active study session
// @access  Private
router.get("/active", auth, getActiveSession);

// @route   GET /api/study-sessions
// @desc    Get all study sessions
// @access  Private
router.get("/", auth, getAllStudySessions);

// @route   GET /api/study-sessions/analytics
// @desc    Get study analytics
// @access  Private
router.get("/analytics", auth, getStudyAnalytics);

// @route   GET /api/study-sessions/daily-summary
// @desc    Get daily study summary
// @access  Private
router.get("/daily-summary", auth, getDailyStudySummary);

// @route   GET /api/study-sessions/today
// @desc    Get today's learning statistics
// @access  Private
router.get("/today", auth, getTodayLearningStats);

// @route   DELETE /api/study-sessions/:sessionId
// @desc    Delete a study session
// @access  Private
router.delete("/:sessionId", auth, deleteStudySession);

module.exports = router;
