const Booking = require('../models/Booking');
const Notification = require('../models/Notification');
const Hotel = require('../models/Hotel');
const Vehicle = require('../models/Vehicle');
const Tour = require('../models/Tour');
const User = require('../models/User');
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
            console.log(`[Email] Email sent successfully to ${to}`);
        } catch (err) {
            console.error(`[Email Error] Failed to send email to ${to}:`, err);
        }
    } else {
        console.log(`[Email Mock] Sending email to ${to}: ${subject}`);
    }
};

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
        const { hotelId, vehicleId, tourId, startDate, endDate, rooms, guests } = req.body;
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

        const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
        let providerId = null;
        let totalPrice = 0;

        if (hotelId) {
            const hotel = await Hotel.findById(hotelId);
            if (!hotel) return res.status(404).json({ message: 'Hotel not found' });
            providerId = hotel.ownerId;
            totalPrice = days * hotel.pricePerNight * (rooms || 1);
        } else if (vehicleId) {
            const vehicle = await Vehicle.findById(vehicleId);
            if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });
            providerId = vehicle.ownerId;
            totalPrice = days * vehicle.pricePerDay;
        } else if (tourId) {
            const tour = await Tour.findById(tourId);
            if (!tour) return res.status(404).json({ message: 'Tour not found' });
            providerId = tour.ownerId;
            totalPrice = tour.price; // or per person? Let's assume flat price or update later if needed
            if (tour.pricePerPerson) {
               totalPrice = tour.pricePerPerson * (guests || 1);
            }
        }

        if (!providerId) {
            return res.status(400).json({ message: 'Invalid service ID provided' });
        }

        // Note: No availability check on create anymore, since it's just a pending request.
        // We will check availability when the provider accepts the booking.

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
                else if (populatedBooking.tourId) itemName = populatedBooking.tourId.name || 'tour';

                const guestName = `${populatedBooking.userId?.firstName || ''} ${populatedBooking.userId?.lastName || ''}`.trim() || 'A guest';

                await Notification.create({
                    userId: providerId,
                    bookingId: booking._id,
                    message: `You received a new booking request for ${itemName} from ${guestName}!`,
                    type: 'new_booking'
                });

                // Fetch provider details to send mail
                const provider = await User.findById(providerId);
                if (provider && provider.email) {
                    const subject = `New PearlPath Booking Request - ${itemName}`;
                    const text = `Hello ${provider.firstName || 'Partner'},\n\nYou received a new booking request for "${itemName}" from ${guestName}.\nDates: ${new Date(startDate).toDateString()} to ${new Date(endDate).toDateString()}\nGuests: ${guests}\nTotal Revenue: LKR ${totalPrice}\n\nPlease approve or reject this booking inside your provider dashboard.`;
                    const html = `
                        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; line-height: 1.6;">
                            <h2 style="color: #ff7c3b;">New Booking Request Received!</h2>
                            <p>Hello ${provider.firstName || 'Partner'},</p>
                            <p>You have received a new booking request on PearlPath:</p>
                            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; border: 1px solid #eee; margin: 20px 0;">
                                <ul style="list-style: none; padding: 0; margin: 0;">
                                    <li style="margin-bottom: 8px;"><strong>Listing/Service:</strong> ${itemName}</li>
                                    <li style="margin-bottom: 8px;"><strong>Guest Name:</strong> ${guestName}</li>
                                    <li style="margin-bottom: 8px;"><strong>Dates:</strong> ${new Date(startDate).toDateString()} to ${new Date(endDate).toDateString()}</li>
                                    <li style="margin-bottom: 8px;"><strong>Details:</strong> ${rooms ? `${rooms} rooms, ` : ''}${guests} guests</li>
                                    <li style="margin-bottom: 0;"><strong>Estimated Revenue:</strong> LKR ${totalPrice}</li>
                                </ul>
                            </div>
                            <p>Please log in to your PearlPath Provider Dashboard to approve or decline this request.</p>
                            <br/>
                            <p>Best regards,<br/>PearlPath Team</p>
                        </div>
                    `;
                    sendEmail(provider.email, subject, text, html).catch(console.error);
                }
            }
        } catch (notifErr) {
            console.error("Error creating provider notification/email:", notifErr);
            // Don't fail the response if notification/email fails
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
            .populate('tourId')
            .populate('providerId', 'firstName lastName email phone');
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

        // Check availability if accepting a booking
        if (updates.bookingStatus === 'accepted') {
            const startDate = updates.startDate || existingBooking.startDate;
            const endDate = updates.endDate || existingBooking.endDate;
            
            if (existingBooking.hotelId || updates.hotelId) {
                const hotelId = updates.hotelId || existingBooking.hotelId;
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
                        message: `Cannot accept booking. Not enough rooms available. Only ${availCheck.maxAvailable} rooms available.` 
                    });
                }
            } else if (existingBooking.vehicleId || updates.vehicleId) {
                const vehicleId = updates.vehicleId || existingBooking.vehicleId;
                const overlappingBookings = await Booking.find({
                    vehicleId,
                    bookingStatus: { $in: ['accepted', 'confirmed'] },
                    _id: { $ne: existingBooking._id },
                    startDate: { $lt: endDate },
                    endDate: { $gt: startDate }
                });
                if (overlappingBookings.length > 0) {
                    return res.status(400).json({ message: 'Cannot accept booking. Vehicle is not available for the selected dates.' });
                }
            } else if (existingBooking.tourId || updates.tourId) {
                const tourId = updates.tourId || existingBooking.tourId;
                const overlappingBookings = await Booking.find({
                    tourId,
                    bookingStatus: { $in: ['accepted', 'confirmed'] },
                    _id: { $ne: existingBooking._id },
                    startDate: { $lt: endDate },
                    endDate: { $gt: startDate }
                });
                if (overlappingBookings.length > 0) {
                    return res.status(400).json({ message: 'Cannot accept booking. Tour is not available for the selected dates.' });
                }
            }
        }

        const booking = await Booking.findByIdAndUpdate(id, updates, { new: true, runValidators: true })
            .populate('userId', 'firstName lastName email')
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
                itemName = booking.tourId.name || 'tour booking';
            }

            if (updates.bookingStatus === 'accepted') {
                await Notification.create({
                    userId: booking.userId?._id || booking.userId,
                    bookingId: booking._id,
                    message: `Your booking for ${itemName} has been accepted! You can now make the payment.`,
                    type: 'booking_accepted'
                });

                // Send email to tourist
                if (booking.userId && booking.userId.email) {
                    const guestName = booking.userId.firstName || 'Valued Guest';
                    const subject = `Booking Accepted! - ${itemName}`;
                    const text = `Dear ${guestName},\n\nYour booking for "${itemName}" has been successfully accepted by the host! You can now proceed with the payment.\nDates: ${new Date(booking.startDate).toDateString()} to ${new Date(booking.endDate).toDateString()}\nGuests: ${booking.guests}\nTotal Price: LKR ${booking.totalPrice}\n\nThank you for choosing PearlPath!`;
                    const html = `
                        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; line-height: 1.6;">
                            <h2 style="color: #10b981;">Your Booking is Confirmed!</h2>
                            <p>Dear ${guestName},</p>
                            <p>We are excited to inform you that your booking request for <strong>${itemName}</strong> has been accepted by the host!</p>
                            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; border: 1px solid #eee; margin: 20px 0;">
                                <ul style="list-style: none; padding: 0; margin: 0;">
                                    <li style="margin-bottom: 8px;"><strong>Listing/Service:</strong> ${itemName}</li>
                                    <li style="margin-bottom: 8px;"><strong>Dates:</strong> ${new Date(booking.startDate).toDateString()} to ${new Date(booking.endDate).toDateString()}</li>
                                    <li style="margin-bottom: 8px;"><strong>Details:</strong> ${booking.rooms ? `${booking.rooms} rooms, ` : ''}${booking.guests} guests</li>
                                    <li style="margin-bottom: 0;"><strong>Total Price Paid:</strong> LKR ${booking.totalPrice}</li>
                                </ul>
                            </div>
                            <p>You can view your active itinerary details at any time in the <strong>My Bookings</strong> section of your profile.</p>
                            <br/>
                            <p>Have an amazing journey in Sri Lanka!<br/>PearlPath Team</p>
                        </div>
                    `;
                    sendEmail(booking.userId.email, subject, text, html).catch(console.error);
                }
            } else if (updates.bookingStatus === 'rejected') {
                await Notification.create({
                    userId: booking.userId?._id || booking.userId,
                    bookingId: booking._id,
                    message: `Your booking for ${itemName} has been rejected.`,
                    type: 'booking_rejected'
                });

                // Send email to tourist
                if (booking.userId && booking.userId.email) {
                    const guestName = booking.userId.firstName || 'Valued Guest';
                    const subject = `Update on your Booking Request - ${itemName}`;
                    const text = `Dear ${guestName},\n\nWe regret to inform you that your booking request for "${itemName}" was declined by the host. Any payments made will be fully refunded.\n\nBest regards,\nPearlPath Team`;
                    const html = `
                        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; line-height: 1.6;">
                            <h2 style="color: #ef4444;">Booking Request Declined</h2>
                            <p>Dear ${guestName},</p>
                            <p>Thank you for requesting to book <strong>${itemName}</strong>. Unfortunately, the host was unable to accept your request at this time.</p>
                            <p>Any payments made will be fully refunded to your original payment method. We invite you to browse other available options on PearlPath to find a suitable match!</p>
                            <br/>
                            <p>Warm regards,<br/>PearlPath Team</p>
                        </div>
                    `;
                    sendEmail(booking.userId.email, subject, text, html).catch(console.error);
                }
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
        
        const booking = await Booking.findById(id)
            .populate('userId', 'firstName lastName')
            .populate('hotelId')
            .populate('vehicleId')
            .populate('tourId');

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        let itemName = 'a listing';
        if (booking.hotelId) {
            itemName = booking.hotelId.name;
        } else if (booking.vehicleId) {
            itemName = booking.vehicleId.makeAndModel || 'vehicle';
        } else if (booking.tourId) {
            itemName = booking.tourId.name || 'tour';
        }

        const guestName = `${booking.userId?.firstName || ''} ${booking.userId?.lastName || ''}`.trim() || 'A guest';

        await Booking.findByIdAndDelete(id);

        if (booking.providerId) {
            try {
                await Notification.create({
                    userId: booking.providerId,
                    bookingId: booking._id,
                    message: `Booking for ${itemName} by ${guestName} has been cancelled by the guest.`,
                    type: 'booking_cancelled'
                });

                const provider = await User.findById(booking.providerId);
                if (provider && provider.email) {
                    const subject = `Booking Cancelled - ${itemName}`;
                    const text = `Hello ${provider.firstName || 'Partner'},\n\nThe guest ${guestName} has cancelled their booking for "${itemName}".\nDates: ${new Date(booking.startDate).toDateString()} to ${new Date(booking.endDate).toDateString()}.\n\nBest regards,\nPearlPath Team`;
                    const html = `
                        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; line-height: 1.6;">
                            <h2 style="color: #ef4444;">Booking Cancelled by Guest</h2>
                            <p>Hello ${provider.firstName || 'Partner'},</p>
                            <p>We wanted to let you know that <strong>${guestName}</strong> has cancelled their booking for <strong>${itemName}</strong>.</p>
                            <p><strong>Dates:</strong> ${new Date(booking.startDate).toDateString()} to ${new Date(booking.endDate).toDateString()}</p>
                            <p>No further action is required from you for this booking.</p>
                            <br/>
                            <p>Best regards,<br/>PearlPath Team</p>
                        </div>
                    `;
                    await sendEmail(provider.email, subject, text, html);
                }
            } catch (err) {
                console.error("Error sending cancellation notification to provider:", err);
            }
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

const acceptBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const booking = await Booking.findById(id);
        if (!booking) return res.status(404).json({ message: 'Booking not found' });
        
        if (booking.providerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to accept this booking' });
        }
        
        if (booking.bookingStatus !== 'pending') {
            return res.status(400).json({ message: 'Only pending bookings can be accepted' });
        }

        req.body = { bookingStatus: 'accepted' };
        req.params.id = id;
        return updateBooking(req, res);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const rejectBookingRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const booking = await Booking.findById(id);
        if (!booking) return res.status(404).json({ message: 'Booking not found' });
        
        if (booking.providerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to reject this booking' });
        }
        
        if (booking.bookingStatus !== 'pending') {
            return res.status(400).json({ message: 'Only pending bookings can be rejected' });
        }

        req.body = { bookingStatus: 'rejected' };
        req.params.id = id;
        return updateBooking(req, res);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { createBooking, getBookings, getProviderBookings, updateBooking, cancelBooking, acceptBooking, rejectBookingRequest };
