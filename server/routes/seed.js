const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const StudySession = require("../models/StudySession");

const router = express.Router();

// Seed database endpoint
router.post("/seed", async (req, res) => {
  try {
    console.log("Starting database seeding...");

    // Check MongoDB connection
    if (mongoose.connection.readyState !== 1) {
      return res.status(500).json({
        success: false,
        message: "MongoDB is not connected. Please ensure MongoDB is running.",
        error: "Database connection error",
      });
    }

    // Clear existing data
    console.log("Clearing existing data...");
    await User.deleteMany({});
    await StudySession.deleteMany({});

    // Create sample user
    const hashedPassword = await bcrypt.hash("password123", 10);
    const user = await User.create({
      name: "John Doe",
      email: "john@example.com",
      password: hashedPassword,
    });

    // Create sample goals
    const goalData = [
      {
        user: user._id,
        title: "AWS Solutions Architect Certification",
        category: "AWS Solutions Architect Associate",
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
        category: "Docker Certified Associate",
        description: "Become proficient in containerization and orchestration",
        targetDate: new Date("2025-09-30"),
        targetStudyTime: 4800,
        status: "completed",
        priority: "medium",
        progress: 100,
      },
      {
        user: user._id,
        title: "Advanced React Development",
        category: "AWS Solutions Architect Associate",
        description:
          "Master advanced React patterns and performance optimization",
        targetDate: new Date("2026-01-15"),
        targetStudyTime: 6000,
        status: "active",
        priority: "low",
        progress: 20,
      },
    ];

    const goals = await Goal.insertMany(goalData);

    // Create sample sessions for the last 30 days
    const sessionData = [];
    const today = new Date();

    for (let i = 0; i < 30; i++) {
      const sessionDate = new Date(today);
      sessionDate.setDate(today.getDate() - i);

      // Random number of sessions per day (0-3)
      const sessionsPerDay = Math.floor(Math.random() * 4);

      for (let j = 0; j < sessionsPerDay; j++) {
        const randomGoal = goals[Math.floor(Math.random() * goals.length)];
        const duration = Math.floor(Math.random() * 120) + 30; // 30-150 minutes

        const topicsMap = {
          AWS: [
            "EC2 Instances",
            "S3 Storage",
            "VPC Networking",
            "IAM Policies",
          ],
          "System Design": [
            "Load Balancing",
            "Caching",
            "Microservices",
            "Databases",
          ],
          DSA: ["Arrays", "Trees", "Graphs", "Dynamic Programming"],
          Docker: ["Containers", "Images", "Compose", "Kubernetes"],
        };

        const topics = topicsMap[randomGoal.category] || ["General Study"];
        const selectedTopics = topics.slice(
          0,
          Math.floor(Math.random() * 3) + 1
        );

        sessionData.push({
          user: user._id,
          goal: randomGoal._id,
          title: `${randomGoal.category} Study Session`,
          date: sessionDate,
          duration: duration,
          topics: selectedTopics,
          notes: `Productive session covering ${randomGoal.category} concepts. Made good progress.`,
          rating: Math.floor(Math.random() * 3) + 3, // 3-5 rating
        });
      }
    }

    const sessions = await Session.insertMany(sessionData);

    // Create sample milestones
    const milestoneData = [
      {
        user: user._id,
        goal: goals[0]._id,
        title: "Complete EC2 Module",
        description:
          "Finish all EC2 related topics including instances, storage, and networking",
        targetDate: new Date("2025-09-15"),
        status: "completed",
        completedDate: new Date("2025-08-10"),
      },
      {
        user: user._id,
        goal: goals[0]._id,
        title: "Complete VPC and Networking",
        description:
          "Master VPC concepts, subnets, routing, and security groups",
        targetDate: new Date("2025-09-30"),
        status: "active",
      },
      {
        user: user._id,
        goal: goals[1]._id,
        title: "Design Distributed Cache System",
        description: "Learn and implement distributed caching strategies",
        targetDate: new Date("2025-10-15"),
        status: "active",
      },
      {
        user: user._id,
        goal: goals[2]._id,
        title: "Master Binary Trees",
        description: "Complete all binary tree algorithms and problems",
        targetDate: new Date("2025-08-25"),
        status: "completed",
        completedDate: new Date("2025-08-15"),
      },
      {
        user: user._id,
        goal: goals[2]._id,
        title: "Dynamic Programming Mastery",
        description: "Solve 50+ DP problems and understand all patterns",
        targetDate: new Date("2025-09-10"),
        status: "active",
      },
    ];

    const milestones = await Milestone.insertMany(milestoneData);

    res.json({
      success: true,
      message: "Database seeded successfully!",
      data: {
        user: { email: user.email, password: "password123" },
        goals: goals.length,
        sessions: sessions.length,
        milestones: milestones.length,
      },
    });
  } catch (error) {
    console.error("Detailed seeding error:", error);
    console.error("Error stack:", error.stack);
    res.status(500).json({
      success: false,
      message: "Error seeding database",
      error: error.message,
      details: error.stack,
    });
  }
});

module.exports = router;
