const express = require('express');
const { body } = require('express-validator');
const {
    getProjects,
    getProject,
    createProject,
    updateProject,
    deleteProject
} = require('../controllers/project.controller');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validation');

const router = express.Router();

const projectValidation = [
    body('name').trim().notEmpty().withMessage('Project name is required'),
    body('description').optional().trim()
];

router.use(protect);

router.route('/')
    .get(getProjects)
    .post(projectValidation, validate, createProject);

router.route('/:id')
    .get(getProject)
    .put(projectValidation, validate, updateProject)
    .delete(deleteProject);

module.exports = router;
