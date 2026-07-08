const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/notifications', protect, notificationController.getNotifications);
router.put('/notifications/read-all', protect, notificationController.markAllAsRead);
router.put('/notifications/:id/read', protect, notificationController.markAsRead);
router.delete('/notifications/:id', protect, notificationController.deleteNotification);

module.exports = router;
