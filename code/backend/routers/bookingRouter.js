const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

// Bookings
router.post('/bookings', bookingController.createBooking);
router.get('/bookings/user/:userId', bookingController.getBookings);
router.put('/bookings/:id', bookingController.updateBooking);
router.delete('/bookings/:id', bookingController.cancelBooking);

module.exports = router;
