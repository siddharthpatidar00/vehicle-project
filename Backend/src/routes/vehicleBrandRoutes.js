const express = require('express');
const router = express.Router();
const upload = require('../config/multerConfig');
const brandController = require('../controllers/vehicleBrandController');

// Create with image
router.post('/', upload.single('brand_image'), brandController.createBrand);

// Get all
router.get('/', brandController.getAllBrands);

// Get by ID
router.get('/:id', brandController.getBrandById);

// Update
router.put('/:id', upload.single('brand_image'), brandController.updateBrand);

// Delete
router.delete('/:id', brandController.deleteBrand);

// Update status only
router.put('/:id/status', brandController.updateBrandStatus);


module.exports = router;
