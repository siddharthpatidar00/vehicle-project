const VehicleEnquiry = require('../models/VehicleEnquiryModel');

exports.createEnquiry = async (req, res) => {
    try {
        const enquiryData = req.body;
        if (req.user && req.user.id) {
            enquiryData.created_by = 'User';
        } else {
            enquiryData.created_by = 'Guest';
        }
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

        const enquiries = await VehicleEnquiry.find().sort({ createdAt: -1 }); 
        res.status(200).json(enquiries);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getEnquiryById = async (req, res) => {
    try {
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
