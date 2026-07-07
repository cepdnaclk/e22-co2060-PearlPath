const express = require('express');
const router = express.Router();
const routeController = require('../controllers/routeController');

router.get('/routes', routeController.getRoutes);

module.exports = router;
