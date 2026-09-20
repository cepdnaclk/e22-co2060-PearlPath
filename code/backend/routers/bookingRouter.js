const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { protect } = require('../middlewares/authMiddleware');

// Bookings
router.post('/bookings', protect, bookingController.createBooking);
router.get('/bookings/user', protect, bookingController.getBookings);
router.get('/bookings/provider', protect, bookingController.getProviderBookings);
router.put('/bookings/:id', protect, bookingController.updateBooking);
router.delete('/bookings/:id', protect, bookingController.cancelBooking);

router.put('/bookings/:id/accept', protect, bookingController.acceptBooking);
router.put('/bookings/:id/reject', protect, bookingController.rejectBookingRequest);

module.exports = router;
