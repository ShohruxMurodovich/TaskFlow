const express = require('express');
const { body } = require('express-validator');
const {
    getTasks,
    getTask,
    createTask,
    updateTask,
    deleteTask
} = require('../controllers/task.controller');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validation');

const router = express.Router();

const taskValidation = [
    body('title').trim().notEmpty().withMessage('Task title is required'),
    body('description').optional().trim(),
    body('status')
        .optional()
        .isIn(['To Do', 'In Progress', 'Done'])
        .withMessage('Invalid status'),
    body('priority')
        .optional()
        .isIn(['Low', 'Medium', 'High'])
        .withMessage('Invalid priority'),
    body('project').notEmpty().withMessage('Project is required'),
    body('dueDate').optional().isISO8601().withMessage('Invalid date format')
];

router.use(protect);

router.route('/')
    .get(getTasks)
    .post(taskValidation, validate, createTask);

router.route('/:id')
    .get(getTask)
    .put(validate, updateTask)
    .delete(deleteTask);

module.exports = router;
