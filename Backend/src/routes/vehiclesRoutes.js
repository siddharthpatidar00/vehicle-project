const express = require('express');
const router = express.Router();
const vehiclesController = require('../controllers/vehiclesController');
const upload = require('../config/multerConfig');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.post('/', protect, upload.array('img', 5), vehiclesController.createVehicle);


// Get by name (public)
router.get('/by-name/:name', vehiclesController.getVehicleByName);

// Get all vehicles (public, but logic in controller hides inactive unless Admin with ?showAll)
router.get('/', vehiclesController.getAllVehicles);

// Get by ID (public)
router.get('/:id', vehiclesController.getVehicleById);

// Update vehicle (only logged-in User/Admin)
router.put('/:id', protect, adminOnly, vehiclesController.updateVehicle);

// Delete vehicle (only logged-in User/Admin)
router.delete('/:id', protect, adminOnly, vehiclesController.deleteVehicle);

module.exports = router;
