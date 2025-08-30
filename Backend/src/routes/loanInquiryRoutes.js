const express = require("express");
const router = express.Router();
const loanInquiryController = require('../controllers/loanInquiryController')
const { protect, adminOnly } = require("../middleware/authMiddleware");

// Routes
router.post("/",loanInquiryController.createLoanInquiry);     
router.get("/", protect,adminOnly,loanInquiryController.getAllLoanInquiries);     
router.get("/:id",protect,adminOnly, loanInquiryController.getLoanInquiryById);   

module.exports = router;
