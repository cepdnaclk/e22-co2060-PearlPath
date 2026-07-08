const Experience = require('../models/Experience');

// Fetch all experiences
const getExperiences = async (req, res) => {
    try {
        const experiences = await Experience.find()
            .populate('providedBy', 'firstName lastName email')
            .lean();
        res.status(200).json({ response: experiences });
    } catch (error) {
        console.error("Get experiences error:", error);
        res.status(500).json({ message: 'An error occurred while fetching experiences' });
    }
};

// Create a new experience
const createExperience = async (req, res) => {
    try {
        const { title, category, location, description, pricePerPerson, duration, images } = req.body;

        if (!title || !category || !location || !description || !pricePerPerson || !duration) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        // Determine provider type from user role
        // Supported user roles: 'hotel_owner', 'vehicle_owner', 'tour_guide'
        let providerType = req.user.role;
        if (providerType === 'hotel_owner') {
            providerType = 'hotel'; // Map to standard 'hotel' type if requested, but maintain compatibility
        }

        const newExperience = new Experience({
            title,
            category,
            location,
            description,
            pricePerPerson: parseFloat(pricePerPerson),
            duration,
            images: Array.isArray(images) ? images : (images ? [images] : []),
            providedBy: req.user._id,
            providerType
        });

        await newExperience.save();

        // Populate details before sending response
        const populatedExperience = await Experience.findById(newExperience._id)
            .populate('providedBy', 'firstName lastName email')
            .lean();

        res.status(201).json({ message: 'Experience created successfully', experience: populatedExperience });
    } catch (error) {
        console.error("Create experience error:", error);
        res.status(500).json({ message: 'An error occurred while creating the experience' });
    }
};

const updateExperience = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, category, location, description, pricePerPerson, duration, images } = req.body;

        const experience = await Experience.findById(id);
        if (!experience) {
            return res.status(404).json({ message: 'Experience not found' });
        }

        // Authorization Check
        if (experience.providedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'You are not authorized to modify this listing.' });
        }

        const updatedData = {
            title,
            category,
            location,
            description,
            pricePerPerson: pricePerPerson ? parseFloat(pricePerPerson) : experience.pricePerPerson,
            duration,
            images: Array.isArray(images) ? images : (images ? [images] : experience.images)
        };

        const updatedExperience = await Experience.findByIdAndUpdate(
            id,
            { $set: updatedData },
            { new: true }
        ).populate('providedBy', 'firstName lastName email');

        res.status(200).json({ message: 'Experience updated successfully', experience: updatedExperience });
    } catch (error) {
        console.error("Update experience error:", error);
        res.status(500).json({ message: 'An error occurred while updating the experience' });
    }
};

const deleteExperience = async (req, res) => {
    try {
        const { id } = req.params;

        const experience = await Experience.findById(id);
        if (!experience) {
            return res.status(404).json({ message: 'Experience not found' });
        }

        // Authorization Check
        if (experience.providedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'You are not authorized to modify this listing.' });
        }

        await Experience.findByIdAndDelete(id);
        res.status(200).json({ message: 'Experience deleted successfully' });
    } catch (error) {
        console.error("Delete experience error:", error);
        res.status(500).json({ message: 'An error occurred while deleting the experience' });
    }
};

module.exports = { getExperiences, createExperience, updateExperience, deleteExperience };

