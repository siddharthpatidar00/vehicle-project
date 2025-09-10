const Customer = require('../models/customerModal');

// Get all customers
exports.getAllCustomers = async (req, res) => {
    try {
        const customers = await Customer.find();
        res.status(200).json(customers);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Get single customer by ID
exports.getCustomerById = async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);
        if (!customer) return res.status(404).json({ message: 'Customer not found' });
        res.status(200).json(customer);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.createCustomer = async (req, res) => {
    try {
        const { name, message, image } = req.body;

        // If Multer file exists, use it; otherwise, check if image URL is provided
        const finalImage = req.file ? `/uploads/${req.file.filename}` : image;

        if (!finalImage) {
            return res.status(400).json({ message: 'Image is required' });
        }

        const newCustomer = new Customer({ name, message, image: finalImage });
        await newCustomer.save();
        res.status(201).json(newCustomer);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};


// Update customer by ID
exports.updateCustomer = async (req, res) => {
    try {
        const { name, message } = req.body;
        const updateData = { name, message };

        // If a new image is uploaded, update the image field
        if (req.file) {
            updateData.image = `/uploads/${req.file.filename}`;
        }

        const updatedCustomer = await Customer.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedCustomer) return res.status(404).json({ message: 'Customer not found' });

        res.status(200).json(updatedCustomer);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Delete customer by ID
exports.deleteCustomer = async (req, res) => {
    try {
        const deletedCustomer = await Customer.findByIdAndDelete(req.params.id);
        if (!deletedCustomer) return res.status(404).json({ message: 'Customer not found' });
        res.status(200).json({ message: 'Customer deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};
