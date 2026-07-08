const express = require('express');
const router = express.Router();
const experienceController = require('../controllers/experienceController');
const { protect, authorize } = require('../middlewares/authMiddleware');

// Get all experiences
router.get('/experiences', experienceController.getExperiences);

// Create experience (only for providers)
router.post('/experiences', protect, authorize('hotel_owner', 'vehicle_owner', 'tour_guide', 'hotel'), experienceController.createExperience);

// Update experience (only for owners/admin)
router.put('/experiences/:id', protect, experienceController.updateExperience);

// Delete experience (only for owners/admin)
router.delete('/experiences/:id', protect, experienceController.deleteExperience);

module.exports = router;

