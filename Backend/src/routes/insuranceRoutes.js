const express = require("express");
const router = express.Router();
const insuranceController = require("../controllers/insuranceController");
const { protect,adminOrStaffOnly } = require("../middleware/authMiddleware");
// Create new insurance
router.post("/",protect, insuranceController.createInsurance);
router.get("/my-insurance-inquiries", protect, insuranceController.getMyInsuranceInquiries);
// Get all insurances (Admins only)
router.get("/", protect, adminOrStaffOnly, insuranceController.getAllInsurances);
// Get insurance by ID (Admins only)
router.get("/:id", protect, adminOrStaffOnly, insuranceController.getInsuranceById);
module.exports = router;
