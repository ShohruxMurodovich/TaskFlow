const Comment = require('../models/Comment');
const Task = require('../models/Task');

exports.getComments = async (req, res) => {
    try {
        const { taskId } = req.params;
        const comments = await Comment.find({ task: taskId })
            .populate('user', 'name email')
            .sort({ createdAt: -1 });

        res.json(comments);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.createComment = async (req, res) => {
    try {
        const { taskId } = req.params;
        const { content } = req.body;

        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        const comment = await Comment.create({
            task: taskId,
            user: req.user.id, // Fixed: use req.user.id
            content
        });

        const populatedComment = await Comment.findById(comment._id).populate('user', 'name email');

        // Emit real-time event
        const io = req.app.get('io'); // Fixed: get io from app
        if (io) {
            io.to(`project:${task.project}`).emit('comment:created', populatedComment);
        }

        res.status(201).json(populatedComment);
    } catch (error) {
        console.error('Create comment error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.deleteComment = async (req, res) => {
    try {
        const { id } = req.params;
        const comment = await Comment.findById(id);

        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        // Check ownership
        // req.user.id is from auth middleware
        if (comment.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const task = await Task.findById(comment.task);

        await comment.deleteOne();

        const io = req.app.get('io');
        if (task && io) {
            io.to(`project:${task.project}`).emit('comment:deleted', id);
        }

        res.json({ message: 'Comment deleted' });
    } catch (error) {
        console.error('Delete comment error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
