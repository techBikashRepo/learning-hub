import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge,
  Modal,
  Alert,
} from "react-bootstrap";
import { Calendar, momentLocalizer } from "react-big-calendar";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

const CalendarView = () => {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Clear any expired token on component mount
    const token = localStorage.getItem("token");
    if (token) {
      try {
        // Check if token is expired (basic check)
        const payload = JSON.parse(atob(token.split(".")[1]));
        const now = Date.now() / 1000;
        if (payload.exp && payload.exp < now) {
          localStorage.removeItem("token");
          setError("Session expired. Please log in again.");
          setTimeout(() => navigate("/login"), 3000);
          return;
        }
      } catch (err) {
        // Invalid token format
        localStorage.removeItem("token");
      }
    }

    fetchStudySessions();
  }, [navigate]);

  const fetchStudySessions = async () => {
    try {
      setLoading(true);
      setError(""); // Clear any previous errors

      // Check if user is logged in
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please log in to view your study sessions.");
        setEvents([]);
        setLoading(false);
        // Auto-redirect to login after 3 seconds
        setTimeout(() => {
          navigate("/login");
        }, 3000);
        return;
      }

      // First test server connectivity
      const healthResponse = await fetch("http://localhost:5000/api/health");
      if (!healthResponse.ok) {
        throw new Error("Server not accessible");
      }

      const apiBaseUrl =
        process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api";
      const response = await fetch(`${apiBaseUrl}/study-sessions`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          setError("Session expired. Please log in again.");
          localStorage.removeItem("token");
          setEvents([]);
          setLoading(false);
          // Auto-redirect to login after 3 seconds
          setTimeout(() => {
            navigate("/login");
          }, 3000);
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const sessions = await response.json();

      // Convert completed study sessions to calendar events
      const sessionEvents = sessions
        .filter((session) => session.endTime) // Only show completed sessions
        .map((session) => {
          const startTime = new Date(session.startTime);
          const endTime = new Date(session.endTime);

          return {
            id: session._id,
            title: `${session.subject} (${Math.floor(session.duration / 60)}h ${
              session.duration % 60
            }m)`,
            start: startTime,
            end: endTime,
            resource: session,
            type: "study-session",
          };
        });

      setEvents(sessionEvents);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching study sessions:", err);
      // Show empty calendar when API fails
      setEvents([]);
      setLoading(false);

      if (
        err.message.includes("fetch") ||
        err.message.includes("not accessible")
      ) {
        setError(
          "Unable to connect to server. Please ensure the backend server is running on port 5000."
        );
      } else {
        setError(`Error loading study sessions: ${err.message}`);
      }
    }
  };

  const handleSelectEvent = (event) => {
    if (event.type === "study-session") {
      setSelectedEvent(event.resource);
      setShowModal(true);
    }
  };

  const eventStyleGetter = (event) => {
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

    let backgroundColor = colors[event.resource?.subject] || "#3174ad";

    return {
      style: {
        backgroundColor,
        borderRadius: "5px",
        opacity: 0.9,
        color: "white",
        border: "0px",
        display: "block",
        fontSize: "12px",
      },
    };
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const CustomToolbar = ({ label, onNavigate, onView }) => (
    <div className="calendar-toolbar d-flex justify-content-between align-items-center mb-3 p-3 bg-light rounded">
      <div className="d-flex align-items-center">
        <Button
          variant="outline-primary"
          size="sm"
          onClick={() => onNavigate("PREV")}
          className="me-2"
        >
          ‹ Prev
        </Button>
        <Button
          variant="primary"
          size="sm"
          onClick={() => onNavigate("TODAY")}
          className="me-2"
        >
          Today
        </Button>
        <Button
          variant="outline-primary"
          size="sm"
          onClick={() => onNavigate("NEXT")}
        >
          Next ›
        </Button>
      </div>
      <h3 className="mb-0 text-center flex-grow-1 fw-bold text-primary">
        {label}
      </h3>
      <div className="d-flex align-items-center gap-1">
        <Button
          variant="outline-secondary"
          size="sm"
          onClick={() => onView("month")}
          className="px-3"
        >
          Month
        </Button>
        <Button
          variant="outline-secondary"
          size="sm"
          onClick={() => onView("week")}
          className="px-3"
        >
          Week
        </Button>
        <Button
          variant="outline-secondary"
          size="sm"
          onClick={() => onView("day")}
          className="px-3"
        >
          Day
        </Button>
      </div>
    </div>
  );

  return (
    <Container fluid>
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 className="mb-0">📅 Study Calendar</h2>
            <div className="d-flex align-items-center gap-2">
              <Badge bg="info" className="px-3 py-2">
                {events.length} Completed Sessions
              </Badge>
              <Button
                variant="outline-primary"
                size="sm"
                onClick={fetchStudySessions}
                className="px-3"
                disabled={loading}
              >
                🔄 Refresh
              </Button>
            </div>
          </div>
          <p className="text-muted mb-0">
            This calendar shows your completed study sessions. Use the Study
            Timer to track new sessions.
          </p>
        </Col>
      </Row>

      {error && (
        <Alert
          variant="danger"
          className="d-flex justify-content-between align-items-center"
        >
          <span>{error}</span>
          {(error.includes("Please log in") ||
            error.includes("Session expired")) && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate("/login")}
              className="ms-2"
            >
              Login Now
            </Button>
          )}
        </Alert>
      )}

      {loading && (
        <Alert variant="info" className="d-flex align-items-center">
          <div className="spinner-border spinner-border-sm me-2" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          Loading study sessions...
        </Alert>
      )}

      <Row>
        <Col>
          <Card>
            <Card.Body style={{ height: "600px" }}>
              <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                onSelectEvent={handleSelectEvent}
                eventPropGetter={eventStyleGetter}
                components={{
                  toolbar: CustomToolbar,
                }}
                views={["month", "week", "day"]}
                defaultView="month"
                popup
                style={{ height: "100%" }}
                min={new Date(0, 0, 0, 0, 0, 0)}
                max={new Date(0, 0, 0, 23, 59, 59)}
                step={60}
                timeslots={1}
                dayPropGetter={(date) => ({
                  className: "",
                  style: {},
                })}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Study Session Details Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Study Session Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedEvent && (
            <div>
              <Row className="mb-3">
                <Col md={6}>
                  <strong>Subject:</strong>
                  <Badge
                    className="ms-2"
                    style={{
                      backgroundColor: eventStyleGetter({
                        resource: selectedEvent,
                      }).style.backgroundColor,
                      color: "white",
                    }}
                  >
                    {selectedEvent.subject}
                  </Badge>
                </Col>
                <Col md={6}>
                  <strong>Duration:</strong>{" "}
                  {formatDuration(selectedEvent.duration)}
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={6}>
                  <strong>Start Time:</strong>
                  <br />
                  {new Date(selectedEvent.startTime).toLocaleString()}
                </Col>
                <Col md={6}>
                  <strong>End Time:</strong>
                  <br />
                  {new Date(selectedEvent.endTime).toLocaleString()}
                </Col>
              </Row>

              {selectedEvent.notes && (
                <Row className="mb-3">
                  <Col>
                    <strong>Notes:</strong>
                    <p className="mt-2 p-3 bg-light rounded">
                      {selectedEvent.notes}
                    </p>
                  </Col>
                </Row>
              )}

              <Row>
                <Col>
                  <div className="text-muted">
                    <small>Session ID: {selectedEvent._id}</small>
                  </div>
                </Col>
              </Row>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default CalendarView;
