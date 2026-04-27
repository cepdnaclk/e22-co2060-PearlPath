const TourGuide = require('../models/TourGuide');

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
        const guides = await TourGuide.find().populate('userId', 'email phone');
        res.status(200).json(guides);
    } catch (error) {
        console.error("Error fetching tour guides:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

// Get a specific tour guide by ID
const getTourGuideById = async (req, res) => {
    try {
        const { id } = req.params;
        const guide = await TourGuide.findById(id).populate('userId', 'email phone');

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
        const guide = await TourGuide.findOne({ userId }).populate('userId', 'email phone');

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

module.exports = {
    createOrUpdateProfile,
    getAllTourGuides,
    getTourGuideById,
    getTourGuideByUserId,
    deleteTourGuide
};
