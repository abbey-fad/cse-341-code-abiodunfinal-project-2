const express = require('express');
const router = express.Router();

const assignmentsController = require('../controllers/assignments');
const { isAuthenticated } = require('../middleware/authenticate');

router.get('/', assignmentsController.getAll);

router.get('/:id', assignmentsController.getSingle);

router.post('/', isAuthenticated, assignmentsController.createAssignment);

router.put('/:id', isAuthenticated, assignmentsController.updateAssignment);

router.delete('/:id', isAuthenticated, assignmentsController.deleteAssignment);

module.exports = router;
