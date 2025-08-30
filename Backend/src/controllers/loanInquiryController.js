const LoanInquiry = require("../models/loanInquiryModel");

// ✅ Create Loan Inquiry
exports.createLoanInquiry = async (req, res) => {
    try {
        const inquiry = new LoanInquiry(req.body);
        const savedInquiry = await inquiry.save();
        res.status(201).json({ success: true, data: savedInquiry });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// ✅ Get All Loan Inquiries
exports.getAllLoanInquiries = async (req, res) => {
    try {
        const inquiries = await LoanInquiry.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: inquiries });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ✅ Get Loan Inquiry by ID
exports.getLoanInquiryById = async (req, res) => {
    try {
        const inquiry = await LoanInquiry.findById(req.params.id);
        if (!inquiry) {
            return res.status(404).json({ success: false, message: "Inquiry not found" });
        }
        res.status(200).json({ success: true, data: inquiry });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
