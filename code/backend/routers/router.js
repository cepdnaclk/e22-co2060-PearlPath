const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const hotelController = require('../controllers/hotelController');
const bookingController = require('../controllers/bookingController');

// User Auth
router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.get('/users', userController.getUsers);
router.put('/users/:id', userController.updateUser);


// Hotels
router.get('/hotels', hotelController.getHotels);
router.get('/hotels/:id', hotelController.getHotelById);
router.post('/hotels', hotelController.createHotel);

// Bookings
router.post('/bookings', bookingController.createBooking);
router.get('/bookings/user/:userId', bookingController.getBookings);
router.put('/bookings/:id', bookingController.updateBooking);
router.delete('/bookings/:id', bookingController.cancelBooking);

module.exports = router;