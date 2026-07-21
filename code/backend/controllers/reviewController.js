const Review = require('../models/Review');

const getReviewsByTarget = async (req, res) => {
    try {
        const { targetId } = req.params;
        const reviews = await Review.find({ targetId })
            .populate('userId', 'firstName lastName')
            .sort({ createdAt: -1 });
        res.status(200).json({ response: reviews });
    } catch (error) {
        console.error("Get reviews error:", error);
        res.status(500).json({ message: 'An error occurred while fetching reviews' });
    }
};

const addReview = async (req, res) => {
    try {
        const { targetId, targetModel, rating, comment } = req.body;
        
        if (!targetId || !targetModel || !rating || !comment) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const newReview = new Review({
            userId: req.user._id,
            targetId,
            targetModel,
            rating,
            comment
        });

        await newReview.save();
        
        // Populate the user for immediate return
        await newReview.populate('userId', 'firstName lastName');
        
        res.status(201).json({ message: 'Review added successfully', review: newReview });
    } catch (error) {
        console.error("Add review error:", error);
        res.status(500).json({ message: 'An error occurred while adding the review' });
    }
};

module.exports = { getReviewsByTarget, addReview };
