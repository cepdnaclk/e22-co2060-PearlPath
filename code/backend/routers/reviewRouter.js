const express = require('express');
const router = express.Router();
const { getReviewsByTarget, addReview } = require('../controllers/reviewController');
const { protect } = require('../middlewares/authMiddleware');

// Get reviews for a specific target
router.get('/reviews/:targetId', getReviewsByTarget);

// Add a new review (must be logged in)
router.post('/reviews', protect, addReview);

module.exports = router;
