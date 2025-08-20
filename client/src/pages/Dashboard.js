import React, { useState, useEffect } from "react";
import { Row, Col, Card, Badge, Button, Modal } from "react-bootstrap";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Clock,
  TrendingUp,
  Calendar,
  Trash2,
  Timer,
  Trophy,
} from "lucide-react";

const Dashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [dailySummary, setDailySummary] = useState([]);
  const [recentSessions, setRecentSessions] = useState([]);
  const [todayStats, setTodayStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingSessionId, setDeletingSessionId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState(null);

  const COLORS = [
    "#ff6b6b",
    "#54a0ff",
    "#5f27cd",
    "#00d2d3",
    "#ff9ff3",
    "#ff3838",
    "#dda0dd",
    "#ffa502",
  ];

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please log in to view your dashboard");
        return;
      }

      // Fetch today's learning stats
      const todayResponse = await fetch("/api/study-sessions/today", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (todayResponse.ok) {
        const todayData = await todayResponse.json();
        setTodayStats(todayData);
      }

      // Fetch analytics data
      const analyticsResponse = await fetch(
        "/api/study-sessions/analytics?period=week",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (analyticsResponse.ok) {
        const analyticsData = await analyticsResponse.json();
        setAnalytics(analyticsData);
      }

      // Fetch daily summary
      const summaryResponse = await fetch("/api/study-sessions/daily-summary", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (summaryResponse.ok) {
        const summaryData = await summaryResponse.json();
        setDailySummary(summaryData.slice(0, 7)); // Last 7 days
      }

      // Fetch recent sessions
      const sessionsResponse = await fetch("/api/study-sessions", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (sessionsResponse.ok) {
        const sessionsData = await sessionsResponse.json();
        setRecentSessions(sessionsData.filter((s) => s.endTime).slice(0, 5));
      }
    } catch (err) {
      setError("Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const calculateStreak = () => {
    let streak = 0;
    const today = new Date().toISOString().split("T")[0];

    for (let i = 0; i < dailySummary.length; i++) {
      const date = dailySummary[i].date;
      if (dailySummary[i].totalMinutes > 0) {
        if (i === 0 && date === today) {
          streak++;
        } else if (i > 0) {
          const prevDate = new Date(dailySummary[i - 1].date);
          const currentDate = new Date(date);
          const dayDiff = (prevDate - currentDate) / (1000 * 60 * 60 * 24);

          if (dayDiff === 1) {
            streak++;
          } else {
            break;
          }
        }
      } else {
        break;
      }
    }

    return streak;
  };

  const getMotivationalMessage = () => {
    const totalHours = analytics?.totalHours || 0;
    const streak = calculateStreak();

    if (streak >= 7)
      return "🔥 Amazing! You're on fire with your study streak!";
    if (streak >= 3) return "⭐ Great job maintaining your study habit!";
    if (totalHours >= 5) return "💪 Excellent progress this week!";
    if (totalHours >= 2) return "👍 Good work! Keep up the momentum!";
    return "🚀 Ready to start your learning journey today?";
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const deleteSession = async (sessionId) => {
    try {
      setDeletingSessionId(sessionId);
      const token = localStorage.getItem("token");

      const response = await fetch(`/api/study-sessions/${sessionId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        // Remove the session from the local state
        setRecentSessions((prev) =>
          prev.filter((session) => session._id !== sessionId)
        );
        // Refresh the analytics data since a session was deleted
        fetchDashboardData();
        setShowDeleteModal(false);
        setSessionToDelete(null);
      } else {
        setError("Failed to delete study session");
      }
    } catch (err) {
      setError("Failed to delete study session");
    } finally {
      setDeletingSessionId(null);
    }
  };

  const handleDeleteClick = (session) => {
    setSessionToDelete(session);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (sessionToDelete) {
      deleteSession(sessionToDelete._id);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container" style={{ padding: "3rem 0" }}>
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container" style={{ padding: "3rem 0" }}>
        <div className="alert alert-danger text-center">{error}</div>
      </div>
    );
  }

  const pieData =
    analytics?.subjectBreakdown?.map((item, index) => ({
      name: item.subject,
      value: item.totalMinutes,
      color: COLORS[index % COLORS.length],
    })) || [];

  const chartData = dailySummary
    .map((day) => ({
      date: formatDate(day.date),
      minutes: day.totalMinutes,
      hours: Math.round((day.totalMinutes / 60) * 10) / 10,
    }))
    .reverse();
  return (
    <div className="dashboard-container fade-in-up">
      {/* Hero Header */}
      <div className="dashboard-hero">
        <div>
          <div className="dashboard-title">Learning Hub</div>
          <div className="dashboard-subtitle">{getMotivationalMessage()}</div>
        </div>
        <div className="dashboard-date">
          <Calendar className="me-2" size={20} />
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>

      {/* Stat Cards */}
      <Row className="mb-4">
        <Col md={4}>
          <div className="stat-card">
            <div className="icon">
              <Timer />
            </div>
            <div className="stat-number">{todayStats?.totalHours || 0}h</div>
            <div className="stat-label">Today</div>
          </div>
        </Col>
        <Col md={4}>
          <div className="stat-card">
            <div className="icon">
              <TrendingUp />
            </div>
            <div className="stat-number">{analytics?.totalHours || 0}h</div>
            <div className="stat-label">This Week</div>
          </div>
        </Col>
        <Col md={4}>
          <div className="stat-card">
            <div className="icon">
              <Trophy />
            </div>
            <div className="stat-number">{calculateStreak()}</div>
            <div className="stat-label">Day Streak</div>
          </div>
        </Col>
      </Row>

      {/* Charts */}
      <Row className="mb-4">
        <Col lg={8} className="mb-4">
          <Card>
            <Card.Header>
              <h5>
                <TrendingUp className="me-2" />
                Daily Study Progress
              </h5>
            </Card.Header>
            <Card.Body>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => [
                      `${formatDuration(value)}`,
                      "Study Time",
                    ]}
                  />
                  <defs>
                    <linearGradient
                      id="colorGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor={COLORS[0]}
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor={COLORS[0]}
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="minutes"
                    stroke={COLORS[0]}
                    fill="url(#colorGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4} className="mb-4">
          <Card>
            <Card.Header>
              <h5>Subject Distribution</h5>
            </Card.Header>
            <Card.Body>
              {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="value"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value, name) => [
                        `${formatDuration(value)}`,
                        name,
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center text-muted mt-5">
                  <Calendar size={48} />
                  <p className="mt-3">No data to display</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Sessions */}
      <div className="session-list">
        {recentSessions.length > 0 ? (
          recentSessions.map((session) => (
            <div className="session-card" key={session._id}>
              <div className="session-info">
                <div>
                  <Badge bg="light" text="dark">
                    {session.subject}
                  </Badge>
                  <span style={{ marginLeft: 12, color: "#64748b" }}>
                    {formatDuration(session.duration)}
                  </span>
                </div>
                <div style={{ fontSize: "0.95rem", color: "#64748b" }}>
                  {new Date(session.startTime).toLocaleDateString()}
                  {session.notes && (
                    <span style={{ marginLeft: 8, color: "#6366f1" }}>
                      •{" "}
                      {session.notes.length > 30
                        ? `${session.notes.substring(0, 30)}...`
                        : session.notes}
                    </span>
                  )}
                </div>
              </div>
              <div className="session-actions">
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => handleDeleteClick(session)}
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-muted py-4">
            <Clock size={48} />
            <p className="mt-3">No recent sessions</p>
            <Button variant="primary" href="/study-timer">
              Start Studying
            </Button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this study session? This action cannot
          be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Dashboard;
