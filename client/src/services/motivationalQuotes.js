// Motivational Quotes Service
export class MotivationalQuotesService {
  static quotes = [
    {
      quote: "The only way to do great work is to love what you do.",
      author: "Steve Jobs",
      category: "passion",
    },
    {
      quote:
        "Success is not the key to happiness. Happiness is the key to success.",
      author: "Albert Schweitzer",
      category: "success",
    },
    {
      quote:
        "The future belongs to those who believe in the beauty of their dreams.",
      author: "Eleanor Roosevelt",
      category: "dreams",
    },
    {
      quote: "Learning never exhausts the mind.",
      author: "Leonardo da Vinci",
      category: "learning",
    },
    {
      quote: "The expert in anything was once a beginner.",
      author: "Helen Hayes",
      category: "growth",
    },
    {
      quote: "Knowledge is power. Information is liberating.",
      author: "Kofi Annan",
      category: "knowledge",
    },
    {
      quote:
        "The beautiful thing about learning is that no one can take it away from you.",
      author: "B.B. King",
      category: "learning",
    },
    {
      quote:
        "Continuous learning is the minimum requirement for success in any field.",
      author: "Brian Tracy",
      category: "continuous",
    },
    {
      quote:
        "The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice.",
      author: "Brian Herbert",
      category: "choice",
    },
    {
      quote: "Don't let what you cannot do interfere with what you can do.",
      author: "John Wooden",
      category: "action",
    },
    {
      quote: "The mind is not a vessel to be filled, but a fire to be kindled.",
      author: "Plutarch",
      category: "mind",
    },
    {
      quote: "Every accomplishment starts with the decision to try.",
      author: "John F. Kennedy",
      category: "decision",
    },
    {
      quote: "Success is the sum of small efforts repeated day in and day out.",
      author: "Robert Collier",
      category: "consistency",
    },
    {
      quote: "The journey of a thousand miles begins with one step.",
      author: "Lao Tzu",
      category: "journey",
    },
    {
      quote:
        "Excellence is never an accident. It is always the result of high intention, sincere effort, and intelligent execution.",
      author: "Aristotle",
      category: "excellence",
    },
    {
      quote: "Your limitation—it's only your imagination.",
      author: "Unknown",
      category: "limitation",
    },
    {
      quote: "Great things never come from comfort zones.",
      author: "Unknown",
      category: "comfort",
    },
    {
      quote: "Dream it. Wish it. Do it.",
      author: "Unknown",
      category: "action",
    },
    {
      quote: "Progress, not perfection.",
      author: "Unknown",
      category: "progress",
    },
    {
      quote: "A year from now, you may wish you had started today.",
      author: "Karen Lamb",
      category: "timing",
    },
  ];

  // Get quote for every 30 minutes based on time intervals
  static getDailyQuote() {
    const now = new Date();
    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    const minutesSinceStartOfDay = Math.floor((now - startOfDay) / (1000 * 60));

    // Change quote every 30 minutes (48 intervals per day)
    const intervalIndex = Math.floor(minutesSinceStartOfDay / 30);
    const quoteIndex = intervalIndex % this.quotes.length;

    return this.quotes[quoteIndex];
  }

  // Check if it's first login today
  static isFirstLoginToday() {
    const today = new Date().toDateString();
    const lastLoginDate = localStorage.getItem("lastLoginDate");

    if (lastLoginDate !== today) {
      localStorage.setItem("lastLoginDate", today);
      return true;
    }
    return false;
  }

  // Get random quote for different occasions
  static getRandomQuote(category = null) {
    let filteredQuotes = this.quotes;
    if (category) {
      filteredQuotes = this.quotes.filter((q) => q.category === category);
    }
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    return filteredQuotes[randomIndex];
  }

  // Get time-based greeting
  static getTimeBasedGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    if (hour < 21) return "Good Evening";
    return "Good Night";
  }

  // Get motivational message based on time and progress
  static getMotivationalMessage(studyStreak = 0, todayHours = 0) {
    const greeting = this.getTimeBasedGreeting();

    if (studyStreak >= 7) {
      return `${greeting}, Bikash! 🔥 Amazing ${studyStreak}-day streak! You're unstoppable!`;
    } else if (studyStreak >= 3) {
      return `${greeting}, Bikash! 💪 Great ${studyStreak}-day streak! Keep the momentum going!`;
    } else if (todayHours >= 2) {
      return `${greeting}, Bikash! 🎯 ${todayHours}h studied today - you're crushing it!`;
    } else if (todayHours > 0) {
      return `${greeting}, Bikash! 🚀 Great start with ${todayHours}h today!`;
    } else {
      return `${greeting}, Bikash! ☀️ Ready to conquer your learning goals today?`;
    }
  }
}
