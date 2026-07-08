const Booking = require('../models/Booking');
const Notification = require('../models/Notification');
const Hotel = require('../models/Hotel');

const checkRoomAvailability = async (hotelId, startDate, endDate, requestedRooms, excludeBookingId = null) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
        throw new Error('Hotel not found');
    }

    const totalRooms = hotel.rooms || 1;

    // Query for overlapping bookings that are confirmed
    const query = {
        hotelId,
        bookingStatus: 'confirmed',
        startDate: { $lt: end },
        endDate: { $gt: start }
    };

    if (excludeBookingId) {
        query._id = { $ne: excludeBookingId };
    }

    const overlappingBookings = await Booking.find(query);

    // Check day by day
    let currentDate = new Date(start);
    while (currentDate < end) {
        const checkDate = new Date(currentDate);
        let bookedRoomsOnDate = 0;

        for (const b of overlappingBookings) {
            const bStart = new Date(b.startDate);
            const bEnd = new Date(b.endDate);

            if (checkDate >= bStart && checkDate < bEnd) {
                bookedRoomsOnDate += b.rooms || 1;
            }
        }

        if (bookedRoomsOnDate + requestedRooms > totalRooms) {
            return {
                available: false,
                maxAvailable: Math.max(0, totalRooms - bookedRoomsOnDate)
            };
        }

        currentDate.setDate(currentDate.getDate() + 1);
    }

    return { available: true };
};

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

        // Room availability check if it is a hotel booking
        if (hotelId) {
            const availCheck = await checkRoomAvailability(hotelId, startDate, endDate, rooms);
            if (!availCheck.available) {
                return res.status(400).json({ 
                    message: `Not enough rooms available at this hotel for the selected dates. There are only ${availCheck.maxAvailable} rooms available.` 
                });
            }
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

        // Create notification for the provider
        try {
            const populatedBooking = await Booking.findById(booking._id)
                .populate('userId', 'firstName lastName')
                .populate('hotelId')
                .populate('vehicleId')
                .populate('tourId');

            if (populatedBooking) {
                let itemName = 'your listing';
                if (populatedBooking.hotelId) itemName = populatedBooking.hotelId.name;
                else if (populatedBooking.vehicleId) itemName = populatedBooking.vehicleId.makeAndModel || 'vehicle';
                else if (populatedBooking.tourId) itemName = populatedBooking.tourId.title || 'tour';

                const guestName = `${populatedBooking.userId?.firstName || ''} ${populatedBooking.userId?.lastName || ''}`.trim() || 'A guest';

                await Notification.create({
                    userId: providerId,
                    bookingId: booking._id,
                    message: `You received a new booking request for ${itemName} from ${guestName}!`,
                    type: 'new_booking'
                });
            }
        } catch (notifErr) {
            console.error("Error creating provider notification:", notifErr);
            // Don't fail the response if notification fails
        }

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

        const existingBooking = await Booking.findById(id);
        if (!existingBooking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Check availability if confirming a hotel booking
        if (updates.bookingStatus === 'confirmed' && (existingBooking.hotelId || updates.hotelId)) {
            const hotelId = updates.hotelId || existingBooking.hotelId;
            const startDate = updates.startDate || existingBooking.startDate;
            const endDate = updates.endDate || existingBooking.endDate;
            const rooms = updates.rooms || existingBooking.rooms || 1;

            const availCheck = await checkRoomAvailability(
                hotelId,
                startDate,
                endDate,
                rooms,
                existingBooking._id
            );
            if (!availCheck.available) {
                return res.status(400).json({ 
                    message: `Cannot confirm booking. Not enough rooms available. Only ${availCheck.maxAvailable} rooms available.` 
                });
            }
        }

        const booking = await Booking.findByIdAndUpdate(id, updates, { new: true, runValidators: true })
            .populate('hotelId')
            .populate('vehicleId')
            .populate('tourId');

        // Create notification if booking status is updated
        if (updates.bookingStatus) {
            let itemName = 'your booking';
            if (booking.hotelId) {
                itemName = booking.hotelId.name;
            } else if (booking.vehicleId) {
                itemName = booking.vehicleId.makeAndModel || 'vehicle booking';
            } else if (booking.tourId) {
                itemName = booking.tourId.title || 'tour booking';
            }

            if (updates.bookingStatus === 'confirmed') {
                await Notification.create({
                    userId: booking.userId,
                    bookingId: booking._id,
                    message: `Your booking for ${itemName} has been confirmed!`,
                    type: 'booking_confirmed'
                });
            } else if (updates.bookingStatus === 'rejected') {
                await Notification.create({
                    userId: booking.userId,
                    bookingId: booking._id,
                    message: `Your booking for ${itemName} has been rejected.`,
                    type: 'booking_rejected'
                });
            }
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
