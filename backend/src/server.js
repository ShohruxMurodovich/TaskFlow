require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');

// Route imports
const authRoutes = require('./routes/auth.routes');
const projectRoutes = require('./routes/project.routes');
const taskRoutes = require('./routes/task.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const commentRoutes = require('./routes/comments.js'); // Use .js extension as created

const app = express();

// Connect to database and start server
const startServer = async () => {
    try {
        console.log('Checking environment variables...');
        console.log('MONGODB_URI exists?', !!process.env.MONGODB_URI);
        console.log('PORT defined?', process.env.PORT);

        await connectDB();
        console.log('MongoDB Connected Successfully');

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

// Make io available to controllers
app.set('io', io);

// Socket.io connection handling
io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});
