
// controllers/vehicleCategoryController.js
const VehicleCategory = require('../models/VehicleCategoryModel');

exports.createCategory = async (req, res) => {
    try {
        console.log('Request body:', req.body);
        console.log('Request file:', req.file);

        const { category_name, category_description, status } = req.body;
        if (!category_name) {
            return res.status(400).json({ message: 'Category name is required' });
        }

        const category_image = req.file?.filename ? `/uploads/${req.file.filename}` : '';

        const category = new VehicleCategory({
            category_name,
            category_description,
            category_image,
            status
        });

        await category.save();
        res.status(201).json({ message: 'Category created successfully', category });
    } catch (error) {
        console.error('Create Category Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


// Get all categories
exports.getAllCategories = async (req, res) => {
    try {
        const categories = await VehicleCategory.find().sort({ category_name: 1 });
        res.json(categories);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get category by ID
exports.getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await VehicleCategory.findById(id);
        if (!category) return res.status(404).json({ message: 'Category not found' });
        res.json(category);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        if (req.file) {
            updates.category_image = `/uploads/${req.file.filename}`;
        }

        const updated = await VehicleCategory.findByIdAndUpdate(id, updates, {
            new: true,
            runValidators: true,
        });

        if (!updated) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.json({ message: 'Category updated successfully', category: updated });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message || 'Server error' });
    }
};




// Delete category by ID
exports.deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await VehicleCategory.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ message: 'Category not found' });
        res.json({ message: 'Category deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};


// Update category status by ID
exports.updateCategoryStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['Active', 'Inactive'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status value' });
        }

        const updatedCategory = await VehicleCategory.findByIdAndUpdate(
            id,
            { status },
            { new: true, runValidators: true }
        );

        if (!updatedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.json({ message: 'Category status updated successfully', category: updatedCategory });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
