const mongoose = require("mongoose");
require("dotenv").config();

const User = require("./models/User");
const Goal = require("./models/Goal");
const Session = require("./models/Session");

async function createLearningRoutine() {
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
    console.log("User found:", user.email);

    // Clear existing goals and sessions
    await Goal.deleteMany({ user: user._id });
    await Session.deleteMany({ user: user._id });
    console.log("Existing goals and sessions cleared");

    // Create learning goals for 3 months
    const goals = [
      {
        user: user._id,
        title: "AWS Solutions Architect Associate Certification",
        category: "AWS Solutions Architect Associate",
        description:
          "Complete AWS SAA-C03 certification preparation with hands-on labs",
        targetDate: new Date("2025-11-20"),
        targetStudyTime: 7200, // 120 hours
        status: "active",
        priority: "high",
        progress: 0,
      },
      {
        user: user._id,
        title: "System Design Fundamentals",
        category: "System Design",
        description: "Master scalable system design patterns and architectures",
        targetDate: new Date("2025-10-30"),
        targetStudyTime: 4800, // 80 hours
        status: "active",
        priority: "high",
        progress: 0,
      },
      {
        user: user._id,
        title: "Data Structures & Algorithms",
        category: "DSA",
        description:
          "Master fundamental DSA concepts and solve coding problems",
        targetDate: new Date("2025-12-15"),
        targetStudyTime: 6000, // 100 hours
        status: "active",
        priority: "medium",
        progress: 0,
      },
      {
        user: user._id,
        title: "Docker Containerization",
        category: "Docker Certified Associate",
        description: "Learn Docker fundamentals and container orchestration",
        targetDate: new Date("2025-11-10"),
        targetStudyTime: 3600, // 60 hours
        status: "active",
        priority: "medium",
        progress: 0,
      },
    ];

    const createdGoals = await Goal.insertMany(goals);
    console.log("Goals created:", createdGoals.length);

    // Create study sessions for 3 months (Aug 20 - Nov 20, 2025)
    const sessions = [];
    const startDate = new Date("2025-08-20");
    const endDate = new Date("2025-11-20");

    // Daily routine for weekdays
    const weeklySchedule = {
      1: {
        // Monday - AWS
        goal: createdGoals[0]._id,
        title: "AWS Study Session",
        duration: 120, // 2 hours
        topics: ["EC2", "VPC", "S3", "IAM", "CloudFormation"],
      },
      2: {
        // Tuesday - System Design
        goal: createdGoals[1]._id,
        title: "System Design Study",
        duration: 90, // 1.5 hours
        topics: [
          "Load Balancing",
          "Caching",
          "Database Design",
          "Microservices",
        ],
      },
      3: {
        // Wednesday - DSA
        goal: createdGoals[2]._id,
        title: "DSA Practice",
        duration: 120, // 2 hours
        topics: [
          "Arrays",
          "Linked Lists",
          "Trees",
          "Graphs",
          "Dynamic Programming",
        ],
      },
      4: {
        // Thursday - Docker
        goal: createdGoals[3]._id,
        title: "Docker Training",
        duration: 90, // 1.5 hours
        topics: [
          "Containers",
          "Images",
          "Networking",
          "Volumes",
          "Docker Compose",
        ],
      },
      5: {
        // Friday - Mixed Review
        goal: createdGoals[0]._id, // Alternate between goals
        title: "Weekly Review & Practice",
        duration: 150, // 2.5 hours
        topics: ["Review", "Hands-on Labs", "Mock Tests", "Problem Solving"],
      },
      6: {
        // Saturday - Project Day
        goal: createdGoals[1]._id,
        title: "Project & Implementation",
        duration: 180, // 3 hours
        topics: ["Project Work", "Implementation", "Real-world Applications"],
      },
    };

    // Generate sessions for each day
    for (
      let d = new Date(startDate);
      d <= endDate;
      d.setDate(d.getDate() + 1)
    ) {
      const dayOfWeek = d.getDay(); // 0 = Sunday, 1 = Monday, etc.

      // Skip Sundays (rest day)
      if (dayOfWeek === 0) continue;

      const schedule = weeklySchedule[dayOfWeek];
      if (schedule) {
        // Rotate goals for Friday sessions
        let goalId = schedule.goal;
        if (dayOfWeek === 5) {
          // Friday
          const weekNumber = Math.floor(
            (d - startDate) / (7 * 24 * 60 * 60 * 1000)
          );
          goalId = createdGoals[weekNumber % createdGoals.length]._id;
        }

        // Create morning session (9 AM)
        const morningSession = new Date(d);
        morningSession.setHours(9, 0, 0, 0);

        sessions.push({
          user: user._id,
          goal: goalId,
          title: schedule.title,
          date: morningSession,
          duration: schedule.duration,
          topics: schedule.topics,
          notes: `Scheduled study session for ${schedule.title.toLowerCase()}. Focus on ${schedule.topics
            .slice(0, 2)
            .join(" and ")}.`,
          rating: null, // Will be filled after completion
        });

        // Add extra session on weekends
        if (dayOfWeek === 6) {
          // Saturday
          const afternoonSession = new Date(d);
          afternoonSession.setHours(14, 0, 0, 0);

          sessions.push({
            user: user._id,
            goal: createdGoals[2]._id, // DSA on Saturday afternoon
            title: "Weekend DSA Intensive",
            date: afternoonSession,
            duration: 120,
            topics: ["Coding Problems", "Algorithm Analysis", "Practice Tests"],
            notes:
              "Weekend intensive session for coding practice and algorithm mastery.",
            rating: null,
          });
        }
      }
    }

    // Create past sessions (last 7 days for demo)
    const pastStartDate = new Date("2025-08-12");
    const pastEndDate = new Date("2025-08-18");

    for (
      let d = new Date(pastStartDate);
      d <= pastEndDate;
      d.setDate(d.getDate() + 1)
    ) {
      const dayOfWeek = d.getDay();
      if (dayOfWeek === 0) continue;

      const schedule = weeklySchedule[dayOfWeek];
      if (schedule) {
        const sessionDate = new Date(d);
        sessionDate.setHours(9, 0, 0, 0);

        sessions.push({
          user: user._id,
          goal: schedule.goal,
          title: schedule.title + " (Completed)",
          date: sessionDate,
          duration: schedule.duration,
          topics: schedule.topics,
          notes: `Completed study session. Made good progress on ${schedule.topics[0]} and ${schedule.topics[1]}.`,
          rating: Math.floor(Math.random() * 2) + 4, // 4-5 rating for past sessions
        });
      }
    }

    await Session.insertMany(sessions);
    console.log("Study sessions created:", sessions.length);

    console.log("\n🎯 Learning Routine Created Successfully!");
    console.log("📅 Duration: 3 months (Aug 20 - Nov 20, 2025)");
    console.log("📚 Goals:", createdGoals.length);
    console.log("📝 Study Sessions:", sessions.length);
    console.log("\n📋 Weekly Schedule:");
    console.log("Monday: AWS (2h) - EC2, VPC, S3");
    console.log("Tuesday: System Design (1.5h) - Load Balancing, Caching");
    console.log("Wednesday: DSA (2h) - Arrays, Trees, Algorithms");
    console.log("Thursday: Docker (1.5h) - Containers, Networking");
    console.log("Friday: Review & Practice (2.5h) - Mixed topics");
    console.log("Saturday: Projects (3h) + DSA Intensive (2h)");
    console.log("Sunday: Rest Day");

    process.exit(0);
  } catch (error) {
    console.error("Error creating learning routine:", error);
    process.exit(1);
  }
}

createLearningRoutine();
