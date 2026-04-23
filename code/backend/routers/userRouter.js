const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// User Auth
router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.get('/users', userController.getUsers);
router.put('/users/:id', userController.updateUser);

module.exports = router;
