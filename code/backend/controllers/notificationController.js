const Notification = require('../models/Notification');

// Fetch all notifications for the authenticated user
const getNotifications = async (req, res) => {
    try {
        const userId = req.user._id;
        const notifications = await Notification.find({ userId })
            .sort({ createdAt: -1 })
            .populate('bookingId');
        res.status(200).json({ response: notifications });
    } catch (error) {
        console.error("Get notifications error:", error);
        res.status(500).json({ message: 'An error occurred while fetching notifications' });
    }
};

// Mark a single notification as read
const markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const notification = await Notification.findOneAndUpdate(
            { _id: id, userId },
            { isRead: true },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        res.status(200).json({ message: 'Notification marked as read', notification });
    } catch (error) {
        console.error("Mark notification as read error:", error);
        res.status(500).json({ message: 'An error occurred while updating notification' });
    }
};

// Mark all notifications as read for the authenticated user
const markAllAsRead = async (req, res) => {
    try {
        const userId = req.user._id;

        await Notification.updateMany(
            { userId, isRead: false },
            { isRead: true }
        );

        res.status(200).json({ message: 'All notifications marked as read' });
    } catch (error) {
        console.error("Mark all notifications as read error:", error);
        res.status(500).json({ message: 'An error occurred while updating notifications' });
    }
};

// Delete a specific notification
const deleteNotification = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const notification = await Notification.findOneAndDelete({ _id: id, userId });

        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        res.status(200).json({ message: 'Notification deleted successfully' });
    } catch (error) {
        console.error("Delete notification error:", error);
        res.status(500).json({ message: 'An error occurred while deleting notification' });
    }
};

module.exports = {
    getNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification
};
