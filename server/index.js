require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// CORS configuration for production
const corsOptions = {
  origin: [
    "http://localhost:3000", // Development
    "https://your-app-name.vercel.app", // Production - Update this after Vercel deployment
    /\.vercel\.app$/ // Allow all Vercel apps during development
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
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

app.get("/api/health", (req, res) => {
  res.json({ status: "Server is running", timestamp: new Date() });
});

// MongoDB connection (non-blocking)
mongoose
  .connect(MONGO_URI)
  .then(() => {
    loadRoutes();
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    loadFallbackRoutes();
  });

function loadRoutes() {
  try {
    // Routes
    app.use("/api/auth", require("./routes/auth"));
    app.use("/api/study-sessions", require("./routes/studySessions"));
  } catch (error) {
    console.error("Error loading routes:", error);
    loadFallbackRoutes();
  }
}

function loadFallbackRoutes() {
  try {
    // Load auth routes with mock functionality
    app.use("/api/auth", require("./routes/auth"));
  } catch (authError) {
    console.error("Error loading auth routes:", authError);
  }

  // Fallback routes when MongoDB is not available
  app.post("/api/seed/seed", (req, res) => {
    res.status(500).json({
      success: false,
      message:
        "MongoDB is not available. Please install MongoDB or use MongoDB Atlas.",
      error: "Database connection failed",
    });
  });

  app.get("/api/study-sessions/*", (req, res) => {
    res.status(503).json({
      success: false,
      message: "Study sessions require database connection",
      error: "MongoDB connection required",
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
