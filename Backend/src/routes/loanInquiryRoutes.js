const express = require("express");
const router = express.Router();
const loanInquiryController = require('../controllers/loanInquiryController')
const { protect,adminOrStaffOnly } = require("../middleware/authMiddleware");

// Routes
router.post("/",loanInquiryController.createLoanInquiry);     
router.get("/", protect,adminOrStaffOnly,loanInquiryController.getAllLoanInquiries);     
router.get("/:id",protect,adminOrStaffOnly, loanInquiryController.getLoanInquiryById);   

module.exports = router;
