// Quick test to create user and test study session API
const mongoose = require("mongoose");
require("dotenv").config();

const User = require("./models/User");

async function testAPI() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Ensure user exists
    let user = await User.findOne({ email: "john@example.com" });
    if (!user) {
      user = new User({
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
      });
      await user.save();
      console.log("User created");
    } else {
      console.log("User already exists");
    }

    // Test password
    const isMatch = await user.comparePassword("password123");
    console.log("Password test:", isMatch);

    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

testAPI();
