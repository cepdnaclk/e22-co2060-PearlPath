const User = require('../models/User');
const Hotel = require('../models/Hotel');
const Vehicle = require('../models/Vehicle');
const Tour = require('../models/Tour');
const Booking = require('../models/Booking');

// Get all pending users
const getPendingUsers = async (req, res) => {
    try {
        const pendingUsers = await User.find({ status: 'pending' }, '-password');
        res.status(200).json(pendingUsers);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching pending users' });
    }
};

// Update user status
const updateUserStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const user = await User.findByIdAndUpdate(id, { status }, { new: true }).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.status(200).json({ message: `User ${status} successfully`, user });
    } catch (error) {
        res.status(500).json({ message: 'Error updating user status' });
    }
};

// Get platform stats
const getStats = async (req, res) => {
    try {
        const userStats = await User.aggregate([
            { $group: { _id: '$role', count: { $sum: 1 } } }
        ]);
        
        const pendingUsersCount = await User.countDocuments({ status: 'pending' });
        const pendingHotelsCount = await Hotel.countDocuments({ status: 'pending' });
        const pendingVehiclesCount = await Vehicle.countDocuments({ status: 'pending' });
        const pendingToursCount = await Tour.countDocuments({ status: 'pending' });

        res.status(200).json({
            userStats,
            pendingRequests: {
                users: pendingUsersCount,
                hotels: pendingHotelsCount,
                vehicles: pendingVehiclesCount,
                tours: pendingToursCount
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching stats' });
    }
};

// Get pending listings (Hotels, Vehicles, Tours)
const getPendingListings = async (req, res) => {
    try {
        const hotels = await Hotel.find({ status: 'pending' }).populate('ownerId', 'firstName lastName email');
        const vehicles = await Vehicle.find({ status: 'pending' }).populate('ownerId', 'firstName lastName email');
        const tours = await Tour.find({ status: 'pending' }).populate('ownerId', 'firstName lastName email');

        res.status(200).json({ hotels, vehicles, tours });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching pending listings' });
    }
};

// Update listing status
const updateListingStatus = async (req, res) => {
    try {
        const { type, id } = req.params;
        const { status } = req.body;

        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        let Model;
        switch (type) {
            case 'hotel': Model = Hotel; break;
            case 'vehicle': Model = Vehicle; break;
            case 'tour': Model = Tour; break;
            default: return res.status(400).json({ message: 'Invalid listing type' });
        }

        const listing = await Model.findByIdAndUpdate(id, { status }, { new: true });
        if (!listing) return res.status(404).json({ message: 'Listing not found' });

        res.status(200).json({ message: `Listing ${status} successfully`, listing });
    } catch (error) {
        res.status(500).json({ message: 'Error updating listing status' });
    }
};

// Get comprehensive role data
const getRoleData = async (req, res) => {
    try {
        const { role } = req.params;
        
        // Find all users of this role
        const users = await User.find({ role }, '-password').lean();
        console.log(`getRoleData called for ${role}. Found ${users.length} users.`);

        // Attach related data based on role
        for (let user of users) {
            if (role === 'tourist') {
                const bookings = await Booking.find({ userId: user._id })
                    .populate('hotelId', 'name')
                    .populate('vehicleId', 'name')
                    .populate('tourId', 'name');
                user.bookings = bookings;
            } else if (role === 'hotel_owner') {
                const hotels = await Hotel.find({ ownerId: user._id });
                user.listings = hotels;
            } else if (role === 'vehicle_owner') {
                const vehicles = await Vehicle.find({ ownerId: user._id });
                user.listings = vehicles;
            } else if (role === 'tour_guide') {
                const tours = await Tour.find({ ownerId: user._id });
                user.listings = tours;
            }
        }

        res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching role data:", error);
        res.status(500).json({ message: 'Error fetching role data' });
    }
};

// Admin delete user
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndDelete(id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: 'Error deleting user' });
    }
};

// Admin update full user details
const updateUserAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const { firstName, lastName, email, phone, role, status } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            id,
            { firstName, lastName, email, phone, role, status },
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User updated successfully', user: updatedUser });
    } catch (error) {
        console.error("Error updating user admin:", error);
        res.status(500).json({ message: 'Error updating user details' });
    }
};

module.exports = {
    getPendingUsers,
    updateUserStatus,
    getStats,
    getPendingListings,
    updateListingStatus,
    getRoleData,
    deleteUser,
    updateUserAdmin
};
