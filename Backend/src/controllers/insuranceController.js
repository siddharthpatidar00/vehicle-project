const Insurance = require("../models/insuranceModal");

// Create new insurance
exports.createInsurance = async (req, res) => {
    try {
        const insurance = new Insurance(req.body);
        const savedInsurance = await insurance.save();
        res.status(201).json(savedInsurance);
    } catch (error) {
        res.status(400).json({ message: "Error creating insurance", error });
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
