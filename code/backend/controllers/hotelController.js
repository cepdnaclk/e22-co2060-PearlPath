const Hotel = require('../models/Hotel');
const Booking = require('../models/Booking');

const getHotels = async (req, res) => {
    try {
        const query = { status: 'approved', ownerId: { $ne: null } };
        
        if (req.query.search) {
            query.$text = { $search: req.query.search };
        } else if (req.query.location) {
            const escapedLocation = req.query.location.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
            query.location = { $regex: new RegExp(`\\b${escapedLocation}\\b`, 'i') };
        }

        if (req.query.minPrice || req.query.maxPrice) {
            query.pricePerNight = {};
            if (req.query.minPrice) query.pricePerNight.$gte = Number(req.query.minPrice);
            if (req.query.maxPrice) query.pricePerNight.$lte = Number(req.query.maxPrice);
        }

        if (req.query.amenities) {
            const amenitiesList = req.query.amenities.split(',');
            query.amenities = { $all: amenitiesList };
        }

        let sort = {};
        if (req.query.sortBy) {
            if (req.query.sortBy === 'price_asc') sort.pricePerNight = 1;
            else if (req.query.sortBy === 'price_desc') sort.pricePerNight = -1;
            else if (req.query.sortBy === 'top_rated') sort.starRating = -1;
        }

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const skip = (page - 1) * limit;

        const hotels = await Hotel.find(query)
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .select('-images')
            .lean();
            
        const total = await Hotel.countDocuments(query);
        
        res.status(200).json({ 
            response: hotels,
            total,
            page,
            totalPages: Math.ceil(total / limit)
        });
    } catch (error) {
        console.error("Get hotels error:", error);
        res.status(500).json({ message: 'An error occurred while fetching hotels' });
    }
};

const createHotel = async (req, res) => {
    try {
        const newHotel = new Hotel({
            ownerId: req.user._id,
            name: req.body.name,
            description: req.body.description,
            pricePerNight: req.body.pricePerNight,
            location: req.body.location,
            imageUrl: req.body.imageUrl,
            images: req.body.images || [],
            rooms: req.body.rooms || 1,
            starRating: req.body.starRating || 3,
            amenities: req.body.amenities || [],
            contactNumber: req.body.contactNumber || '',
            whatsappNumber: req.body.whatsappNumber || ''
        });

        await newHotel.save();
        res.status(201).json({ message: 'Hotel created successfully', hotel: newHotel });
    } catch (error) {
        console.error("Create hotel error:", error);
        res.status(500).json({ message: 'An error occurred while creating the hotel' });
    }
}

const getHotelById = async (req, res) => {
    try {
        const hotel = await Hotel.findById(req.params.id).populate('ownerId', 'email phone firstName lastName');
        if (!hotel) return res.status(404).json({ message: 'Hotel not found' });
        res.status(200).json({ response: hotel });
    } catch (error) {
        console.error("Get hotel error:", error);
        res.status(500).json({ message: 'An error occurred while fetching the hotel' });
    }
};

const getProviderHotels = async (req, res) => {
    try {
        const hotels = await Hotel.find({ ownerId: req.user._id }).select('-images').lean();
        res.status(200).json({ response: hotels });
    } catch (error) {
        console.error("Get provider hotels error:", error);
        res.status(500).json({ message: 'An error occurred while fetching provider hotels' });
    }
};

