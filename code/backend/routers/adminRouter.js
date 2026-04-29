const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/authMiddleware');
const {
    getPendingUsers,
    updateUserStatus,
    getStats,
    getPendingListings,
    updateListingStatus
} = require('../controllers/adminController');

// All admin routes are protected and require 'admin' role
router.use(protect);
router.use(authorize('admin'));

router.get('/admin/users/pending', getPendingUsers);
router.put('/admin/users/:id/status', updateUserStatus);

router.get('/admin/listings/pending', getPendingListings);
router.put('/admin/listings/:type/:id/status', updateListingStatus);

router.get('/admin/stats', getStats);

module.exports = router;
