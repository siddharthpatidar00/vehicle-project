// routes/vehiclesRoutes.js
const express = require('express');
const router = express.Router();
const vehiclesController = require('../controllers/vehiclesController');
const upload = require('../config/multerConfig')

router.post('/', upload.single('img'), vehiclesController.createVehicle);

router.post('/', vehiclesController.createVehicle);
router.get('/', vehiclesController.getAllVehicles);
router.get('/:id', vehiclesController.getVehicleById);
router.put('/:id', vehiclesController.updateVehicle);
router.delete('/:id', vehiclesController.deleteVehicle);

module.exports = router;