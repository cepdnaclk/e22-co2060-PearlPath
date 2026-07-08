const User = require('../models/User');
const Hotel = require('../models/Hotel');
const Vehicle = require('../models/Vehicle');
const Tour = require('../models/Tour');
const Booking = require('../models/Booking');
const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, text, html) => {
    if (process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        try {
            const transporter = nodemailer.createTransport({
                host: process.env.EMAIL_HOST,
                port: process.env.EMAIL_PORT || 587,
                secure: process.env.EMAIL_SECURE === 'true',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            });

            const mailOptions = {
                from: process.env.EMAIL_FROM || '"PearlPath Support" <no-reply@pearlpath.com>',
                to,
                subject,
                text,
                html
            };

            await transporter.sendMail(mailOptions);
            console.log(`[Email] Admin notification email sent successfully to ${to}`);
        } catch (err) {
            console.error(`[Email Error] Failed to send admin email to ${to}:`, err);
        }
    } else {
        console.log(`[Email Mock] Sending admin email to ${to}: ${subject}`);
    }
};

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

        // Trigger email notification to user
        if (user.email) {
            const roleName = user.role ? user.role.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : 'Provider';
            const subject = `Your PearlPath Partner Application is ${status.charAt(0).toUpperCase() + status.slice(1)}!`;
            const text = status === 'approved' 
                ? `Hello ${user.firstName || 'Partner'},\n\nCongratulations! Your application to join PearlPath as a ${roleName} has been approved by our administrators. You can now log into your account and list your services.\n\nBest regards,\nPearlPath Administration`
                : `Hello ${user.firstName || 'Partner'},\n\nThank you for applying to join PearlPath as a ${roleName}. Unfortunately, our administration team was unable to approve your application at this time.\n\nBest regards,\nPearlPath Administration`;
            const html = `
                <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; line-height: 1.6;">
                    <h2 style="color: ${status === 'approved' ? '#10b981' : '#ef4444'};">Partner Application Status Update</h2>
                    <p>Hello ${user.firstName || 'Partner'},</p>
                    <p>Thank you for applying to join PearlPath as a verified <strong>${roleName}</strong>.</p>
                    ${status === 'approved' ? `
                        <p style="font-size: 16px; font-weight: bold; color: #10b981;">Congratulations! Your application has been approved!</p>
                        <p>Our team has verified your credentials and activated your provider portal. You can now log in, access your provider dashboard, and begin listing your properties, vehicles, or tours to start hosting tourists in Sri Lanka.</p>
                    ` : `
                        <p style="font-size: 16px; font-weight: bold; color: #ef4444;">Your application has been declined.</p>
                        <p>Unfortunately, we are unable to verify and approve your provider request at this time. If you believe this is a mistake, please reply to this email or get in touch with our help center.</p>
                    `}
                    <br/>
                    <p>Best regards,<br/>PearlPath Administration Team</p>
                </div>
            `;
            await sendEmail(user.email, subject, text, html);
        }

        // Trigger in-app notification to user
        try {
            const Notification = require('../models/Notification');
            await Notification.create({
                userId: user._id,
                message: `Your partner application has been ${status} by the administration team!`,
                type: 'account_status'
            });
        } catch (err) {
            console.error("Error creating user notification:", err);
        }

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

        const listing = await Model.findByIdAndUpdate(id, { status }, { new: true }).populate('ownerId', 'firstName lastName email');
        if (!listing) return res.status(404).json({ message: 'Listing not found' });

        // Trigger email notification to owner
        if (listing.ownerId && listing.ownerId.email) {
            const listingName = listing.name || listing.title || listing.makeAndModel || 'your listing';
            const subject = `Your Listing "${listingName}" is ${status.charAt(0).toUpperCase() + status.slice(1)}!`;
            const text = status === 'approved'
                ? `Hello ${listing.ownerId.firstName || 'Partner'},\n\nGreat news! Your listing "${listingName}" has been approved by our administrators and is now live on PearlPath.\n\nBest regards,\nPearlPath Administration`
                : `Hello ${listing.ownerId.firstName || 'Partner'},\n\nWe regret to inform you that your listing "${listingName}" was not approved by our administrators. Please review platform safety requirements and resubmit.\n\nBest regards,\nPearlPath Administration`;
            const html = `
                <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; line-height: 1.6;">
                    <h2 style="color: ${status === 'approved' ? '#10b981' : '#ef4444'};">Listing Verification Status Update</h2>
                    <p>Hello ${listing.ownerId.firstName || 'Partner'},</p>
                    <p>This is a notification regarding your listing: <strong>${listingName}</strong>.</p>
                    ${status === 'approved' ? `
                        <p style="font-size: 16px; font-weight: bold; color: #10b981;">Your listing is now live!</p>
                        <p>Our team has approved your request, and your listing is now visible to all travelers and tourists searching for stays, transport, or itineraries in Sri Lanka.</p>
                    ` : `
                        <p style="font-size: 16px; font-weight: bold; color: #ef4444;">Your listing request was declined.</p>
                        <p>Unfortunately, your listing did not meet our verification and quality guidelines. Please check that you provided high-resolution photos, realistic pricing, and correct contact information, and try resubmitting.</p>
                    `}
                    <br/>
                    <p>Best regards,<br/>PearlPath Administration Team</p>
                </div>
            `;
            await sendEmail(listing.ownerId.email, subject, text, html);
        }

        // Trigger in-app notification to owner
        try {
            const Notification = require('../models/Notification');
            const listingName = listing.name || listing.title || listing.makeAndModel || 'your listing';
            await Notification.create({
                userId: listing.ownerId?._id || listing.ownerId,
                message: `Your listing "${listingName}" has been ${status} by the administration team!`,
                type: 'listing_status'
            });
        } catch (err) {
            console.error("Error creating owner notification:", err);
        }

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
