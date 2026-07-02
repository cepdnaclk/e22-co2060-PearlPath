const Vehicle = require('../models/Vehicle');

// Create a new vehicle
const createVehicle = async (req, res) => {
    try {
        req.body.ownerId = req.user._id;
        const newVehicle = new Vehicle(req.body);
        const savedVehicle = await newVehicle.save();
        res.status(201).json(savedVehicle);
    } catch (error) {
        console.error('Error creating vehicle:', error);
        res.status(500).json({ message: 'Error creating vehicle', error: error.message });
    }
};

// Get all vehicles (for Tourists discovery page)
const getAllVehicles = async (req, res) => {
    try {
        const vehicles = await Vehicle.find({ isAvailable: true, status: 'approved' }).populate('ownerId', 'firstName lastName email');
        res.status(200).json(vehicles);
    } catch (error) {
        console.error('Error fetching all vehicles:', error);
        res.status(500).json({ message: 'Error fetching vehicles', error: error.message });
    }
};

// Get a single vehicle by ID
const getVehicleById = async (req, res) => {
    try {
        const { id } = req.params;
        const vehicle = await Vehicle.findById(id).populate('ownerId', 'firstName lastName email');
        if (!vehicle) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }
        res.status(200).json({ response: vehicle });
    } catch (error) {
        console.error('Error fetching vehicle by id:', error);
        res.status(500).json({ message: 'Error fetching vehicle', error: error.message });
    }
};

// Get vehicles by owner ID (for Owner Dashboard)
const getVehiclesByOwner = async (req, res) => {
    try {
        const vehicles = await Vehicle.find({ ownerId: req.user._id });
        res.status(200).json(vehicles);
    } catch (error) {
        console.error('Error fetching vehicles by owner:', error);
        res.status(500).json({ message: 'Error fetching owner vehicles', error: error.message });
    }
};

// Update a vehicle
const updateVehicle = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedVehicle = await Vehicle.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        
        if (!updatedVehicle) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }
        
        res.status(200).json(updatedVehicle);
    } catch (error) {
        console.error('Error updating vehicle:', error);
        res.status(500).json({ message: 'Error updating vehicle', error: error.message });
    }
};

// Delete a vehicle
const deleteVehicle = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedVehicle = await Vehicle.findByIdAndDelete(id);
        
        if (!deletedVehicle) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }
        
        res.status(200).json({ message: 'Vehicle deleted successfully' });
    } catch (error) {
        console.error('Error deleting vehicle:', error);
        res.status(500).json({ message: 'Error deleting vehicle', error: error.message });
    }
};

module.exports = {
    createVehicle,
    getAllVehicles,
    getVehicleById,
    getVehiclesByOwner,
    updateVehicle,
    deleteVehicle
};
