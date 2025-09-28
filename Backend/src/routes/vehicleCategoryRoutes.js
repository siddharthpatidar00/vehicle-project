const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/vehicleCategoryController');
const upload = require('../config/multerConfig');
const { protect,adminOrStaffOnly } = require("../middleware/authMiddleware");

// Create category with image upload
router.post('/', protect,adminOrStaffOnly, upload.single('category_image'), categoryController.createCategory);

// Get all categories
router.get('/', categoryController.getAllCategories);

// Get single category
router.get('/:id', categoryController.getCategoryById);

// Update category with optional image
router.put('/:id', protect,adminOrStaffOnly, upload.single('category_image'), categoryController.updateCategory);

// Delete category
router.delete('/:id', protect,adminOrStaffOnly, categoryController.deleteCategory);

// Update category status only
router.patch('/status/:id', protect,adminOrStaffOnly, categoryController.updateCategoryStatus);

module.exports = router;
