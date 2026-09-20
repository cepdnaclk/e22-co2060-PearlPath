const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { protect, authorize } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

router.get('/bank-details', protect, paymentController.getBankDetails);
router.post('/', protect, paymentController.createPayment);
router.get('/my', protect, paymentController.getMyPayments);
router.get('/admin', protect, authorize('admin'), paymentController.getAdminPayments);

// Slip upload route using multer
router.post(
    '/:paymentId/bank-slip', 
    protect, 
    upload.single('bankSlip'), 
    paymentController.uploadBankSlip
);

router.get('/:id', protect, paymentController.getPaymentDetails);

router.get('/provider', protect, authorize('hotel_owner', 'vehicle_owner', 'tour_guide'), paymentController.getProviderPayments);
router.put('/admin/:id/verify', protect, authorize('admin', 'hotel_owner', 'vehicle_owner', 'tour_guide'), paymentController.verifyPayment);
router.put('/admin/:id/reject', protect, authorize('admin', 'hotel_owner', 'vehicle_owner', 'tour_guide'), paymentController.rejectPayment);

module.exports = router;
