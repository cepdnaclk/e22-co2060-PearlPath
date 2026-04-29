const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/authMiddleware');
const {
    getPendingUsers,
    updateUserStatus,
    getStats,
    getPendingListings,
    updateListingStatus,
    getRoleData
} = require('../controllers/adminController');

// All admin routes are protected and require 'admin' role
router.use(protect);
router.use(authorize('admin'));

router.get('/admin/users/pending', getPendingUsers);
router.put('/admin/users/:id/status', updateUserStatus);

router.get('/admin/listings/pending', getPendingListings);
router.put('/admin/listings/:type/:id/status', updateListingStatus);

router.get('/admin/stats', getStats);
router.get('/admin/roles/:role', getRoleData);

module.exports = router;
