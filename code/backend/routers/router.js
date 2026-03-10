const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const hotelController = require('../controllers/hotelController');
const bookingController = require('../controllers/bookingController');

// User Auth
router.post('/signup', userController.signup);
router.post('/login', userController.login);


// Hotels
router.get('/hotels', hotelController.getHotels);
router.post('/hotels', hotelController.createHotel);

// Bookings
router.post('/bookings', bookingController.createBooking);
router.get('/bookings/:userId', bookingController.getBookings);

module.exports = router;