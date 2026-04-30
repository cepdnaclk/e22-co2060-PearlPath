const Hotel = require('../models/Hotel');

const getHotels = async (req, res) => {
    try {
        const hotels = await Hotel.find({ status: 'approved' }).select('-images').lean();
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
            amenities: req.body.amenities || []
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
        const hotel = await Hotel.findById(req.params.id);
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

module.exports = { getHotels, createHotel, getHotelById, getProviderHotels };
