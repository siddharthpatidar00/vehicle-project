const VehicleTransport = require('../models/vehicleTransportModel');

// Create new transport request
exports.createTransport = async (req, res) => {
    try {
        const {
            pickup_location,
            drop_location,
            name,
            phone_number,
            shifting_date,
            vehicle_detail,
            status
        } = req.body;

        const transportData = {
            pickup_location,
            drop_location,
            name,
            phone_number,
            shifting_date,
            vehicle_detail,
            status
        };

        // Assign logged-in user if available
        if (req.user && req.user.role === 'User') {
            transportData.user = req.user.id; // store the user's ObjectId
        } else {
            transportData.user = null; // Guest submissions
        }

        const transport = new VehicleTransport(transportData);
        await transport.save();

        res.status(201).json({ 
            message: 'Transport request created successfully', 
            transport 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};


// Get all transport requests
exports.getAllTransports = async (req, res) => {
    try {
        const transports = await VehicleTransport.find().sort({ created_date: -1 });
        res.json(transports);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get transport by ID
exports.getTransportById = async (req, res) => {
    try {
        const { id } = req.params;
        const transport = await VehicleTransport.findById(id);
        if (!transport) return res.status(404).json({ message: 'Transport not found' });
        res.json(transport);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update transport
exports.updateTransport = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const updated = await VehicleTransport.findByIdAndUpdate(id, updates, {
            new: true,
            runValidators: true
        });

        if (!updated) return res.status(404).json({ message: 'Transport not found' });

        res.json({ message: 'Transport updated successfully', transport: updated });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });

    }
};

// Delete transport
exports.deleteTransport = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await VehicleTransport.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ message: 'Transport not found' });
        res.json({ message: 'Transport deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};


exports.getMyTransports = async (req, res) => {
    try {
        if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

        // Use the imported model name
        const transports = await VehicleTransport.find({ user: req.user.id }).sort({ created_date: -1 });

        res.status(200).json(transports);
    } catch (err) {
        console.error('Error fetching user transports:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

