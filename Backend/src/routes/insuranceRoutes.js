const express = require("express");
const router = express.Router();
const insuranceController = require("../controllers/insuranceController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// Create new insurance
router.post("/", insuranceController.createInsurance);

// Get all insurances (Admins only)
router.get("/", protect, adminOnly, insuranceController.getAllInsurances);

// Get insurance by ID (Admins only)
router.get("/:id", protect, adminOnly, insuranceController.getInsuranceById);

module.exports = router;
