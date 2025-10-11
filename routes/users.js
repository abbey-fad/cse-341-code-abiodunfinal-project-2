const router = require('express').Router();
const usersController = require('../controllers/users');
const { isAuthenticated } = require('../middleware/authenticate');

// GET all users
router.get('/', usersController.getAll);

// GET current user profile
router.get('/profile', isAuthenticated, usersController.getProfile);

// GET single user by id
router.get('/:id', usersController.getSingle);

// POST create user
router.post('/', isAuthenticated, usersController.createUser);

// PUT update user
router.put('/:id', isAuthenticated, usersController.updateUser);

// DELETE user
router.delete('/:id', isAuthenticated, usersController.deleteUser);

module.exports = router;
