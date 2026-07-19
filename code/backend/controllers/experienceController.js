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
        const { title, category, location, description, pricePerPerson, duration, images, organizerName, organizerPhone, organizerEmail } = req.body;

        if (!title || !category || !location || !description || !pricePerPerson || !duration) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        // Determine provider type from user role
        let providerType = req.user.role;
        if (providerType === 'hotel_owner') {
            providerType = 'hotel';
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
            providerType,
            organizerName: organizerName || '',
            organizerPhone: organizerPhone || '',
            organizerEmail: organizerEmail || ''
        });

        await newExperience.save();

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
        const experience = await Experience.findById(req.params.id);
        if (!experience) {
            return res.status(404).json({ message: 'Experience not found' });
        }

        if (experience.providedBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this experience' });
        }

        const { title, category, location, description, pricePerPerson, duration, images, organizerName, organizerPhone, organizerEmail } = req.body;

        experience.title = title || experience.title;
        experience.category = category || experience.category;
        experience.location = location || experience.location;
        experience.description = description || experience.description;
        experience.pricePerPerson = pricePerPerson !== undefined ? parseFloat(pricePerPerson) : experience.pricePerPerson;
        experience.duration = duration || experience.duration;
        experience.images = Array.isArray(images) ? images : experience.images;
        experience.organizerName = organizerName !== undefined ? organizerName : experience.organizerName;
        experience.organizerPhone = organizerPhone !== undefined ? organizerPhone : experience.organizerPhone;
        experience.organizerEmail = organizerEmail !== undefined ? organizerEmail : experience.organizerEmail;

        await experience.save();

        const populatedExperience = await Experience.findById(experience._id)
            .populate('providedBy', 'firstName lastName email')
            .lean();

        res.status(200).json({ message: 'Experience updated successfully', experience: populatedExperience });
    } catch (error) {
        console.error("Update experience error:", error);
        res.status(500).json({ message: 'An error occurred while updating the experience' });
    }
};

const deleteExperience = async (req, res) => {
    try {
        const experience = await Experience.findById(req.params.id);
        if (!experience) {
            return res.status(404).json({ message: 'Experience not found' });
        }

        if (experience.providedBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this experience' });
        }

        await Experience.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Experience deleted successfully' });
    } catch (error) {
        console.error("Delete experience error:", error);
        res.status(500).json({ message: 'An error occurred while deleting the experience' });
    }
};

module.exports = { getExperiences, createExperience, updateExperience, deleteExperience };
