const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');

// Map controller functions to RESTful endpoints
router.post('/vehicles', vehicleController.createVehicle);
router.get('/vehicles', vehicleController.getAllVehicles);
router.get('/vehicles/owner/:ownerId', vehicleController.getVehiclesByOwner);
router.put('/vehicles/:id', vehicleController.updateVehicle);
router.delete('/vehicles/:id', vehicleController.deleteVehicle);

module.exports = router;
