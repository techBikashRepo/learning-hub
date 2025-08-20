const StudySession = require("../models/StudySession");

// Start a study session
const startStudySession = async (req, res) => {
  try {
    const { subject } = req.body;

    // Check if there's already an active session for this user
    const activeSession = await StudySession.findOne({
      user: req.user,
      isActive: true,
    });

    if (activeSession) {
      return res.status(400).json({
        message:
          "You already have an active study session. Please end it first.",
      });
    }

    const studySession = new StudySession({
      user: req.user,
      subject,
      startTime: new Date(),
    });

    await studySession.save();
    res.status(201).json(studySession);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// End a study session
const endStudySession = async (req, res) => {
  try {
    const { sessionId, notes } = req.body;

    const studySession = await StudySession.findOne({
      _id: sessionId,
      user: req.user,
      isActive: true,
    });

    if (!studySession) {
      return res
        .status(404)
        .json({ message: "Active study session not found" });
    }

    studySession.endTime = new Date();
    studySession.notes = notes || "";
    await studySession.save();

    res.json(studySession);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get active study session
const getActiveSession = async (req, res) => {
  try {
    const activeSession = await StudySession.findOne({
      user: req.user,
      isActive: true,
    });

    res.json(activeSession);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all study sessions
const getAllStudySessions = async (req, res) => {
  try {
    const { date, subject } = req.query;
    let query = { user: req.user };

    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);

      query.startTime = {
        $gte: startDate,
        $lt: endDate,
      };
    }

    if (subject) {
      query.subject = subject;
    }

    const sessions = await StudySession.find(query).sort({ startTime: -1 });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get today's learning statistics
const getTodayLearningStats = async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const endOfDay = new Date(startOfDay);
    endOfDay.setDate(endOfDay.getDate() + 1);

    const todaySessions = await StudySession.find({
      user: req.user,
      endTime: { $ne: null },
      startTime: {
        $gte: startOfDay,
        $lt: endOfDay,
      },
    });

    // Calculate total learning time for today
    const totalMinutesToday = todaySessions.reduce((total, session) => {
      return total + (session.duration || 0);
    }, 0);

    // Group by subject for today
    const todaySubjectStats = {};
    todaySessions.forEach((session) => {
      if (!todaySubjectStats[session.subject]) {
        todaySubjectStats[session.subject] = {
          totalMinutes: 0,
          sessionCount: 0,
          sessions: [],
        };
      }
      todaySubjectStats[session.subject].totalMinutes += session.duration;
      todaySubjectStats[session.subject].sessionCount += 1;
      todaySubjectStats[session.subject].sessions.push({
        startTime: session.startTime,
        endTime: session.endTime,
        duration: session.duration,
        notes: session.notes,
      });
    });

    // Format subject breakdown
    const subjectBreakdown = Object.keys(todaySubjectStats).map((subject) => ({
      subject,
      totalMinutes: todaySubjectStats[subject].totalMinutes,
      totalHours:
        Math.round((todaySubjectStats[subject].totalMinutes / 60) * 100) / 100,
      sessionCount: todaySubjectStats[subject].sessionCount,
      sessions: todaySubjectStats[subject].sessions,
    }));

    const response = {
      date: startOfDay.toISOString().split("T")[0],
      totalMinutes: totalMinutesToday,
      totalHours: Math.round((totalMinutesToday / 60) * 100) / 100,
      totalSessions: todaySessions.length,
      subjectBreakdown,
      recentSessions: todaySessions.slice(-5).reverse(), // Last 5 sessions
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get study analytics
const getStudyAnalytics = async (req, res) => {
  try {
    const { period = "week" } = req.query;
    const now = new Date();
    let startDate;

    switch (period) {
      case "today":
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case "week":
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
        break;
      case "month":
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 30);
        break;
      default:
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
    }

    const sessions = await StudySession.find({
      user: req.user,
      endTime: { $ne: null },
      startTime: { $gte: startDate },
    });

    // Group by subject
    const subjectStats = {};
    sessions.forEach((session) => {
      if (!subjectStats[session.subject]) {
        subjectStats[session.subject] = {
          totalMinutes: 0,
          sessionCount: 0,
        };
      }
      subjectStats[session.subject].totalMinutes += session.duration;
      subjectStats[session.subject].sessionCount += 1;
    });

    // Convert to hours and format
    const analytics = Object.keys(subjectStats).map((subject) => ({
      subject,
      totalHours:
        Math.round((subjectStats[subject].totalMinutes / 60) * 100) / 100,
      totalMinutes: subjectStats[subject].totalMinutes,
      sessionCount: subjectStats[subject].sessionCount,
    }));

    res.json({
      period,
      totalSessions: sessions.length,
      totalMinutes: sessions.reduce((sum, s) => sum + s.duration, 0),
      totalHours:
        Math.round(
          (sessions.reduce((sum, s) => sum + s.duration, 0) / 60) * 100
        ) / 100,
      subjectBreakdown: analytics,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get daily study summary
const getDailyStudySummary = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const start = startDate
      ? new Date(startDate)
      : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();

    const sessions = await StudySession.find({
      user: req.user,
      endTime: { $ne: null },
      startTime: { $gte: start, $lte: end },
    });

    // Group by date
    const dailySummary = {};
    sessions.forEach((session) => {
      const dateKey = session.startTime.toISOString().split("T")[0];
      if (!dailySummary[dateKey]) {
        dailySummary[dateKey] = {
          date: dateKey,
          totalMinutes: 0,
          sessions: [],
          subjects: {},
        };
      }

      dailySummary[dateKey].totalMinutes += session.duration;
      dailySummary[dateKey].sessions.push({
        subject: session.subject,
        duration: session.duration,
        startTime: session.startTime,
        endTime: session.endTime,
      });

      if (!dailySummary[dateKey].subjects[session.subject]) {
        dailySummary[dateKey].subjects[session.subject] = 0;
      }
      dailySummary[dateKey].subjects[session.subject] += session.duration;
    });

    res.json(
      Object.values(dailySummary).sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      )
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a study session
const deleteStudySession = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const studySession = await StudySession.findOne({
      _id: sessionId,
      user: req.user,
    });

    if (!studySession) {
      return res.status(404).json({ message: "Study session not found" });
    }

    await StudySession.findByIdAndDelete(sessionId);
    res.json({ message: "Study session deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  startStudySession,
  endStudySession,
  getActiveSession,
  getAllStudySessions,
  getStudyAnalytics,
  getDailyStudySummary,
  getTodayLearningStats,
  deleteStudySession,
};
