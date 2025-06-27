// controllers/vehiclesController.js
const Vehicles = require('../models/VehiclesModel');

// Create new vehicle
exports.createVehicle = async (req, res) => {
    try {
        const {
            name,
            category_id,
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
            sell_or_rent
        } = req.body;

        const img = req.file ? `/uploads/${req.file.filename}` : '';

        const vehicle = new Vehicles({
            name,
            category_id,
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
            img 
        });

        await vehicle.save();
        res.status(201).json({ message: 'Vehicle created successfully', vehicle });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all vehicles
exports.getAllVehicles = async (req, res) => {
    try {
        const vehicles = await Vehicles.find()
            .populate('category_id')
            .populate('brand_id')
            .sort({ Created_date: -1 });
        res.json(vehicles);
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
        const { id } = req.params;
        const updates = req.body;
        if (req.file) updates.img = `/uploads/${req.file.filename}`;
        const updated = await Vehicles.findByIdAndUpdate(id, updates, { new: true });
        if (!updated) return res.status(404).json({ message: 'Vehicle not found' });
        res.json({ message: 'Vehicle updated successfully', vehicle: updated });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
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