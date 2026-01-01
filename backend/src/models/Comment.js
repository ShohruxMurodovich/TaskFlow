const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    task: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true,
        trim: true,
        maxLength: 1000
    }
}, {
    timestamps: true
});

// Virtual populate for user details if needed, but we'll likely populate manually
commentSchema.index({ task: 1, createdAt: -1 }); // Optimize for fetching comments by task

module.exports = mongoose.model('Comment', commentSchema);
