const Insurance = require("../models/insuranceModal");

// Create new insurance
exports.createInsurance = async (req, res) => {
    try {
        const insuranceData = { ...req.body };

        // Attach logged-in user if available
        if (req.user && req.user.role === 'User') {
            insuranceData.user = req.user.id;
            insuranceData.mobile = insuranceData.mobile || req.user.mobile; // optional override
        }

        const insurance = new Insurance(insuranceData);
        const savedInsurance = await insurance.save();

        res.status(201).json({ success: true, data: savedInsurance });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};


// Get all insurances
exports.getAllInsurances = async (req, res) => {
    try {
        const insurances = await Insurance.find();
        res.status(200).json(insurances);
    } catch (error) {
        res.status(500).json({ message: "Error fetching insurances", error });
    }
};

// Get insurance by ID
exports.getInsuranceById = async (req, res) => {
    try {
        const insurance = await Insurance.findById(req.params.id);
        if (!insurance) {
            return res.status(404).json({ message: "Insurance not found" });
        }
        res.status(200).json(insurance);
    } catch (error) {
        res.status(500).json({ message: "Error fetching insurance", error });
    }
};



exports.getMyInsuranceInquiries = async (req, res) => {
    try {
        if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
        const insurances = await Insurance.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: insurances });
    } catch (error) {
        console.error('Error fetching user insurances:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};
