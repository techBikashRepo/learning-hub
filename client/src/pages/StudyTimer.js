import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Modal,
  Form,
  Alert,
  Badge,
  Spinner,
  ProgressBar,
} from "react-bootstrap";
import {
  Clock,
  Play,
  Square,
  BookOpen,
  Target,
  TrendingUp,
} from "lucide-react";
import "../styles/App.css";

const studySubjects = [
  { name: "AWS", color: "#FF6B6B", icon: "☁️", target: 120 },
  { name: "System Design", color: "#4ECDC4", icon: "🏗️", target: 90 },
  { name: "DSA", color: "#45B7D1", icon: "🧮", target: 150 },
  { name: "Docker", color: "#96CEB4", icon: "🐳", target: 60 },
  { name: "AWS Revision", color: "#FECA57", icon: "☁️📚", target: 60 },
  {
    name: "System Design Revision",
    color: "#FF9FF3",
    icon: "🏗️📚",
    target: 45,
  },
  { name: "DSA Revision", color: "#54A0FF", icon: "🧮📚", target: 75 },
  { name: "Docker Revision", color: "#5F27CD", icon: "🐳📚", target: 30 },
];

const StudyTimer = () => {
  const [activeSession, setActiveSession] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showEndModal, setShowEndModal] = useState(false);
  const [notes, setNotes] = useState("");
  const [timer, setTimer] = useState(0);
  const [timerInterval, setTimerInterval] = useState(null);
  const [todayStats, setTodayStats] = useState(null);
  const [weeklyProgress, setWeeklyProgress] = useState({});
  const [streakCount, setStreakCount] = useState(0);

  useEffect(() => {
    checkActiveSession();
    fetchTodayStats();
    fetchWeeklyProgress();
    calculateStreak();
  }, []);

  useEffect(() => {
    if (activeSession) {
      const startTime = new Date(activeSession.startTime);
      const interval = setInterval(() => {
        const now = new Date();
        const elapsed = Math.floor((now - startTime) / 1000);
        setTimer(elapsed);
      }, 1000);
      setTimerInterval(interval);

      return () => clearInterval(interval);
    } else {
      if (timerInterval) {
        clearInterval(timerInterval);
        setTimerInterval(null);
      }
      setTimer(0);
    }
  }, [activeSession]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  const checkActiveSession = async () => {
    try {
      const response = await fetch("/api/study-sessions/active", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      setActiveSession(data);
    } catch (err) {
      console.error("Error checking active session:", err);
    }
  };

  const startSession = async (subject) => {
    if (activeSession) {
      setError("Please end your current session before starting a new one.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/study-sessions/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ subject }),
      });

      const data = await response.json();
      if (response.ok) {
        setActiveSession(data);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Failed to start study session");
    } finally {
      setLoading(false);
    }
  };

  const endSession = async () => {
    if (!activeSession) return;

    setLoading(true);
    try {
      const response = await fetch("/api/study-sessions/end", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          sessionId: activeSession._id,
          notes,
        }),
      });

      if (response.ok) {
        setActiveSession(null);
        setShowEndModal(false);
        setNotes("");
        setTimer(0);
      } else {
        const data = await response.json();
        setError(data.message);
      }
    } catch (err) {
      setError("Failed to end study session");
    } finally {
      setLoading(false);
    }
  };

  const fetchTodayStats = async () => {
    try {
      const response = await fetch(
        "/api/study-sessions/analytics?period=today",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setTodayStats(data);
      }
    } catch (err) {
      console.error("Failed to fetch today's stats:", err);
    }
  };

  const fetchWeeklyProgress = async () => {
    try {
      const response = await fetch("/api/study-sessions", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.ok) {
        const sessions = await response.json();
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);

        const weekSessions = sessions.filter(
          (session) => new Date(session.startTime) > weekAgo && session.endTime
        );

        const progress = {};
        studySubjects.forEach((subject) => {
          const subjectSessions = weekSessions.filter(
            (s) => s.subject === subject.name
          );
          const totalMinutes = subjectSessions.reduce(
            (sum, s) => sum + s.duration,
            0
          );
          progress[subject.name] = {
            completed: totalMinutes,
            target: subject.target * 7, // Weekly target
            percentage: Math.min(
              100,
              (totalMinutes / (subject.target * 7)) * 100
            ),
          };
        });

        setWeeklyProgress(progress);
      }
    } catch (err) {
      console.error("Failed to fetch weekly progress:", err);
    }
  };

  const calculateStreak = async () => {
    try {
      const response = await fetch("/api/study-sessions/daily-summary", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.ok) {
        const dailyData = await response.json();
        let streak = 0;
        const today = new Date().toISOString().split("T")[0];

        for (let i = 0; i < dailyData.length; i++) {
          const date = dailyData[i].date;
          if (dailyData[i].totalMinutes > 0) {
            if (i === 0 && date === today) {
              streak++;
            } else if (i > 0) {
              const prevDate = new Date(dailyData[i - 1].date);
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

        setStreakCount(streak);
      }
    } catch (err) {
      console.error("Failed to calculate streak:", err);
    }
  };

  const getWeeklySchedule = () => {
    const schedule = {
      Monday: ["AWS (2h)", "System Design (1h)"],
      Tuesday: ["AWS (2h)", "DSA (1h)"],
      Wednesday: ["AWS (2h)", "System Design (1h)"],
      Thursday: ["AWS (2h)", "Docker (1h)"],
      Friday: ["AWS (2h)", "DSA (1h)"],
      Saturday: ["AWS Revision (2h)", "DSA Revision (1h)", "Docker (1h)"],
      Sunday: [
        "AWS Revision (2h)",
        "DSA Revision (1h)",
        "Docker Revision (1h)",
      ],
    };
    return schedule;
  };

  return (
    <div className="study-timer-container fade-in-up">
      {error && <Alert variant="danger">{error}</Alert>}

      {activeSession ? (
        <Card className="active-session-card text-center">
          <Card.Body>
            <h2 className="mb-3">
              <Clock className="me-2" />
              Studying: {activeSession.subject}
            </h2>
            <div className="timer-display mb-4">{formatTime(timer)}</div>
            <Button
              variant="light"
              size="lg"
              onClick={() => setShowEndModal(true)}
              disabled={loading}
            >
              <Square className="me-2" />
              End Session
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <div>
          <h2 className="text-center mb-4">Choose a Subject to Begin</h2>
          <Row>
            {studySubjects.map((subject) => (
              <Col md={6} lg={3} className="mb-4" key={subject.name}>
                <Card
                  className={`subject-card h-100 ${loading ? "disabled" : ""}`}
                  onClick={() => !loading && startSession(subject.name)}
                >
                  <Card.Body>
                    <div className="subject-icon mb-3">{subject.icon}</div>
                    <h5>{subject.name}</h5>
                    <p className="text-muted">
                      Target: {subject.target} min/day
                    </p>
                    <Button
                      variant="primary"
                      className="mt-auto"
                      disabled={loading}
                    >
                      <Play className="me-1" size={16} />
                      Start
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      )}

      {/* End Session Modal */}
      <Modal show={showEndModal} onHide={() => setShowEndModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>End Study Session</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            You studied <strong>{activeSession?.subject}</strong> for{" "}
            <strong>{formatTime(timer)}</strong>.
          </p>
          <Form.Group>
            <Form.Label>Add notes about your session:</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g., 'Finished chapter 3 of AWS course.'"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEndModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={endSession} disabled={loading}>
            {loading ? <Spinner as="span" size="sm" className="me-2" /> : null}
            Confirm & End
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default StudyTimer;
