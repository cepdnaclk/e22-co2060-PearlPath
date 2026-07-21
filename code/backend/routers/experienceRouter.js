const express = require('express');
const router = express.Router();
const experienceController = require('../controllers/experienceController');
const { protect, authorize } = require('../middlewares/authMiddleware');

// Get all experiences
router.get('/experiences', experienceController.getExperiences);

// Create experience (only for providers)
router.post('/experiences', protect, authorize('hotel_owner', 'vehicle_owner', 'tour_guide', 'hotel'), experienceController.createExperience);

// Update experience (only for the creator provider)
router.put('/experiences/:id', protect, authorize('hotel_owner', 'vehicle_owner', 'tour_guide', 'hotel'), experienceController.updateExperience);

// Delete experience (only for the creator provider)
router.delete('/experiences/:id', protect, authorize('hotel_owner', 'vehicle_owner', 'tour_guide', 'hotel'), experienceController.deleteExperience);

module.exports = router;
