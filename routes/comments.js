const router = require('express').Router();
const commentsController = require('../controllers/comments');
const { isAuthenticated } = require('../middleware/authenticate');

// GET all comments for a specific assignment
router.get('/assignment/:assignmentId', commentsController.getCommentsByAssignment);

// POST create new comment
router.post('/', isAuthenticated, commentsController.createComment);

// DELETE comment
router.delete('/:id', isAuthenticated, commentsController.deleteComment);

module.exports = router;
