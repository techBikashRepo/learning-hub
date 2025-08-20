require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/routein-db";

// Start server immediately
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.get("/", (req, res) => {
  res.send("Learning Tracker Pro API");
});

// MongoDB connection (non-blocking)
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    loadRoutes();
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    console.log("Starting without MongoDB - limited functionality");
    loadFallbackRoutes();
  });

function loadRoutes() {
  try {
    // Routes
    app.use("/api/auth", require("./routes/auth"));
    app.use("/api/study-sessions", require("./routes/studySessions"));
    console.log("All routes loaded successfully");
  } catch (error) {
    console.error("Error loading routes:", error);
    loadFallbackRoutes();
  }
}

function loadFallbackRoutes() {
  // Fallback routes when MongoDB is not available
  app.post("/api/seed/seed", (req, res) => {
    res.status(500).json({
      success: false,
      message:
        "MongoDB is not available. Please install MongoDB or use MongoDB Atlas.",
      error: "Database connection failed",
    });
  });

  app.get("/api/*", (req, res) => {
    res.status(503).json({
      success: false,
      message: "Database service unavailable",
      error: "MongoDB connection required",
    });
  });
}
