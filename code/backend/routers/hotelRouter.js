const express = require('express');
const router = express.Router();
const hotelController = require('../controllers/hotelController');
const { protect, authorize } = require('../middlewares/authMiddleware');

// Hotels
router.get('/hotels', hotelController.getHotels);
router.get('/hotels/provider', protect, authorize('hotel_owner'), hotelController.getProviderHotels);
router.get('/hotels/:id', hotelController.getHotelById);
router.post('/hotels', protect, authorize('hotel_owner'), hotelController.createHotel);
router.put('/hotels/:id', protect, authorize('hotel_owner'), hotelController.updateHotel);

module.exports = router;