const updateHotel = async (req, res) => {
    try {
        const hotel = await Hotel.findById(req.params.id);
        
        if (!hotel) {
            return res.status(404).json({ message: 'Hotel not found' });
        }
        
        // Allow hotel_owner role or property owner or admin to update
        const isOwner = hotel.ownerId && hotel.ownerId.toString() === req.user._id.toString();
        const isAdmin = req.user.role === 'admin';
        const isHotelOwner = req.user.role === 'hotel_owner';

        if (!isOwner && !isAdmin && !isHotelOwner) {
            return res.status(403).json({ message: 'Not authorized to update this hotel' });
        }

        hotel.ownerId = req.user._id;
        if (req.body.name) hotel.name = req.body.name;
        if (req.body.description !== undefined) hotel.description = req.body.description;
        if (req.body.pricePerNight !== undefined) hotel.pricePerNight = req.body.pricePerNight;
        if (req.body.location) hotel.location = req.body.location;
        if (req.body.imageUrl) hotel.imageUrl = req.body.imageUrl;
        if (req.body.images && req.body.images.length > 0) hotel.images = req.body.images;
        if (req.body.starRating !== undefined) hotel.starRating = req.body.starRating;
        if (req.body.rooms !== undefined) hotel.rooms = req.body.rooms;
        if (req.body.amenities) hotel.amenities = req.body.amenities;
        
        if (req.body.contactNumber !== undefined) {
            hotel.contactNumber = req.body.contactNumber;
            hotel.markModified('contactNumber');
        }
        if (req.body.whatsappNumber !== undefined) {
            hotel.whatsappNumber = req.body.whatsappNumber;
            hotel.markModified('whatsappNumber');
        }

        const updatedHotel = await hotel.save();

        res.status(200).json({ message: 'Hotel updated successfully', hotel: updatedHotel });
    } catch (error) {
        console.error("Update hotel error:", error);
        res.status(500).json({ message: 'An error occurred while updating the hotel' });
    }
};

const getHotelAvailability = async (req, res) => {
    try {
        const hotel = await Hotel.findById(req.params.id);
        if (!hotel) return res.status(404).json({ message: 'Hotel not found' });

        const unavailableDates = hotel.unavailableDates ? hotel.unavailableDates.map(d => d.toISOString().split('T')[0]) : [];

        const bookings = await Booking.find({ hotelId: req.params.id, bookingStatus: 'confirmed' });
        
        let bookedDates = [];
        bookings.forEach(b => {
            let curr = new Date(b.startDate);
            const end = new Date(b.endDate);
            while (curr <= end) {
                bookedDates.push(curr.toISOString().split('T')[0]);
                curr.setDate(curr.getDate() + 1);
            }
        });

        const allDisabledDates = [...new Set([...unavailableDates, ...bookedDates])];
        res.status(200).json({ disabledDates: allDisabledDates, unavailableDates });
    } catch (error) {
        console.error("Get hotel availability error:", error);
        res.status(500).json({ message: 'An error occurred while fetching availability' });
    }
};

const manageHotelAvailability = async (req, res) => {
    try {
        const hotel = await Hotel.findById(req.params.id);
        if (!hotel) return res.status(404).json({ message: 'Hotel not found' });

        const isOwner = hotel.ownerId && hotel.ownerId.toString() === req.user._id.toString();
        if (!isOwner && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to manage availability for this hotel' });
        }

        const { date, action } = req.body; // action: 'add' or 'remove'
        const targetDate = new Date(date).toISOString().split('T')[0];

        let currentDates = hotel.unavailableDates ? hotel.unavailableDates.map(d => d.toISOString().split('T')[0]) : [];

        if (action === 'add' && !currentDates.includes(targetDate)) {
            hotel.unavailableDates.push(new Date(date));
        } else if (action === 'remove' && currentDates.includes(targetDate)) {
            hotel.unavailableDates = hotel.unavailableDates.filter(d => d.toISOString().split('T')[0] !== targetDate);
        }

        await hotel.save();
        res.status(200).json({ message: 'Availability updated', unavailableDates: hotel.unavailableDates });
    } catch (error) {
        console.error("Manage hotel availability error:", error);
        res.status(500).json({ message: 'An error occurred while updating availability' });
    }
};

module.exports = { getHotels, createHotel, getHotelById, getProviderHotels, updateHotel, getHotelAvailability, manageHotelAvailability };
