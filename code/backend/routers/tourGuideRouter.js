const express = require('express');
const router = express.Router();
const tourGuideController = require('../controllers/tourGuideController');
const { protect, authorize } = require('../middlewares/authMiddleware');

// Define REST endpoints
router.post('/tour-guides/profile', tourGuideController.createOrUpdateProfile);
router.get('/tour-guides', tourGuideController.getAllTourGuides);
router.get('/tour-guides/:id', tourGuideController.getTourGuideById);
router.get('/tour-guides/user/:userId', tourGuideController.getTourGuideByUserId);
router.delete('/tour-guides/:id', tourGuideController.deleteTourGuide);

router.get('/tour-guides/:id/availability', tourGuideController.getTourGuideAvailability);
router.post('/tour-guides/:id/manage-availability', protect, authorize('tour_guide'), tourGuideController.manageTourGuideAvailability);

module.exports = router;
