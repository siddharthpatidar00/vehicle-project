const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/vehicleCategoryController');
const upload = require('../config/multerConfig');
const { protect, adminOnly } = require("../middleware/authMiddleware");

// Create category with image upload
router.post('/', protect, adminOnly, upload.single('category_image'), categoryController.createCategory);

// Get all categories
router.get('/', categoryController.getAllCategories);

// Get single category
router.get('/:id', categoryController.getCategoryById);

// Update category with optional image
router.put('/:id', protect, adminOnly, upload.single('category_image'), categoryController.updateCategory);

// Delete category
router.delete('/:id', protect, adminOnly, categoryController.deleteCategory);

// Update category status only
router.patch('/status/:id', protect, adminOnly, categoryController.updateCategoryStatus);

module.exports = router;
