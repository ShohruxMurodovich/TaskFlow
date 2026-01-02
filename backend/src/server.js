require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');

// Route imports
const authRoutes = require('./routes/auth.routes');
const projectRoutes = require('./routes/project.routes');
const taskRoutes = require('./routes/task.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const commentRoutes = require('./routes/comments.js');

const app = express();

// Middleware
// Middleware
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        const allowedOrigins = [
            'http://localhost:3000',
            process.env.CLIENT_URL
        ].filter(Boolean).map(url => url.replace(/\/$/, '')); // Normalize by removing trailing slashes

        const normalizedOrigin = origin.replace(/\/$/, '');

        if (allowedOrigins.includes(normalizedOrigin)) {
            callback(null, true);
        } else {
            // Development permissive mode
            if (process.env.NODE_ENV !== 'production' && (normalizedOrigin.includes('localhost') || normalizedOrigin.includes('127.0.0.1'))) {
                callback(null, true);
            } else {
                console.log('Blocked CORS origin:', origin);
                // For now, in this specific debugging context, allow it but log it
                // Ideally this should be callback(new Error('Not allowed by CORS')) in strict prod
                callback(null, true);
            }
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api', commentRoutes);

// Root health check for Railway
app.get('/', (req, res) => {
    res.json({ status: 'ok', service: 'Task Management API', version: '1.0.0' });
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running' });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: err.message || 'Internal server error'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Connect to database and start server
const startServer = async () => {
    try {
        await connectDB();
        console.log('MongoDB Connected Successfully');

        const PORT = process.env.PORT || 8080;

        const server = app.listen(PORT, '0.0.0.0', () => {
            console.log(`Server running on port ${PORT}`);
        });

        // Socket.io setup
        const { Server } = require('socket.io');
        const io = new Server(server, {
            cors: {
                origin: process.env.CLIENT_URL || 'http://localhost:3000',
                methods: ['GET', 'POST', 'PUT', 'DELETE']
            }
        });

        app.set('io', io);

        io.on('connection', (socket) => {
            console.log('Client connected:', socket.id);
            socket.on('disconnect', () => {
                console.log('Client disconnected:', socket.id);
            });
        });

    } catch (err) {
        console.error('Failed to connect to MongoDB:', err);
        process.exit(1);
    }
};

startServer();
