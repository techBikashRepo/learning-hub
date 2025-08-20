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
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

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

const CalendarView = () => {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStudySessions();
  }, []);

  const fetchStudySessions = async () => {
    try {
      const response = await fetch("/api/study-sessions", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
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
    } catch (err) {
      setError("Failed to fetch study sessions");
      console.error("Error fetching study sessions:", err);
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
    <div className="d-flex justify-content-between align-items-center mb-3">
      <div>
        <Button
          variant="outline-primary"
          size="sm"
          onClick={() => onNavigate("PREV")}
          className="me-2"
        >
          ‹ Prev
        </Button>
        <Button
          variant="outline-primary"
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
      <h4 className="mb-0">{label}</h4>
      <div>
        <Button
          variant="outline-secondary"
          size="sm"
          onClick={() => onView("month")}
          className="me-2"
        >
          Month
        </Button>
        <Button
          variant="outline-secondary"
          size="sm"
          onClick={() => onView("week")}
          className="me-2"
        >
          Week
        </Button>
        <Button
          variant="outline-secondary"
          size="sm"
          onClick={() => onView("day")}
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
          <div className="d-flex justify-content-between align-items-center">
            <h2>📅 Study Calendar</h2>
            <div>
              <Badge bg="info" className="me-2">
                Completed Study Sessions
              </Badge>
              <Button
                variant="outline-primary"
                size="sm"
                onClick={fetchStudySessions}
              >
                Refresh
              </Button>
            </div>
          </div>
          <p className="text-muted">
            This calendar shows your completed study sessions. Use the Study
            Timer to track new sessions.
          </p>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}

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
