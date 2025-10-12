const VehicleEnquiry = require('../models/VehicleEnquiryModel');

exports.createEnquiry = async (req, res) => {
    try {
        const enquiryData = req.body;

        // Admin cannot create enquiries
        if (req.user.role === "Admin") {
            return res.status(403).json({ message: "Admins cannot create enquiries." });
        }

        // User submission
        if (req.user.role === "User") {
            enquiryData.user = req.user.id;
            enquiryData.created_by = "User";
            enquiryData.email = req.user.email;
        }
        // Guest submission
        else if (req.user.role === "Guest") {
            enquiryData.user = null;
            enquiryData.created_by = "Guest";
        }

        // Remove admin-only fields if present
        const adminOnlyFields = [
            'loan', 'bank_name', 'loan_status',
            'expected_delivery_date', 'delivery_status', 'delivery_location',
            'delivered_date', 'customer_feedback', 'delivery_proof'
        ];
        adminOnlyFields.forEach(field => delete enquiryData[field]);

        const newEnquiry = new VehicleEnquiry(enquiryData);
        await newEnquiry.save();

        res.status(201).json({
            message: "Enquiry created successfully",
            enquiry: newEnquiry
        });
    } catch (err) {
        console.error("Error in createEnquiry:", err);
        res.status(500).json({ error: "Internal Server Error", details: err.message });
    }}





exports.getAllEnquiries = async (req, res) => {
    try {
        if (!req.user || !['Admin', 'Staff'].includes(req.user.role)) {
            return res.status(403).json({ message: 'Only admin/staff can view all enquiries' });
        }

        const enquiries = await VehicleEnquiry.find()
            .populate('user', 'first_name last_name email')
            .sort({ created_date: -1 });

        res.status(200).json(enquiries);
    } catch (err) {
        console.error('Error fetching all enquiries:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getEnquiryById = async (req, res) => {
    try {
        const enquiry = await VehicleEnquiry.findById(req.params.id)
            .populate('user', 'name email');
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
        if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

        // Only fetch enquiries created by registered users
        const filter = { created_by: 'User' };

        const enquiries = await VehicleEnquiry.find(filter)
            .populate('user', 'first_name last_name email') // populate user info
            .select('name status loan_status delivery_status created_date user created_by')
            .sort({ created_date: -1 });

        res.status(200).json(enquiries);
    } catch (err) {
        console.error('Error fetching user enquiries:', err);
        res.status(500).json({ message: 'Server error' });
    }
};




exports.getMyEnquiryById = async (req, res) => {
    try {
        if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

        const filter = req.user.role === 'User'
            ? { _id: req.params.id, user: req.user.id }
            : req.user.role === 'Guest'
                ? { _id: req.params.id, created_by: 'Guest' }
                : { _id: req.params.id }; // Admin/Staff

        const enquiry = await VehicleEnquiry.findOne(filter).populate('user', 'first_name last_name email');
        if (!enquiry) return res.status(404).json({ message: 'Enquiry not found or access denied' });

        res.status(200).json(enquiry);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

