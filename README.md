# Task Management Dashboard

A full-stack task management application built with Node.js, Express, MongoDB, and Nuxt 3. This application allows users to organize their work into projects, track tasks with different statuses and priorities, and collaborate in real-time.

## 🚀 Features

### Core Functionality
- **User Authentication**: Secure JWT-based authentication with registration and login
- **Project Management**: Create, view, edit, and delete projects
- **Task Management**: Comprehensive task tracking with:
  - Title, description, status, priority, and due date
  - Status options: To Do, In Progress, Done
  - Priority levels: Low, Medium, High
  - Filter tasks by project, status, and priority
- **Dashboard**: Overview with task statistics and recent tasks
- **Responsive UI**: Clean and modern interface using Element Plus components

### ✨ New Advanced Features (Bonus)
- **� Task Comments System**: 
  - Add comments to any task
  - Real-time updates for all users
  - Delete your own comments
  - Read-only "Task Details" view for easy browsing
- **🎯 Kanban Board View**: 
  - Switch between List and Kanban Board views
  - Drag and drop tasks to change status (In Progress)
  - Visual board layout
- **🌙 Dark Mode**: 
  - Fully integrated dark theme
  - Toggle in header
  - Persistent user preference
- **⚡ Real-time Updates**: 
  - Powered by Socket.io
  - Instant updates for task creation, edits, deletions, and comments
  - Dashboard auto-refreshes when data changes

## �🛠️ Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** (MongoDB Atlas)
- **Mongoose** for data modeling
- **JWT** for authentication, **bcryptjs** for hashing
- **Socket.io** for real-time WebSocket communication
- **express-validator** for request validation

### Frontend
- **Nuxt 3** - Vue.js framework
- **Element Plus** - UI component library
- **Pinia** - State management
- **Socket.io Client** - Real-time client
- **Day.js** - Date formatting

### Deployment
- **Railway.app** ready for both backend and frontend

## 📦 Project Structure

```
Gudvil/
├── backend/
│   ├── src/
│   │   ├── config/          # DB config
│   │   ├── models/          # Schemas (User, Project, Task, Comment)
│   │   ├── routes/          # API routes
│   │   ├── controllers/     # Logic (incl. Socket.io emitters)
│   │   ├── middleware/      # Auth & validation
│   │   └── server.js        # Entry point
├── frontend/
│   ├── pages/               # Nuxt pages (tasks.vue refactored)
│   ├── components/          # KanbanBoard, TaskComments, etc.
│   ├── stores/              # Pinia (Auth, Task, Project, Comment)
│   ├── assets/              # CSS (Dark mode variables)
│   └── nuxt.config.ts
└── README.md
```

## 🔧 Local Development Setup

### Prerequisites
- Node.js (v18+)
- npm
- MongoDB Atlas account

### Backend Setup

1. Navigate to backend: `cd backend`
2. Install dependencies: `npm install`
3. Configure `.env`:
   ```env
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_secret
   CLIENT_URL=http://localhost:3000
   PORT=5001
   ```
4. Run server: `npm run dev` (Runs on port 5001)

### Frontend Setup

1. Navigate to frontend: `cd frontend`
2. Install dependencies: `npm install`
3. Configure `.env`:
   ```env
   config.public.apiBase=http://localhost:5001/api
   ```
4. Run app: `npm run dev` (Runs on port 3000)

## 📱 API Documentation

### Comments (New)
- `GET /api/tasks/:taskId/comments` - List comments
- `POST /api/tasks/:taskId/comments` - Add comment
- `DELETE /api/comments/:id` - Delete comment

### Real-time Events
- `task:created`, `task:updated`, `task:deleted`
- `comment:created`, `comment:deleted`
- `project:created`, `project:updated`, `project:deleted`

## 🧪 Test Credentials

For the live demo or local testing, you can use these credentials:

**Email**: `demo@taskmanager.com`
**Password**: `demo123456`

Or register a new account to try out the full functionality.

## 👨‍💻 Author
Built as a technical assessment project demonstrating full-stack development skills.
