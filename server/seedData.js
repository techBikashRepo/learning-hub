const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

// Import models
const User = require("./models/User");
const Goal = require("./models/Goal");
const Session = require("./models/Session");
const Milestone = require("./models/Milestone");

// Connect to MongoDB
console.log("Connecting to MongoDB...");
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
    seedData();
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

const seedData = async () => {
  try {
    // Clear existing data
    console.log("Clearing existing data...");
    await User.deleteMany({});
    await Goal.deleteMany({});
    await Session.deleteMany({});
    await Milestone.deleteMany({});

    // Create a sample user
    console.log("Creating sample user...");
    const hashedPassword = await bcrypt.hash("password123", 10);
    const user = await User.create({
      name: "John Doe",
      email: "john@example.com",
      password: hashedPassword,
    });

    console.log("Sample user created:", user.email);

    // Create sample goals
    console.log("Creating sample goals...");
    const goals = await Goal.insertMany([
      {
        user: user._id,
        title: "AWS Solutions Architect Certification",
        category: "AWS",
        description: "Complete AWS SAA-C03 certification preparation",
        targetDate: new Date("2025-12-31"),
        targetStudyTime: 12000, // 200 hours in minutes
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
        targetStudyTime: 9600, // 160 hours in minutes
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
        targetStudyTime: 7200, // 120 hours in minutes
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
        targetStudyTime: 4800, // 80 hours in minutes
        status: "completed",
        priority: "medium",
        progress: 100,
      },
      {
        user: user._id,
        title: "Advanced React Development",
        category: "AWS",
        description:
          "Master advanced React patterns and performance optimization",
        targetDate: new Date("2026-01-15"),
        targetStudyTime: 6000, // 100 hours in minutes
        status: "active",
        priority: "low",
        progress: 20,
      },
    ]);

    console.log("Sample goals created:", goals.length);

    // Create sample study sessions (last 30 days)
    console.log("Creating sample study sessions...");
    const sessions = [];
    const today = new Date();

    // Generate sessions for the last 30 days
    for (let i = 0; i < 30; i++) {
      const sessionDate = new Date(today);
      sessionDate.setDate(today.getDate() - i);

      // Randomize number of sessions per day (0-3)
      const sessionsPerDay = Math.floor(Math.random() * 4);

      for (let j = 0; j < sessionsPerDay; j++) {
        const randomGoal = goals[Math.floor(Math.random() * goals.length)];
        const duration = Math.floor(Math.random() * 120) + 30; // 30-150 minutes

        sessions.push({
          user: user._id,
          goal: randomGoal._id,
          title: `${randomGoal.category} Study Session`,
          date: sessionDate,
          duration: duration,
          topics: getRandomTopics(randomGoal.category),
          notes: `Productive session covering ${randomGoal.category} concepts. Made good progress on understanding key principles.`,
          rating: Math.floor(Math.random() * 3) + 3, // 3-5 rating
        });
      }
    }

    await Session.insertMany(sessions);
    console.log("Sample sessions created:", sessions.length);

    // Create sample milestones
    console.log("Creating sample milestones...");
    const milestones = await Milestone.insertMany([
      {
        user: user._id,
        goal: goals[0]._id, // AWS goal
        title: "Complete EC2 Module",
        description:
          "Finish all EC2 related topics including instances, storage, and networking",
        targetDate: new Date("2025-09-15"),
        status: "completed",
        completedDate: new Date("2025-08-10"),
      },
      {
        user: user._id,
        goal: goals[0]._id, // AWS goal
        title: "Complete VPC and Networking",
        description:
          "Master VPC concepts, subnets, routing, and security groups",
        targetDate: new Date("2025-09-30"),
        status: "active",
      },
      {
        user: user._id,
        goal: goals[1]._id, // System Design goal
        title: "Design Distributed Cache System",
        description: "Learn and implement distributed caching strategies",
        targetDate: new Date("2025-10-15"),
        status: "active",
      },
      {
        user: user._id,
        goal: goals[2]._id, // DSA goal
        title: "Master Binary Trees",
        description: "Complete all binary tree algorithms and problems",
        targetDate: new Date("2025-08-25"),
        status: "completed",
        completedDate: new Date("2025-08-15"),
      },
      {
        user: user._id,
        goal: goals[2]._id, // DSA goal
        title: "Dynamic Programming Mastery",
        description: "Solve 50+ DP problems and understand all patterns",
        targetDate: new Date("2025-09-10"),
        status: "active",
      },
    ]);

    console.log("Sample milestones created:", milestones.length);

    console.log("\n=== SEED DATA SUMMARY ===");
    console.log(`User created: ${user.email}`);
    console.log(`Password: password123`);
    console.log(`Goals: ${goals.length}`);
    console.log(`Sessions: ${sessions.length}`);
    console.log(`Milestones: ${milestones.length}`);
    console.log("========================\n");

    console.log("Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

// Helper function to get random topics based on category
function getRandomTopics(category) {
  const topicMap = {
    AWS: [
      "EC2 Instance Types",
      "S3 Storage Classes",
      "VPC Networking",
      "IAM Policies",
      "Lambda Functions",
      "RDS Database",
      "CloudFormation",
      "Auto Scaling",
    ],
    "System Design": [
      "Load Balancing",
      "Database Sharding",
      "Caching Strategies",
      "Microservices",
      "Message Queues",
      "CDN",
      "API Gateway",
      "Rate Limiting",
    ],
    DSA: [
      "Arrays & Strings",
      "Linked Lists",
      "Binary Trees",
      "Graphs",
      "Dynamic Programming",
      "Sorting Algorithms",
      "Hash Tables",
      "Heaps",
    ],
    Docker: [
      "Container Basics",
      "Dockerfile",
      "Docker Compose",
      "Kubernetes Pods",
      "Services & Networking",
      "Volumes",
      "Registry",
      "Orchestration",
    ],
  };

  const topics = topicMap[category] || ["General Study"];
  const numTopics = Math.floor(Math.random() * 3) + 1; // 1-3 topics
  const selectedTopics = [];

  for (let i = 0; i < numTopics; i++) {
    const randomTopic = topics[Math.floor(Math.random() * topics.length)];
    if (!selectedTopics.includes(randomTopic)) {
      selectedTopics.push(randomTopic);
    }
  }

  return selectedTopics;
}
