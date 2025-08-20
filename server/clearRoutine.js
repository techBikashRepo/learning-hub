const mongoose = require("mongoose");
require("dotenv").config();

const User = require("./models/User");
const Goal = require("./models/Goal");
const Session = require("./models/Session");

async function clearExistingRoutine() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully");

    // Find the user
    const user = await User.findOne({ email: "john@example.com" });
    if (!user) {
      console.error("User not found");
      process.exit(1);
    }

    // Clear existing goals and sessions
    await Goal.deleteMany({ user: user._id });
    await Session.deleteMany({ user: user._id });
    console.log("Existing routine cleared successfully");

    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

clearExistingRoutine();
