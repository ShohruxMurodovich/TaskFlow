const express = require('express');
const {
    getDashboardStats,
    getRecentTasks
} = require('../controllers/dashboard.controller');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/stats', getDashboardStats);
router.get('/recent', getRecentTasks);

module.exports = router;
