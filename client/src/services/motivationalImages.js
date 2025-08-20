// Motivational Images Service
export class MotivationalImagesService {
  static images = [
    {
      id: 1,
      url: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=800&q=80",
      alt: "Open laptop with code on screen",
      theme: "learning",
    },
    {
      id: 2,
      url: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80",
      alt: "Student studying with books and laptop",
      theme: "study",
    },
    {
      id: 3,
      url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
      alt: "Books stacked with graduation cap",
      theme: "education",
    },
    {
      id: 4,
      url: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?auto=format&fit=crop&w=800&q=80",
      alt: "Library with rows of books",
      theme: "knowledge",
    },
    {
      id: 5,
      url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80",
      alt: "Team celebrating success in office",
      theme: "success",
    },
    {
      id: 6,
      url: "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?auto=format&fit=crop&w=800&q=80",
      alt: "Person writing goals and planning",
      theme: "goals",
    },
    {
      id: 7,
      url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80",
      alt: "Student taking notes from textbook",
      theme: "study",
    },
    {
      id: 8,
      url: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80",
      alt: "Team working together on project",
      theme: "collaboration",
    },
    {
      id: 9,
      url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80",
      alt: "Online learning setup with multiple screens",
      theme: "technology",
    },
    {
      id: 10,
      url: "https://images.unsplash.com/photo-1491841573337-20c39d4e3ccb?auto=format&fit=crop&w=800&q=80",
      alt: "Person reading book by window",
      theme: "reading",
    },
    {
      id: 11,
      url: "https://images.unsplash.com/photo-1556075798-4825dfaaf498?auto=format&fit=crop&w=800&q=80",
      alt: "Graduation ceremony celebration",
      theme: "achievement",
    },
    {
      id: 12,
      url: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=800&q=80",
      alt: "Person presenting to audience",
      theme: "presentation",
    },
    {
      id: 13,
      url: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80",
      alt: "Lightbulb with business icons",
      theme: "innovation",
    },
    {
      id: 14,
      url: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?auto=format&fit=crop&w=800&q=80",
      alt: "Students studying together in library",
      theme: "group_study",
    },
    {
      id: 15,
      url: "https://images.unsplash.com/photo-1496065187959-7f07b8353c55?auto=format&fit=crop&w=800&q=80",
      alt: "Digital learning concept with tablet",
      theme: "digital_learning",
    },
    {
      id: 16,
      url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80",
      alt: "Mountain peak reaching towards clouds",
      theme: "achievement",
    },
    {
      id: 17,
      url: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80",
      alt: "Business chart showing growth",
      theme: "progress",
    },
    {
      id: 18,
      url: "https://images.unsplash.com/photo-1606027216921-a8928c7d3d94?auto=format&fit=crop&w=800&q=80",
      alt: "Person working on laptop with coffee",
      theme: "focus",
    },
    {
      id: 19,
      url: "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?auto=format&fit=crop&w=800&q=80",
      alt: "Science laboratory equipment",
      theme: "research",
    },
    {
      id: 20,
      url: "https://images.unsplash.com/photo-1541746972996-4e0b0f93e586?auto=format&fit=crop&w=800&q=80",
      alt: "Certificate and diploma on desk",
      theme: "certification",
    },
  ];

  // Get motivational image every 30 minutes
  static getDailyImage() {
    const now = new Date();
    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    const minutesSinceStartOfDay = Math.floor((now - startOfDay) / (1000 * 60));

    // Change image every 30 minutes (48 intervals per day)
    const intervalIndex = Math.floor(minutesSinceStartOfDay / 30);
    const imageIndex = intervalIndex % this.images.length;

    return this.images[imageIndex];
  }

  // Get image by theme
  static getImageByTheme(theme) {
    const filteredImages = this.images.filter((img) => img.theme === theme);
    if (filteredImages.length > 0) {
      return filteredImages[Math.floor(Math.random() * filteredImages.length)];
    }
    return this.getDailyImage();
  }

  // Get random motivational image
  static getRandomImage() {
    const randomIndex = Math.floor(Math.random() * this.images.length);
    return this.images[randomIndex];
  }

  // Get image based on time of day
  static getTimeBasedImage() {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 8) {
      return this.getImageByTheme("new_beginning"); // Early morning
    } else if (hour >= 8 && hour < 12) {
      return this.getImageByTheme("achievement"); // Morning
    } else if (hour >= 12 && hour < 17) {
      return this.getImageByTheme("progress"); // Afternoon
    } else if (hour >= 17 && hour < 21) {
      return this.getImageByTheme("success"); // Evening
    } else {
      return this.getImageByTheme("dreams"); // Night
    }
  }

  // Get image based on study progress
  static getProgressBasedImage(studyStreak = 0, todayHours = 0) {
    if (studyStreak >= 7) {
      return this.getImageByTheme("strength");
    } else if (studyStreak >= 3) {
      return this.getImageByTheme("determination");
    } else if (todayHours >= 2) {
      return this.getImageByTheme("success");
    } else if (todayHours > 0) {
      return this.getImageByTheme("progress");
    } else {
      return this.getTimeBasedImage();
    }
  }
}
