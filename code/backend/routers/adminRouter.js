const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/authMiddleware');
const {
    getPendingUsers,
    updateUserStatus,
    getStats,
    getPendingListings,
    updateListingStatus,
    getRoleData,
    deleteUser,
    updateUserAdmin,
    getModelData,
    deleteModelData
} = require('../controllers/adminController');

// All admin routes are protected and require 'admin' or 'super_admin' role
router.use(protect);
router.use(authorize('admin', 'super_admin'));

router.get('/admin/users/pending', getPendingUsers);
router.put('/admin/users/:id/status', updateUserStatus);
router.put('/admin/users/:id', updateUserAdmin);
router.delete('/admin/users/:id', deleteUser);

router.get('/admin/listings/pending', getPendingListings);
router.put('/admin/listings/:type/:id/status', updateListingStatus);

router.get('/admin/stats', getStats);
router.get('/admin/roles/:role', getRoleData);

// Generic model routes for Super Admin
router.get('/admin/models/:modelName', getModelData);
router.delete('/admin/models/:modelName/:id', deleteModelData);

module.exports = router;
