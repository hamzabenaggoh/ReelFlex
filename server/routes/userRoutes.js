const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');

// Get all users
router.get('/', UserController.getUsers);

// Create a new user
router.post('/', UserController.createUser);

module.exports = router;
