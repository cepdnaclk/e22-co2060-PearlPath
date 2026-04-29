const Booking = require('../models/Booking');

const createBooking = async (req, res) => {
    try {
        const { hotelId, vehicleId, tourId, providerId, startDate, endDate, rooms, guests, totalPrice } = req.body;
        const userId = req.user._id;

        // Validation for dates and numbers
        const start = new Date(startDate);
        const end = new Date(endDate);
        if (start >= end) {
            return res.status(400).json({ message: 'Start date must be before end date' });
        }
        if (rooms < 1 || guests < 1) {
            return res.status(400).json({ message: 'Rooms and guests must be at least 1' });
        }

        const booking = new Booking({
            userId,
            providerId,
            hotelId,
            vehicleId,
            tourId,
            startDate,
            endDate,
            rooms,
            guests,
            totalPrice
        });

        await booking.save();
        res.status(201).json({ message: 'Booking completely successfully!', booking });
    } catch (error) {
        console.error("Create booking error:", error);
        res.status(500).json({ message: 'An error occurred while creating booking', error: error.message });
    }
};

const getBookings = async (req, res) => {
    try {
        const userId = req.user._id;
        const bookings = await Booking.find({ userId })
            .populate('hotelId')
            .populate('vehicleId')
            .populate('tourId');
        res.status(200).json({ response: bookings });
    } catch (error) {
        console.error("Get bookings error:", error);
        res.status(500).json({ message: 'An error occurred while fetching bookings' });
    }
};

const updateBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const booking = await Booking.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        res.status(200).json({ message: 'Booking updated successfully', booking });
    } catch (error) {
        console.error("Update booking error:", error);
        res.status(500).json({ message: 'An error occurred while updating booking' });
    }
};

const cancelBooking = async (req, res) => {
    try {
        const { id } = req.params;
        // Just hard delete for now, or could update status to 'cancelled'
        const booking = await Booking.findByIdAndDelete(id);

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        res.status(200).json({ message: 'Booking cancelled successfully' });
    } catch (error) {
        console.error("Cancel booking error:", error);
        res.status(500).json({ message: 'An error occurred while cancelling booking' });
    }
};

const getProviderBookings = async (req, res) => {
    try {
        const providerId = req.user._id;
        const bookings = await Booking.find({ providerId })
            .populate('userId', 'firstName lastName email phone')
            .populate('hotelId')
            .populate('vehicleId')
            .populate('tourId');
        res.status(200).json({ response: bookings });
    } catch (error) {
        console.error("Get provider bookings error:", error);
        res.status(500).json({ message: 'An error occurred while fetching provider bookings' });
    }
};

module.exports = { createBooking, getBookings, getProviderBookings, updateBooking, cancelBooking };
