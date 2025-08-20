# Learning Tracker Pro

A full-featured MERN stack web application to track and analyze your learning journey for AWS Solutions Architect Associate, System Design, DSA, and Docker Certified Associate.

## 🚀 Features Implemented

✅ **Goal Management**: Add, edit, delete learning goals with progress tracking  
✅ **Session Logging**: Log study sessions with time, topics, notes  
✅ **Interactive Analytics**: Charts showing time by category, goal progress, weekly trends  
✅ **Dashboard**: Motivational stats, study streaks, personalized insights  
✅ **Calendar Integration**: Plan and view study sessions in calendar format  
✅ **Export Reports**: Generate PDF and CSV reports  
✅ **User Authentication**: Secure login/register with JWT  
✅ **Responsive Design**: Mobile-friendly UI using Bootstrap 5  
✅ **Milestone Tracking**: Set and track learning milestones

## 🛠️ Tech Stack

**Backend**: Node.js, Express, MongoDB, JWT, bcryptjs  
**Frontend**: React 18, Bootstrap 5, Recharts, React Big Calendar, jsPDF

## 📦 Quick Start

1. **Install Dependencies**

```bash
cd server && npm install
cd ../client && npm install
```

2. **Environment Setup** (server/.env)

```env
MONGO_URI=mongodb://root:admin@localhost:27017/routein-db?authSource=admin
PORT=5000
JWT_SECRET=your_jwt_secret_here
```

3. **Start Applications**

```bash
# Terminal 1: Backend
cd server && npm start

# Terminal 2: Frontend
cd client && npm start
```

4. **Access**: http://localhost:3000

## 🎯 Learning Categories

- AWS Solutions Architect Associate
- System Design
- Data Structures & Algorithms (DSA)
- Docker Certified Associate

All features fully implemented and ready to use! 🚀
