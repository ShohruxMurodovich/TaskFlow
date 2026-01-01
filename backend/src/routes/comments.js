const express = require('express');
const { protect } = require('../middleware/auth');
const router = express.Router();
const { getComments, createComment, deleteComment } = require('../controllers/commentController');

// Routes for comments
router.get('/tasks/:taskId/comments', protect, getComments);
router.post('/tasks/:taskId/comments', protect, createComment);
router.delete('/comments/:id', protect, deleteComment);

module.exports = router;
