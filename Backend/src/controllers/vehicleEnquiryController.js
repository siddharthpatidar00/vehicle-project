const VehicleEnquiry = require('../models/VehicleEnquiryModel');

exports.createEnquiry = async (req, res) => {
    try {
        // ✅ Block if not logged in or if role is admin
        if (!req.user || !req.user.id || req.user.role === 'admin') {
            return res.status(403).json({ message: 'Only users can create enquiries' });
        }

        const enquiryData = req.body;
        enquiryData.created_by = req.user.id;

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
        // 🛑 Only admin can access this route
        if (!req.user || req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Only admin can view enquiries' });
        }

        // ✅ Fetch all enquiries and populate the creator info
        const enquiries = await VehicleEnquiry.find().populate(
            'created_by',
            'first_name last_name email'
        );

        res.status(200).json(enquiries);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// GET /api/vehicle-enquiries/:id
exports.getEnquiryById = async (req, res) => {
    try {
        const enquiry = await VehicleEnquiry.findById(req.params.id).populate('created_by', 'first_name last_name email');
        if (!enquiry) return res.status(404).json({ message: 'Enquiry not found' });
        res.json(enquiry);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// // PUT /api/vehicle-enquiries/:id
// exports.updateEnquiry = async (req, res) => {
//     try {
//         const updated = await VehicleEnquiry.findByIdAndUpdate(req.params.id, req.body, { new: true });
//         if (!updated) return res.status(404).json({ message: 'Enquiry not found' });
//         res.json({ message: 'Enquiry updated', enquiry: updated });
//     } catch (err) {
//         res.status(500).json({ message: 'Server error' });
//     }
// };

exports.updateEnquiry = async (req, res) => {
    try {
        const enquiry = await VehicleEnquiry.findById(req.params.id);
        if (!enquiry) return res.status(404).json({ message: 'Enquiry not found' });

        // Non-admin users cannot update admin-only fields
        if (req.user.role !== 'admin') {
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


// DELETE /api/vehicle-enquiries/:id
exports.deleteEnquiry = async (req, res) => {
    try {
        const deleted = await VehicleEnquiry.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'Enquiry not found' });
        res.json({ message: 'Enquiry deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};
