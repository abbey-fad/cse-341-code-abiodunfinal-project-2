const router = require('express').Router();
const coursesController = require('../controllers/courses');
const { isAuthenticated } = require('../middleware/authenticate');

// GET all courses
router.get('/', coursesController.getAll);

// GET a single course by ID
router.get('/:id', coursesController.getSingle);

// POST create new course
router.post('/', isAuthenticated, coursesController.createCourse);

// PUT update course
router.put('/:id', isAuthenticated, coursesController.updateCourse);

// DELETE course
router.delete('/:id', isAuthenticated, coursesController.deleteCourse);

module.exports = router;
