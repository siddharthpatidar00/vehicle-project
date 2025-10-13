const express = require("express");
const router = express.Router();
const loanInquiryController = require('../controllers/loanInquiryController')
const { protect, adminOrStaffOnly } = require("../middleware/authMiddleware");

// Public route to create inquiry
router.post("/", protect, loanInquiryController.createLoanInquiry);     

// Logged-in users can fetch their own inquiries
router.get("/my-inquiries", protect, loanInquiryController.getMyLoanInquiries);

// Admin/staff routes
router.get("/", protect, adminOrStaffOnly, loanInquiryController.getAllLoanInquiries);     
router.get("/:id", protect, adminOrStaffOnly, loanInquiryController.getLoanInquiryById);   

module.exports = router;
