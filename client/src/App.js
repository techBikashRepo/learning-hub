import React, { useState, useEffect } from "react";
import { Container, Navbar, Nav, Button } from "react-bootstrap";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CalendarView from "./pages/Calendar";
import StudyTimer from "./pages/StudyTimer";
import StudyAnalytics from "./pages/StudyAnalytics";
import "./styles/App.css";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUser(null);
    navigate("/login");
  };
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
              {isAuthenticated ? (
                <>
                  <Nav.Item className="d-flex align-items-center me-3">
                    <div className="d-flex align-items-center">
                      <img
                        src="/images/Bikash_Photo.jpg"
                        alt={`${user?.name || "Bikash Shaw"} Profile`}
                        className="profile-image me-2"
                        onError={(e) => {
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            user?.name || "Bikash Shaw"
                          )}&background=ff6b6b&color=fff&size=40&rounded=true`;
                        }}
                      />
                      <span className="text-light welcome-text">
                        Welcome, {user?.name || "Bikash Shaw"}! 👋
                      </span>
                    </div>
                  </Nav.Item>
                  <Button
                    variant="outline-primary"
                    onClick={handleLogout}
                    className="logout-btn"
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Nav.Link as={Link} to="/login" className="nav-link-custom">
                    Login
                  </Nav.Link>
                  <Nav.Link
                    as={Link}
                    to="/register"
                    className="nav-link-custom"
                  >
                    Register
                  </Nav.Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container className="mt-4">
        <Routes>
          <Route
            path="/login"
            element={
              <Login
                setIsAuthenticated={setIsAuthenticated}
                setUser={setUser}
              />
            }
          />
          <Route
            path="/register"
            element={
              <Register
                setIsAuthenticated={setIsAuthenticated}
                setUser={setUser}
              />
            }
          />
          {isAuthenticated ? (
            <>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/study-timer" element={<StudyTimer />} />
              <Route path="/study-analytics" element={<StudyAnalytics />} />
              <Route path="/calendar" element={<CalendarView />} />
              <Route path="/" element={<Dashboard />} />
            </>
          ) : (
            <Route
              path="*"
              element={
                <Login
                  setIsAuthenticated={setIsAuthenticated}
                  setUser={setUser}
                />
              }
            />
          )}
        </Routes>
      </Container>
    </>
  );
}

export default App;
