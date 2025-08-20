import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  ButtonGroup,
  Table,
  Badge,
  Spinner,
  Alert,
  ProgressBar,
} from "react-bootstrap";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts";
import { TrendingUp, Clock, Calendar, Target, Award, Zap } from "lucide-react";

const StudyAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [dailySummary, setDailySummary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [period, setPeriod] = useState("week");

  const colors = {
    AWS: "#FF6B6B",
    "System Design": "#4ECDC4",
    DSA: "#45B7D1",
    Docker: "#96CEB4",
    "AWS Revision": "#FECA57",
    "System Design Revision": "#FF9FF3",
    "DSA Revision": "#54A0FF",
    "Docker Revision": "#5F27CD",
  };

  useEffect(() => {
    fetchAnalytics();
    fetchDailySummary();
  }, [period]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/study-sessions/analytics?period=${period}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await response.json();
      setAnalytics(data);
    } catch (err) {
      setError("Failed to fetch analytics");
    } finally {
      setLoading(false);
    }
  };

  const fetchDailySummary = async () => {
    try {
      const endDate = new Date();
      const startDate = new Date();

      if (period === "today") {
        startDate.setDate(endDate.getDate());
      } else if (period === "week") {
        startDate.setDate(endDate.getDate() - 7);
      } else {
        startDate.setDate(endDate.getDate() - 30);
      }

      const response = await fetch(
        `/api/study-sessions/daily-summary?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await response.json();
      setDailySummary(data);
    } catch (err) {
      console.error("Failed to fetch daily summary:", err);
    }
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const getPeriodText = () => {
    switch (period) {
      case "today":
        return "Today";
      case "week":
        return "This Week";
      case "month":
        return "This Month";
      default:
        return "This Week";
    }
  };

  if (loading) {
    return (
      <Container className="mt-4 text-center">
        <Spinner animation="border" />
        <p className="mt-2">Loading analytics...</p>
      </Container>
    );
  }

  const chartData =
    analytics?.subjectBreakdown?.map((item) => ({
      subject: item.subject,
      hours: item.totalHours,
      minutes: item.totalMinutes,
    })) || [];

  const pieData =
    analytics?.subjectBreakdown?.map((item) => ({
      name: item.subject,
      value: item.totalMinutes,
      color: colors[item.subject] || "#8884d8",
    })) || [];

  return (
    <Container className="mt-4">
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <h2>
              <TrendingUp className="me-2" />
              Study Analytics
            </h2>
            <ButtonGroup>
              <Button
                variant={period === "today" ? "primary" : "outline-primary"}
                onClick={() => setPeriod("today")}
              >
                Today
              </Button>
              <Button
                variant={period === "week" ? "primary" : "outline-primary"}
                onClick={() => setPeriod("week")}
              >
                Week
              </Button>
              <Button
                variant={period === "month" ? "primary" : "outline-primary"}
                onClick={() => setPeriod("month")}
              >
                Month
              </Button>
            </ButtonGroup>
          </div>
          {error && (
            <Alert variant="danger" className="mt-3">
              {error}
            </Alert>
          )}
        </Col>
      </Row>

      {/* Overview Cards */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <Clock className="mb-2 text-primary" size={32} />
              <h4 className="text-primary">{analytics?.totalHours || 0}h</h4>
              <small className="text-muted">Total Study Time</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <Calendar className="mb-2 text-success" size={32} />
              <h4 className="text-success">{analytics?.totalSessions || 0}</h4>
              <small className="text-muted">Study Sessions</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <TrendingUp className="mb-2 text-warning" size={32} />
              <h4 className="text-warning">
                {analytics?.totalSessions > 0
                  ? Math.round(analytics.totalMinutes / analytics.totalSessions)
                  : 0}
                m
              </h4>
              <small className="text-muted">Avg Session</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <div className="mb-2 text-info" style={{ fontSize: "32px" }}>
                📚
              </div>
              <h4 className="text-info">
                {analytics?.subjectBreakdown?.length || 0}
              </h4>
              <small className="text-muted">Subjects Studied</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Charts */}
      <Row className="mb-4">
        <Col md={8}>
          <Card>
            <Card.Header>
              <h5>Study Time by Subject - {getPeriodText()}</h5>
            </Card.Header>
            <Card.Body>
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="subject"
                      angle={-45}
                      textAnchor="end"
                      height={100}
                      interval={0}
                    />
                    <YAxis />
                    <Tooltip
                      formatter={(value, name) => [
                        `${value} hours`,
                        "Study Time",
                      ]}
                    />
                    <Bar dataKey="hours" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center py-5">
                  <p>
                    No study data available for {getPeriodText().toLowerCase()}
                  </p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Header>
              <h5>Study Distribution</h5>
            </Card.Header>
            <Card.Body>
              {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => [
                        formatDuration(value),
                        "Study Time",
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center py-5">
                  <p>No data to display</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Subject Breakdown Table */}
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Header>
              <h5>Subject Breakdown - {getPeriodText()}</h5>
            </Card.Header>
            <Card.Body>
              {analytics?.subjectBreakdown?.length > 0 ? (
                <Table responsive striped>
                  <thead>
                    <tr>
                      <th>Subject</th>
                      <th>Total Time</th>
                      <th>Sessions</th>
                      <th>Avg Session</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics.subjectBreakdown.map((subject, index) => (
                      <tr key={index}>
                        <td>
                          <Badge
                            bg="light"
                            text="dark"
                            style={{
                              backgroundColor:
                                colors[subject.subject] || "#6c757d",
                              color: "white",
                            }}
                            className="me-2"
                          >
                            {subject.subject}
                          </Badge>
                        </td>
                        <td>
                          {subject.totalHours}h ({subject.totalMinutes}m)
                        </td>
                        <td>{subject.sessionCount}</td>
                        <td>
                          {subject.sessionCount > 0
                            ? formatDuration(
                                Math.round(
                                  subject.totalMinutes / subject.sessionCount
                                )
                              )
                            : "0m"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <div className="text-center py-4">
                  <p>
                    No study sessions recorded for{" "}
                    {getPeriodText().toLowerCase()}
                  </p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Daily Summary */}
      <Row>
        <Col>
          <Card>
            <Card.Header>
              <h5>Daily Study Summary</h5>
            </Card.Header>
            <Card.Body>
              {dailySummary.length > 0 ? (
                <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                  {dailySummary.map((day, index) => (
                    <Card key={index} className="mb-3">
                      <Card.Body>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <strong>
                            {new Date(day.date).toLocaleDateString()}
                          </strong>
                          <Badge bg="primary">
                            {formatDuration(day.totalMinutes)}
                          </Badge>
                        </div>
                        <div className="d-flex flex-wrap gap-1">
                          {Object.entries(day.subjects).map(
                            ([subject, minutes]) => (
                              <Badge
                                key={subject}
                                style={{
                                  backgroundColor: colors[subject] || "#6c757d",
                                  color: "white",
                                }}
                              >
                                {subject}: {formatDuration(minutes)}
                              </Badge>
                            )
                          )}
                        </div>
                      </Card.Body>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p>No daily summaries available</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default StudyAnalytics;
