// controllers/vehiclesController.js
const Vehicles = require('../models/VehiclesModel');

exports.createVehicle = async (req, res) => {
    try {
        const {
            name,
            category_id,
            category_name,
            brand_id,
            brand,
            model,
            km_driven,
            description,
            ownership,
            manufacture_year,
            isInsured,
            insuranceValidTill,
            price,
            status,
            sell_or_rent,
            phone,
        } = req.body;

        const img = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

        const vehicle = new Vehicles({
            name,
            category_id,
            category_name,
            brand_id,
            brand,
            model,
            km_driven,
            description,
            ownership,
            manufacture_year,
            isInsured,
            insuranceValidTill,
            price,
            sell_or_rent,
            phone: phone || null,
            status: status || 'Inactive',
            createdBy: req.user.role,
            img
        });

        await vehicle.save();
        res.status(201).json({ message: 'Vehicle created successfully', vehicle });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};


exports.getAllVehicles = async (req, res) => {
    try {
        const { category_id, category_name, brand, showAll, minPrice, maxPrice } = req.query;
        console.log(minPrice, maxPrice)
        let filter = {};

        // Only admins can pass ?showAll=true
        if (!showAll) {
            filter.status = { $ne: 'Inactive' };
        }

        if (category_id) filter.category_id = category_id;

        if (category_name) {
            let cleaned = category_name.trim();
            const escaped = cleaned.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const flexible = escaped.replace(/\s+/g, '\\s+');
            filter.category_name = { $regex: `^\\s*${flexible}\\s*$`, $options: 'i' };
        }

        if (brand) {
            const escapedBrand = brand.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            filter.brand = { $regex: `^\\s*${escapedBrand}\\s*$`, $options: 'i' };
        }

        // ✅ Price Range Filtering (Fixed)
        if (minPrice !== undefined || maxPrice !== undefined) {
            filter.price = {};
            if (minPrice !== undefined && minPrice !== '') {
                filter.price.$gte = Number(minPrice);
            }
            if (maxPrice !== undefined && maxPrice !== '') {
                filter.price.$lte = Number(maxPrice);
            }
        }
        console.log(filter)
        const vehicles = await Vehicles.find(filter)
            .populate('category_id')
            .populate('brand_id')
            .sort({ Created_date: -1 });

        res.json(vehicles);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};



// Get vehicle by name
exports.getVehicleByName = async (req, res) => {
    try {
        const { name } = req.params;
        const vehicle = await Vehicles.findOne({ name })
            .populate('category_id')
            .populate('brand_id');

        if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });
        res.json(vehicle);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};



// Get vehicle by ID
exports.getVehicleById = async (req, res) => {
    try {
        const { id } = req.params;
        const vehicle = await Vehicles.findById(id)
            .populate('category_id')
            .populate('brand_id');

        if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });
        res.json(vehicle);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update vehicle by ID
exports.updateVehicle = async (req, res) => {
    try {
        const vehicleId = req.params.id;
        const updateData = { ...req.body };

        // Parse existing images sent from frontend
        let existingImages = [];
        if (updateData.existingImages) {
            existingImages = JSON.parse(updateData.existingImages);
        }

        // Append new uploaded files
        let newImages = [];
        if (req.files && req.files.length > 0) {
            newImages = req.files.map(file => `/uploads/${file.filename}`);
        }

        if (updateData.category_name && Array.isArray(updateData.category_name)) {
            updateData.category_name = updateData.category_name[0];
        }


        // Merge existing images with new images
        updateData.img = [...existingImages, ...newImages];

        // Remove field we used for existing images
        delete updateData.existingImages;

        const updatedVehicle = await Vehicles.findByIdAndUpdate(
            vehicleId,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedVehicle) {
            return res.status(404).json({ message: "Vehicle not found" });
        }

        res.status(200).json({
            message: "Vehicle updated successfully",
            vehicle: updatedVehicle,
        });
    } catch (error) {
        console.error("Error updating vehicle:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};





// Delete vehicle by ID
exports.deleteVehicle = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Vehicles.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ message: 'Vehicle not found' });
        res.json({ message: 'Vehicle deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};


