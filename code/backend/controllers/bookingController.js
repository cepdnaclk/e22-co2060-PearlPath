const Booking = require('../models/Booking');

const createBooking = async (req, res) => {
    try {
        const { userId, hotelId, checkInDate, checkOutDate, guests, totalPrice } = req.body;

        const booking = new Booking({
            userId,
            hotelId,
            checkInDate,
            checkOutDate,
            guests,
            totalPrice
        });

        await booking.save();
        res.status(201).json({ message: 'Booking completely successfully!', booking });
    } catch (error) {
        console.error("Create booking error:", error);
        res.status(500).json({ message: 'An error occurred while creating booking' });
    }
};

const getBookings = async (req, res) => {
    try {
        const { userId } = req.params;
        const bookings = await Booking.find({ userId }).populate('hotelId');
        res.status(200).json({ response: bookings });
    } catch (error) {
        console.error("Get bookings error:", error);
        res.status(500).json({ message: 'An error occurred while fetching bookings' });
    }
};

module.exports = { createBooking, getBookings };
