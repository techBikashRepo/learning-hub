const mongoose = require("mongoose");
require("dotenv").config();

const User = require("./models/User");

async function createUser() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully");

    // Clear existing users
    await User.deleteMany({});
    console.log("Existing users cleared");

    // Create user with plain password (let the model hash it)
    const user = new User({
      name: "John Doe",
      email: "john@example.com",
      password: "password123", // Plain password - model will hash it
    });

    await user.save();
    console.log("User created successfully:", user.email);

    // Test password comparison
    const isMatch = await user.comparePassword("password123");
    console.log("Password comparison test:", isMatch);

    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

createUser();
