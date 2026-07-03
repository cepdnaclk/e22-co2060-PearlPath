const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// User Auth
router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.get('/users', userController.getUsers);
router.put('/users/:id', userController.updateUser);

// Password Reset Flow
router.post('/auth/forgot-password', userController.forgotPassword);
router.post('/auth/verify-code', userController.verifyCode);
router.post('/auth/reset-password', userController.resetPassword);

// Email Verification Flow
router.post('/auth/verify-email', userController.verifyEmail);
router.post('/auth/resend-verification', userController.resendVerificationCode);

module.exports = router;
