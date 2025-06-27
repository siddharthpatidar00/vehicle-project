const VehicleBrand = require('../models/vehicleBrandModel');

// Create new brand
exports.createBrand = async (req, res) => {
    try {
        const { brand_name, brand_description, status } = req.body;

        if (!brand_name) {
            return res.status(400).json({ message: 'Brand name is required' });
        }

        const existing = await VehicleBrand.findOne({ brand_name });
        if (existing) {
            return res.status(400).json({ message: 'Brand already exists' });
        }

        const brand_image = req.file ? `/uploads/${req.file.filename}` : '';

        const brand = new VehicleBrand({
            brand_name,
            brand_description,
            brand_image,
            status
        });

        await brand.save();
        res.status(201).json({ message: 'Brand created successfully', brand });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all brands
exports.getAllBrands = async (req, res) => {
    try {
        const brands = await VehicleBrand.find().sort({ brand_name: 1 });
        res.json(brands);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get single brand by ID
exports.getBrandById = async (req, res) => {
    try {
        const { id } = req.params;
        const brand = await VehicleBrand.findById(id);
        if (!brand) return res.status(404).json({ message: 'Brand not found' });
        res.json(brand);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update brand
exports.updateBrand = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        if (req.file) {
            updates.brand_image = `/uploads/${req.file.filename}`;
        }

        const updated = await VehicleBrand.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
        if (!updated) return res.status(404).json({ message: 'Brand not found' });

        res.json({ message: 'Brand updated successfully', brand: updated });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete brand
exports.deleteBrand = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await VehicleBrand.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ message: 'Brand not found' });
        res.json({ message: 'Brand deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};



// Toggle or update brand status
exports.updateBrandStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!status || !['Active', 'Inactive'].includes(status)) {
            return res.status(400).json({ message: 'Valid status is required: Active or Inactive' });
        }

        const updated = await VehicleBrand.findByIdAndUpdate(
            id,
            { status },
            { new: true, runValidators: true, context: 'query' }
        );

        if (!updated) {
            return res.status(404).json({ message: 'Brand not found' });
        }

        res.json({ message: 'Brand status updated', brand: updated });
    } catch (error) {
        console.error('Error updating status:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
