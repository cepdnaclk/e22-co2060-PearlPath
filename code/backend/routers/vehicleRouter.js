const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');
const { protect, authorize } = require('../middlewares/authMiddleware');

// Map controller functions to RESTful endpoints
router.post('/vehicles', protect, authorize('vehicle_owner'), vehicleController.createVehicle);
router.get('/vehicles', vehicleController.getAllVehicles);
router.get('/vehicles/owner', protect, authorize('vehicle_owner'), vehicleController.getVehiclesByOwner);
router.get('/vehicles/:id', vehicleController.getVehicleById);
router.put('/vehicles/:id', protect, authorize('vehicle_owner'), vehicleController.updateVehicle);
router.delete('/vehicles/:id', protect, authorize('vehicle_owner'), vehicleController.deleteVehicle);

router.get('/vehicles/:id/availability', vehicleController.getVehicleAvailability);
router.post('/vehicles/:id/manage-availability', protect, authorize('vehicle_owner'), vehicleController.manageVehicleAvailability);

module.exports = router;
