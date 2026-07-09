const express = require('express');
const router = express.Router();
const experienceController = require('../controllers/experienceController');
const { protect, authorize } = require('../middlewares/authMiddleware');

// Get all experiences
router.get('/experiences', experienceController.getExperiences);

// Create experience (only for providers)
router.post('/experiences', protect, authorize('hotel_owner', 'vehicle_owner', 'tour_guide', 'hotel'), experienceController.createExperience);

module.exports = router;
