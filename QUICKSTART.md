# Quick Start Guide

## 🚀 How to Run the Project Locally

### Step 1: Set Up MongoDB (Choose One Option)

**Option A: MongoDB Atlas (Recommended for Quick Start)**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a free cluster (M0)
4. Click "Connect" → "Connect your application"
5. Copy the connection string (looks like: `mongodb+srv://<YOUR_USERNAME>:<YOUR_PASSWORD>@<YOUR_CLUSTER>.mongodb.net/...`)

**Option B: Local MongoDB**
1. Install MongoDB locally
2. Start MongoDB service
3. Use connection string: `mongodb://localhost:27017/taskmanager`

### Step 2: Configure Backend

1. Navigate to backend directory:
```bash
cd backend
```

2. Create `.env` file with your MongoDB connection:
```bash
# Copy and paste this into backend/.env
MONGODB_URI=mongodb+srv://<YOUR_USERNAME>:<YOUR_PASSWORD>@<YOUR_CLUSTER>.mongodb.net/taskmanager?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d
PORT=5000
NODE_ENV=development
```

**Important:** Replace `YOUR_USERNAME`, `YOUR_PASSWORD`, and `YOUR_CLUSTER` with your actual MongoDB Atlas credentials!

### Step 3: Configure Frontend

1. Navigate to frontend directory:
```bash
cd ../frontend
```

2. Create `.env` file:
```bash
# Copy and paste this into frontend/.env
NUXT_PUBLIC_API_BASE=http://localhost:5000/api
```

### Step 4: Start Backend Server

Open a terminal window:

```bash
cd backend
npm run dev
```

You should see:
```
Server running on port 5000
MongoDB Connected: cluster.mongodb.net
```

### Step 5: Start Frontend Server

Open a **new** terminal window:

```bash
cd frontend
npm run dev
```

You should see:
```
Nuxt 3.x.x
Local: http://localhost:3000
```

### Step 6: Access the Application

1. Open your browser and go to: **http://localhost:3000**
2. You'll see the login page
3. Click "Register here" to create a new account
4. Fill in:
   - Name: Your Name
   - Email: test@example.com
   - Password: test123456 (minimum 6 characters)
5. Click "Register"
6. You'll be redirected to the dashboard!

## 🎯 Quick Test Workflow

1. **Dashboard** - See your task statistics (everything will be 0 initially)
2. **Projects** - Click "New Project" to create your first project
3. **Tasks** - Create tasks, assign to projects, set priorities
4. **Filters** - Try filtering tasks by project, status, or priority

## 🔧 Troubleshooting

**"MongoDB connection failed"**
- Check your connection string in `backend/.env`
- Make sure your IP is whitelisted in MongoDB Atlas
- Verify username/password are correct

**"Cannot connect to backend"**
- Make sure backend is running on port 5000
- Check `frontend/.env` has correct API URL
- Try restarting both servers

**Port already in use**
- Backend: Change `PORT=5000` to another port in `backend/.env`
- Frontend: Run `npm run dev -- -p 3001` to use different port

## 📝 Example .env Files

**backend/.env**
```env
MONGODB_URI=mongodb+srv://<YOUR_USERNAME>:<YOUR_PASSWORD>@<YOUR_CLUSTER>.mongodb.net/taskmanager?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d
PORT=5000
NODE_ENV=development
```

**frontend/.env**
```env
NUXT_PUBLIC_API_BASE=http://localhost:5000/api
```

## 🎉 You're Ready!

The project should now be running. You can:
- Create an account
- Add projects
- Create and manage tasks
- Filter and search
- View dashboard statistics

Happy coding! 🚀
