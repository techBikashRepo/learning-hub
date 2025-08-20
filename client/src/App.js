import React from "react";
import { Container, Navbar, Nav } from "react-bootstrap";
import { Routes, Route, Link } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import StudyCalendar from "./pages/StudyCalendar";
import StudyTimer from "./pages/StudyTimer";
import StudyAnalytics from "./pages/StudyAnalytics";
import "./styles/App.css";

function App() {
  return (
    <>
      <Navbar className="custom-navbar" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand as={Link} to="/" className="brand-logo">
            🚀 ClimbUp Learning
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/dashboard" className="nav-link-custom">
                Dashboard
              </Nav.Link>
              <Nav.Link as={Link} to="/study-timer" className="nav-link-custom">
                Study Timer
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/study-analytics"
                className="nav-link-custom"
              >
                Analytics
              </Nav.Link>
              <Nav.Link as={Link} to="/calendar" className="nav-link-custom">
                Calendar
              </Nav.Link>
            </Nav>
            <Nav>
              <Nav.Link as={Link} to="/login" className="nav-link-custom">
                Login
              </Nav.Link>
              <Nav.Link as={Link} to="/register" className="nav-link-custom">
                Register
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container className="mt-4">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/study-timer" element={<StudyTimer />} />
          <Route path="/study-analytics" element={<StudyAnalytics />} />
          <Route path="/calendar" element={<StudyCalendar />} />
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </Container>
    </>
  );
}

export default App;
