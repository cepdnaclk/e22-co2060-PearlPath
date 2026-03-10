const Hotel = require('../models/Hotel');

const getHotels = async (req, res) => {
    try {
        const hotels = await Hotel.find();
        res.status(200).json({ response: hotels });
    } catch (error) {
        console.error("Get hotels error:", error);
        res.status(500).json({ message: 'An error occurred while fetching hotels' });
    }
};

const createHotel = async (req, res) => {
    try {
        const newHotel = new Hotel({
            name: req.body.name,
            description: req.body.description,
            pricePerNight: req.body.pricePerNight,
            location: req.body.location,
            imageUrl: req.body.imageUrl,
            images: req.body.images || [],
            rooms: req.body.rooms || 1
        });

        await newHotel.save();
        res.status(201).json({ message: 'Hotel created successfully', hotel: newHotel });
    } catch (error) {
        console.error("Create hotel error:", error);
        res.status(500).json({ message: 'An error occurred while creating the hotel' });
    }
}

module.exports = { getHotels, createHotel };
