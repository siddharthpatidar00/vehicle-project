const VehicleEnquiry = require('../models/VehicleEnquiryModel');

exports.createEnquiry = async (req, res) => {
    try {
        const enquiryData = req.body;
        enquiryData.created_by = (req.user && req.user.id) ? 'User' : 'Guest';
        const newEnquiry = new VehicleEnquiry(enquiryData);
        await newEnquiry.save();
        res.status(201).json({ message: 'Enquiry created successfully', enquiry: newEnquiry });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getAllEnquiries = async (req, res) => {
    try {
        if (!req.user || req.user.role !== 'Admin') {
            return res.status(403).json({ message: 'Only admin can view enquiries' });
        }

        const enquiries = await VehicleEnquiry.find().sort({ created_date: -1 });
        res.status(200).json(enquiries);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getEnquiryById = async (req, res) => {
    try {
        const enquiry = await VehicleEnquiry.findById(req.params.id);
        if (!enquiry) return res.status(404).json({ message: 'Enquiry not found' });
        res.json(enquiry);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateEnquiry = async (req, res) => {
    try {
        const enquiry = await VehicleEnquiry.findById(req.params.id);
        if (!enquiry) return res.status(404).json({ message: 'Enquiry not found' });

        if (req.user.role !== 'Admin') {
            const forbiddenFields = [
                'loan', 'bank_name', 'loan_status',
                'expected_delivery_date', 'delivery_status', 'delivery_location',
                'delivered_date', 'customer_feedback', 'delivery_proof'
            ];
            for (const field of forbiddenFields) {
                if (field in req.body) {
                    return res.status(403).json({ message: 'You are not authorized to update admin-only fields' });
                }
            }
        }

        const updated = await VehicleEnquiry.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({ message: 'Enquiry updated', enquiry: updated });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteEnquiry = async (req, res) => {
    try {
        const deleted = await VehicleEnquiry.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'Enquiry not found' });
        res.json({ message: 'Enquiry deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// ✅ Now properly outside deleteEnquiry
exports.getMyEnquiries = async (req, res) => {
    try {
        if (!req.user || req.user.role !== 'User') {
            return res.status(403).json({ message: 'Access denied: Users only' });
        }

        // Use email to get only this user's enquiries
        const enquiries = await VehicleEnquiry.find({ email: req.user.email })
            .select('name status loan_status delivery_status created_date') // only required fields
            .sort({ created_date: -1 }); // latest first

        res.status(200).json(enquiries);
    } catch (err) {
        console.error('Error fetching user enquiries:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getMyEnquiryById = async (req, res) => {
    try {
        const enquiry = await VehicleEnquiry.findOne({ _id: req.params.id, email: req.user.email });
        if (!enquiry) {
            return res.status(404).json({ message: 'Enquiry not found or you do not have permission' });
        }
        res.status(200).json(enquiry);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};
