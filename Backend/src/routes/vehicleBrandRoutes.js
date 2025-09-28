const express = require('express');
const router = express.Router();
const upload = require('../config/multerConfig');
const brandController = require('../controllers/vehicleBrandController');
const { protect,adminOrStaffOnly } = require("../middleware/authMiddleware");

// Create with image
router.post('/',protect,adminOrStaffOnly, upload.single('brand_image'), brandController.createBrand);

// Get all
router.get('/', brandController.getAllBrands);

// Get by ID
router.get('/:id', brandController.getBrandById);

// Update
router.put('/:id',protect,adminOrStaffOnly, upload.single('brand_image'), brandController.updateBrand);

// Delete
router.delete('/:id',protect,adminOrStaffOnly, brandController.deleteBrand);

// Update status only
router.put('/:id/status',protect,adminOrStaffOnly, brandController.updateBrandStatus);


module.exports = router;
