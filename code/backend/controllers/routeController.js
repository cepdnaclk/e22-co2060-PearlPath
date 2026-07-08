const Route = require('../models/Route');

const getRoutes = async (req, res) => {
    try {
        const { to } = req.query;
        const query = to ? {
            $or: [
                { name: new RegExp(to, 'i') },
                { destination: new RegExp(to, 'i') },
                { "waypoints.name": new RegExp(to, 'i') }
            ]
        } : {};
        const routes = await Route.find(query);
        res.status(200).json({ success: true, response: routes });
    } catch (error) {
        console.error("Error fetching routes:", error);
        res.status(500).json({ success: false, message: "An error occurred while fetching routes." });
    }
};

module.exports = { getRoutes };
