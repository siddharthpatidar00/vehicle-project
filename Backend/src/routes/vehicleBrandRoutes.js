const express = require('express');
const router = express.Router();
const upload = require('../config/multerConfig');
const brandController = require('../controllers/vehicleBrandController');
const { protect, adminOnly } = require("../middleware/authMiddleware");

// Create with image
router.post('/',protect,adminOnly, upload.single('brand_image'), brandController.createBrand);

// Get all
router.get('/', brandController.getAllBrands);

// Get by ID
router.get('/:id', brandController.getBrandById);

// Update
router.put('/:id',protect,adminOnly, upload.single('brand_image'), brandController.updateBrand);

// Delete
router.delete('/:id',protect,adminOnly, brandController.deleteBrand);

// Update status only
router.put('/:id/status',protect,adminOnly, brandController.updateBrandStatus);


module.exports = router;
