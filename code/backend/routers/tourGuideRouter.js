const express = require('express');
const router = express.Router();
const tourGuideController = require('../controllers/tourGuideController');

// Define REST endpoints
router.post('/tour-guides/profile', tourGuideController.createOrUpdateProfile);
router.get('/tour-guides', tourGuideController.getAllTourGuides);
router.get('/tour-guides/:id', tourGuideController.getTourGuideById);
router.get('/tour-guides/user/:userId', tourGuideController.getTourGuideByUserId);
router.delete('/tour-guides/:id', tourGuideController.deleteTourGuide);

module.exports = router;
