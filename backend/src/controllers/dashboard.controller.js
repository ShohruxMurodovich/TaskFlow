const Task = require('../models/Task');

// Get dashboard statistics
const getDashboardStats = async (req, res) => {
    try {
        const userId = req.user.id;

        // Get task counts by status
        const todoCount = await Task.countDocuments({ user: userId, status: 'To Do' });
        const inProgressCount = await Task.countDocuments({ user: userId, status: 'In Progress' });
        const doneCount = await Task.countDocuments({ user: userId, status: 'Done' });

        // Get tasks by priority
        const highPriority = await Task.countDocuments({ user: userId, priority: 'High', status: { $ne: 'Done' } });
        const mediumPriority = await Task.countDocuments({ user: userId, priority: 'Medium', status: { $ne: 'Done' } });
        const lowPriority = await Task.countDocuments({ user: userId, priority: 'Low', status: { $ne: 'Done' } });

        res.json({
            success: true,
            data: {
                byStatus: {
                    todo: todoCount,
                    inProgress: inProgressCount,
                    done: doneCount,
                    total: todoCount + inProgressCount + doneCount
                },
                byPriority: {
                    high: highPriority,
                    medium: mediumPriority,
                    low: lowPriority
                }
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get recent tasks
const getRecentTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user.id })
            .populate('project', 'name')
            .sort({ createdAt: -1 })
            .limit(10);

        res.json({
            success: true,
            count: tasks.length,
            data: tasks
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getDashboardStats,
    getRecentTasks
};
