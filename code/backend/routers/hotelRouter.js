const express = require('express');
const router = express.Router();
const hotelController = require('../controllers/hotelController');

// Hotels
router.get('/hotels', hotelController.getHotels);
router.get('/hotels/:id', hotelController.getHotelById);
router.post('/hotels', hotelController.createHotel);

module.exports = router;
