const express = require('express');
const router = express.Router();
const { generateTrip, saveTrip } = require('../controllers/tripPlannerController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/generate', generateTrip);
router.post('/save', protect, saveTrip);

module.exports = router;
