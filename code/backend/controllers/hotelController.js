const Hotel = require('../models/Hotel');

const getHotels = async (req, res) => {
    try {
        const query = { status: 'approved', ownerId: { $ne: null } };
        if (req.query.location) {
            const escapedLocation = req.query.location.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
            query.location = { $regex: new RegExp(`\\b${escapedLocation}\\b`, 'i') };
        }
        const hotels = await Hotel.find(query).select('-images').lean();
        res.status(200).json({ response: hotels });
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

module.exports = { getHotels, createHotel, getHotelById, getProviderHotels, updateHotel };
