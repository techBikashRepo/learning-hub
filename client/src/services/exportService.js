import jsPDF from "jspdf";
import "jspdf-autotable";
import Papa from "papaparse";

export const exportToPDF = (sessions, goals, analytics) => {
  const doc = new jsPDF();

  // Title
  doc.setFontSize(20);
  doc.text("Learning Tracker Pro - Progress Report", 20, 20);

  // Date
  doc.setFontSize(12);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30);

  // Summary Statistics
  doc.setFontSize(16);
  doc.text("Summary Statistics", 20, 50);

  const summaryData = [
    ["Total Study Time", formatTime(analytics.totalStudyTime)],
    ["Total Sessions", analytics.totalSessions.toString()],
    ["Average Session Time", formatTime(analytics.averageSessionTime)],
    [
      "Active Goals",
      goals.filter((g) => g.status === "active").length.toString(),
    ],
    [
      "Completed Goals",
      goals.filter((g) => g.status === "completed").length.toString(),
    ],
  ];

  doc.autoTable({
    startY: 55,
    head: [["Metric", "Value"]],
    body: summaryData,
    margin: { left: 20 },
    styles: { fontSize: 10 },
  });

  // Goals Progress
  let currentY = doc.lastAutoTable.finalY + 20;
  doc.setFontSize(16);
  doc.text("Goals Progress", 20, currentY);

  const goalsData = goals.map((goal) => [
    goal.title,
    goal.category,
    goal.status,
    `${goal.progress}%`,
    new Date(goal.targetDate).toLocaleDateString(),
  ]);

  doc.autoTable({
    startY: currentY + 5,
    head: [["Goal", "Category", "Status", "Progress", "Target Date"]],
    body: goalsData,
    margin: { left: 20 },
    styles: { fontSize: 9 },
  });

  // Recent Sessions
  currentY = doc.lastAutoTable.finalY + 20;
  if (currentY > 250) {
    doc.addPage();
    currentY = 20;
  }

  doc.setFontSize(16);
  doc.text("Recent Study Sessions", 20, currentY);

  const recentSessions = sessions.slice(0, 10);
  const sessionsData = recentSessions.map((session) => [
    new Date(session.date).toLocaleDateString(),
    session.title,
    session.goal?.category || "N/A",
    formatTime(session.duration),
    session.topics.slice(0, 3).join(", "),
  ]);

  doc.autoTable({
    startY: currentY + 5,
    head: [["Date", "Title", "Category", "Duration", "Topics"]],
    body: sessionsData,
    margin: { left: 20 },
    styles: { fontSize: 8 },
  });

  // Save the PDF
  doc.save("learning-tracker-report.pdf");
};

export const exportToCSV = (sessions, goals) => {
  // Prepare sessions data
  const sessionsCSV = sessions.map((session) => ({
    Date: new Date(session.date).toLocaleDateString(),
    Title: session.title,
    Goal: session.goal?.title || "N/A",
    Category: session.goal?.category || "N/A",
    Duration_Minutes: session.duration,
    Topics: session.topics.join("; "),
    Notes: session.notes || "",
  }));

  // Prepare goals data
  const goalsCSV = goals.map((goal) => ({
    Title: goal.title,
    Category: goal.category,
    Description: goal.description || "",
    Status: goal.status,
    Progress_Percent: goal.progress,
    Target_Date: new Date(goal.targetDate).toLocaleDateString(),
    Created_Date: new Date(goal.createdAt).toLocaleDateString(),
  }));

  // Create CSV content
  const sessionsData = Papa.unparse(sessionsCSV);
  const goalsData = Papa.unparse(goalsCSV);

  // Download sessions CSV
  downloadCSV(sessionsData, "study-sessions.csv");

  // Download goals CSV
  setTimeout(() => {
    downloadCSV(goalsData, "learning-goals.csv");
  }, 500);
};

const downloadCSV = (csvContent, filename) => {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const formatTime = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
};
