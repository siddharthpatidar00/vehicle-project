const express = require('express');
const router = express.Router();
const vehicleEnquiryController = require('../controllers/vehicleEnquiryController');
const { protect, protectOptional, adminOnly } = require('../middleware/authMiddleware');

// Anyone can submit an enquiry
router.post('/', protectOptional, vehicleEnquiryController.createEnquiry);

// Admin-only routes
router.get('/', protect, adminOnly, vehicleEnquiryController.getAllEnquiries);
router.get('/:id', protect, adminOnly, vehicleEnquiryController.getEnquiryById);
router.put('/:id', protect, adminOnly, vehicleEnquiryController.updateEnquiry);
router.delete('/:id', protect, adminOnly, vehicleEnquiryController.deleteEnquiry);

module.exports = router;
