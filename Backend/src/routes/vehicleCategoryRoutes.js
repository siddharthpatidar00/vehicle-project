const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/vehicleCategoryController');
const upload = require('../config/multerConfig');

// Create category with image upload
router.post('/', upload.single('category_image'), categoryController.createCategory);

// Get all categories
router.get('/', categoryController.getAllCategories);

// Get single category
router.get('/:id', categoryController.getCategoryById);

// ✅ Update category with optional image
router.put('/:id', upload.single('category_image'), categoryController.updateCategory);

// Delete category
router.delete('/:id', categoryController.deleteCategory);

// Update category status only
router.patch('/status/:id', categoryController.updateCategoryStatus);

module.exports = router;
