console.log("Starting seed script...");

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Load environment variables
require("dotenv").config();
console.log("Environment loaded");

// Import models
const User = require("./models/User");
const Goal = require("./models/Goal");
const Session = require("./models/Session");
const Milestone = require("./models/Milestone");

console.log("Models imported");

async function connectDB() {
  try {
    console.log("Attempting to connect to:", process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully");
    return true;
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    return false;
  }
}

async function seedDatabase() {
  console.log("Starting database seeding...");

  try {
    // Clear existing data
    console.log("Clearing existing data...");
    await User.deleteMany({});
    await Goal.deleteMany({});
    await Session.deleteMany({});
    await Milestone.deleteMany({});
    console.log("Existing data cleared");

    // Create sample user
    console.log("Creating sample user...");
    const hashedPassword = await bcrypt.hash("password123", 10);
    const user = await User.create({
      name: "John Doe",
      email: "john@example.com",
      password: hashedPassword,
    });
    console.log("User created:", user.email);

    // Create sample goals
    console.log("Creating sample goals...");
    const goalData = [
      {
        user: user._id,
        title: "AWS Solutions Architect Certification",
        category: "AWS",
        description: "Complete AWS SAA-C03 certification preparation",
        targetDate: new Date("2025-12-31"),
        targetStudyTime: 12000,
        status: "active",
        priority: "high",
        progress: 35,
      },
      {
        user: user._id,
        title: "Master System Design Patterns",
        category: "System Design",
        description: "Learn scalable system design patterns and architectures",
        targetDate: new Date("2025-11-30"),
        targetStudyTime: 9600,
        status: "active",
        priority: "high",
        progress: 60,
      },
      {
        user: user._id,
        title: "Data Structures & Algorithms Mastery",
        category: "DSA",
        description:
          "Master all fundamental DSA concepts and LeetCode problems",
        targetDate: new Date("2025-10-15"),
        targetStudyTime: 7200,
        status: "active",
        priority: "medium",
        progress: 75,
      },
      {
        user: user._id,
        title: "Docker & Kubernetes Expert",
        category: "Docker",
        description: "Become proficient in containerization and orchestration",
        targetDate: new Date("2025-09-30"),
        targetStudyTime: 4800,
        status: "completed",
        priority: "medium",
        progress: 100,
      },
    ];

    const goals = await Goal.insertMany(goalData);
    console.log("Goals created:", goals.length);

    // Create sample sessions
    console.log("Creating sample sessions...");
    const sessionData = [];
    const today = new Date();

    for (let i = 0; i < 15; i++) {
      const sessionDate = new Date(today);
      sessionDate.setDate(today.getDate() - i);

      const randomGoal = goals[Math.floor(Math.random() * goals.length)];
      const duration = Math.floor(Math.random() * 120) + 30;

      sessionData.push({
        user: user._id,
        goal: randomGoal._id,
        title: `${randomGoal.category} Study Session`,
        date: sessionDate,
        duration: duration,
        topics: [
          `${randomGoal.category} Topic 1`,
          `${randomGoal.category} Topic 2`,
        ],
        notes: `Productive session covering ${randomGoal.category} concepts.`,
        rating: Math.floor(Math.random() * 3) + 3,
      });
    }

    const sessions = await Session.insertMany(sessionData);
    console.log("Sessions created:", sessions.length);

    // Create sample milestones
    console.log("Creating sample milestones...");
    const milestoneData = [
      {
        user: user._id,
        goal: goals[0]._id,
        title: "Complete EC2 Module",
        description: "Finish all EC2 related topics",
        targetDate: new Date("2025-09-15"),
        status: "completed",
        completedDate: new Date("2025-08-10"),
      },
      {
        user: user._id,
        goal: goals[1]._id,
        title: "Design Cache System",
        description: "Learn distributed caching",
        targetDate: new Date("2025-10-15"),
        status: "active",
      },
    ];

    const milestones = await Milestone.insertMany(milestoneData);
    console.log("Milestones created:", milestones.length);

    console.log("\n=== SEED COMPLETED ===");
    console.log(`User: ${user.email} / password123`);
    console.log(`Goals: ${goals.length}`);
    console.log(`Sessions: ${sessions.length}`);
    console.log(`Milestones: ${milestones.length}`);
    console.log("=====================");
  } catch (error) {
    console.error("Seeding error:", error);
  }
}

async function main() {
  console.log("Main function started");

  const connected = await connectDB();
  if (!connected) {
    console.log("Failed to connect to database");
    process.exit(1);
  }

  await seedDatabase();
  console.log("Closing connection...");
  await mongoose.connection.close();
  console.log("Seed script completed");
  process.exit(0);
}

main().catch((error) => {
  console.error("Main function error:", error);
  process.exit(1);
});
