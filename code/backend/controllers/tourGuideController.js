const TourGuide = require('../models/TourGuide');
const Booking = require('../models/Booking');

// Create or update a tour guide profile
const createOrUpdateProfile = async (req, res) => {
    try {
        const { userId, name, bio, location, languages, pricePerDay, profilePictureUrl, experienceYears, contactEmail } = req.body;

        if (!userId || !name || !location) {
            return res.status(400).json({ message: "userId, name, and location are required." });
        }

        // Check if profile already exists for this user
        let guide = await TourGuide.findOne({ userId });

        if (guide) {
            // Update existing
            guide = await TourGuide.findOneAndUpdate(
                { userId },
                { name, bio, location, languages, pricePerDay, profilePictureUrl, experienceYears, contactEmail },
                { new: true, runValidators: true }
            );
            return res.status(200).json({ message: "Profile updated successfully.", guide });
        } else {
            // Create new
            guide = new TourGuide({
                userId, name, bio, location, languages, pricePerDay, profilePictureUrl, experienceYears, contactEmail
            });
            await guide.save();
            return res.status(201).json({ message: "Profile created successfully.", guide });
        }

    } catch (error) {
        console.error("Error creating/updating Tour Guide profile:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

// Get all tour guides
const getAllTourGuides = async (req, res) => {
    try {
        const query = {};
        
        if (req.query.search) {
            query.$text = { $search: req.query.search };
        } else if (req.query.location) {
            query.location = { $regex: req.query.location, $options: 'i' };
        }

        if (req.query.maxPrice) {
            query.pricePerDay = { $lte: Number(req.query.maxPrice) };
        }

        if (req.query.languages) {
            const languagesList = req.query.languages.split(',');
            query.languages = { $in: languagesList };
        }

        let sort = {};
        if (req.query.sortBy) {
            if (req.query.sortBy === 'price_asc') sort.pricePerDay = 1;
            else if (req.query.sortBy === 'price_desc') sort.pricePerDay = -1;
            else if (req.query.sortBy === 'experience') sort.experienceYears = -1;
        }

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const skip = (page - 1) * limit;

        const guides = await TourGuide.find(query)
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .populate('userId', 'email phone');
            
        const total = await TourGuide.countDocuments(query);

        res.status(200).json({
            response: guides,
            total,
            page,
            totalPages: Math.ceil(total / limit)
        });
    } catch (error) {
        console.error("Error fetching tour guides:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

// Get a specific tour guide by ID
const getTourGuideById = async (req, res) => {
    try {
        const { id } = req.params;
        const guide = await TourGuide.findById(id).populate('userId', 'email phone firstName lastName');

        if (!guide) {
            return res.status(404).json({ message: "Tour guide not found." });
        }

        res.status(200).json(guide);
    } catch (error) {
        console.error("Error fetching tour guide:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

// Get tour guide by User ID
const getTourGuideByUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        const guide = await TourGuide.findOne({ userId }).populate('userId', 'email phone firstName lastName');

        if (!guide) {
            return res.status(404).json({ message: "Tour guide profile not found for this user." });
        }

        res.status(200).json(guide);
    } catch (error) {
        console.error("Error fetching tour guide by user ID:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

// Delete tour guide
const deleteTourGuide = async (req, res) => {
    try {
        const { id } = req.params;
        const guide = await TourGuide.findByIdAndDelete(id);

        if (!guide) {
            return res.status(404).json({ message: "Tour guide not found." });
        }

        res.status(200).json({ message: "Tour guide deleted successfully." });
    } catch (error) {
        console.error("Error deleting tour guide:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

const getTourGuideAvailability = async (req, res) => {
    try {
        const guide = await TourGuide.findById(req.params.id);
        if (!guide) return res.status(404).json({ message: 'Tour guide not found' });

        const unavailableDates = guide.unavailableDates ? guide.unavailableDates.map(d => d.toISOString().split('T')[0]) : [];

        const bookings = await Booking.find({ tourId: req.params.id, bookingStatus: 'confirmed' });
        
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
        console.error("Get tour guide availability error:", error);
        res.status(500).json({ message: 'An error occurred while fetching availability' });
    }
};

const manageTourGuideAvailability = async (req, res) => {
    try {
        const guide = await TourGuide.findById(req.params.id);
        if (!guide) return res.status(404).json({ message: 'Tour guide not found' });

        const isOwner = guide.userId && guide.userId.toString() === req.user._id.toString();
        if (!isOwner && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to manage availability for this tour guide' });
        }

        const { date, action } = req.body;
        const targetDate = new Date(date).toISOString().split('T')[0];

        let currentDates = guide.unavailableDates ? guide.unavailableDates.map(d => d.toISOString().split('T')[0]) : [];

        if (action === 'add' && !currentDates.includes(targetDate)) {
            guide.unavailableDates.push(new Date(date));
        } else if (action === 'remove' && currentDates.includes(targetDate)) {
            guide.unavailableDates = guide.unavailableDates.filter(d => d.toISOString().split('T')[0] !== targetDate);
        }

        await guide.save();
        res.status(200).json({ message: 'Availability updated', unavailableDates: guide.unavailableDates });
    } catch (error) {
        console.error("Manage tour guide availability error:", error);
        res.status(500).json({ message: 'An error occurred while updating availability' });
    }
};

module.exports = {
    createOrUpdateProfile,
    getAllTourGuides,
    getTourGuideById,
    getTourGuideByUserId,
    deleteTourGuide,
    getTourGuideAvailability,
    manageTourGuideAvailability
};
