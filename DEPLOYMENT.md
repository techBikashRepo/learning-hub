# Deployment Guide for Learning Tracker Pro

## 🚀 Free Hosting Setup

### Prerequisites
1. GitHub account
2. MongoDB Atlas account (free)
3. Render account (free)
4. Vercel account (free)

## Step 1: Setup MongoDB Atlas (Database)

1. **Create MongoDB Atlas Account**
   - Go to https://www.mongodb.com/atlas/database
   - Sign up for free account
   - Create a new project: "Learning Tracker Pro"

2. **Create Free Cluster**
   - Choose "M0 Sandbox" (free tier)
   - Select your preferred region
   - Name: "learning-tracker-cluster"

3. **Setup Database User**
   - Go to Database Access
   - Add new user: `admin` / `your-secure-password`
   - Role: Atlas Admin

4. **Configure Network Access**
   - Go to Network Access
   - Add IP: `0.0.0.0/0` (allow from anywhere)

5. **Get Connection String**
   - Go to Clusters → Connect → Connect your application
   - Copy connection string: `mongodb+srv://admin:<password>@learning-tracker-cluster.xxxxx.mongodb.net/routein-db?retryWrites=true&w=majority`

## Step 2: Deploy Backend to Render

1. **Push to GitHub**
   - Ensure your code is pushed to GitHub repository
   - Repository: `techBikashRepo/learning-hub`

2. **Create Render Account**
   - Go to https://render.com
   - Sign up with GitHub account

3. **Deploy Backend**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - Name: `learning-tracker-backend`
     - Environment: `Node`
     - Build Command: `cd server && npm install`
     - Start Command: `cd server && npm start`
     - Instance Type: `Free`

4. **Set Environment Variables**
   ```
   NODE_ENV=production
   PORT=10000
   MONGO_URI=mongodb+srv://admin:<your-password>@learning-tracker-cluster.xxxxx.mongodb.net/routein-db?retryWrites=true&w=majority
   JWT_SECRET=your-super-secret-jwt-key-here
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment (5-10 minutes)
   - Note your backend URL: `https://learning-tracker-backend.onrender.com`

## Step 3: Deploy Frontend to Vercel

1. **Update Environment**
   - Update `client/.env.production`:
   ```
   REACT_APP_API_URL=https://learning-tracker-backend.onrender.com/api
   GENERATE_SOURCEMAP=false
   ```

2. **Create Vercel Account**
   - Go to https://vercel.com
   - Sign up with GitHub account

3. **Deploy Frontend**
   - Click "New Project"
   - Import your GitHub repository
   - Configure:
     - Framework Preset: `Create React App`
     - Root Directory: `client`
     - Build Command: `npm run build`
     - Output Directory: `build`
     - Install Command: `npm install`

4. **Set Environment Variables**
   ```
   REACT_APP_API_URL=https://learning-tracker-backend.onrender.com/api
   GENERATE_SOURCEMAP=false
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait for deployment (3-5 minutes)
   - Your app URL: `https://your-app-name.vercel.app`

## Step 4: Test Your Deployed App

1. **Visit your frontend URL**
2. **Test registration/login**
3. **Verify database connection**
4. **Test all features**

## 🎉 Your App is Live!

- **Frontend**: https://your-app-name.vercel.app
- **Backend**: https://learning-tracker-backend.onrender.com
- **Database**: MongoDB Atlas (managed)

## Auto-Deployment Setup

Both Vercel and Render will auto-deploy when you push to your GitHub repository:
- Push to `main` branch → Automatic deployment
- All changes sync automatically

## Cost Breakdown
- **MongoDB Atlas**: Free (512MB storage)
- **Render**: Free (750 hours/month)
- **Vercel**: Free (unlimited deployments)
- **Total**: $0/month

## Troubleshooting

### Backend Issues
- Check Render logs in dashboard
- Verify environment variables
- Ensure MongoDB connection string is correct

### Frontend Issues
- Check Vercel deployment logs
- Verify API URL in environment variables
- Check browser console for errors

### Database Issues
- Verify MongoDB Atlas network access (0.0.0.0/0)
- Check database user credentials
- Ensure database name matches (routein-db)
