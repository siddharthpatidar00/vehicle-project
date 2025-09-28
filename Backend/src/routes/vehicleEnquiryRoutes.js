// const express = require('express');
// const router = express.Router();
// const vehicleEnquiryController = require('../controllers/vehicleEnquiryController');
// const { protect, protectOptional, adminOnly } = require('../middleware/authMiddleware');

// // Anyone can submit an enquiry
// router.post('/', protectOptional, vehicleEnquiryController.createEnquiry);

// // Admin-only routes
// router.get('/', protect, adminOnly, vehicleEnquiryController.getAllEnquiries);
// router.get('/:id', protect, adminOnly, vehicleEnquiryController.getEnquiryById);
// router.put('/:id', protect, adminOnly, vehicleEnquiryController.updateEnquiry);
// router.delete('/:id', protect, adminOnly, vehicleEnquiryController.deleteEnquiry);

// // User routes - view only their own enquiries
// router.get('/my-enquiries', protect, vehicleEnquiryController.getMyEnquiries);
// router.get('/my-enquiries/:id', protect, vehicleEnquiryController.getMyEnquiryById);

// module.exports = router;




const express = require('express');
const router = express.Router();
const vehicleEnquiryController = require('../controllers/vehicleEnquiryController');
const { protect, protectOptional,adminOrStaffOnly } = require('../middleware/authMiddleware');

// Anyone can submit an enquiry
router.post('/', protectOptional, vehicleEnquiryController.createEnquiry);

// User routes - must come before admin routes
router.get('/my-enquiries', protect, vehicleEnquiryController.getMyEnquiries);
router.get('/my-enquiries/:id', protect, vehicleEnquiryController.getMyEnquiryById);

// Admin-only routes
router.get('/', protect, adminOrStaffOnly, vehicleEnquiryController.getAllEnquiries);
router.get('/:id', protect, adminOrStaffOnly, vehicleEnquiryController.getEnquiryById);
router.put('/:id', protect, adminOrStaffOnly, vehicleEnquiryController.updateEnquiry);
router.delete('/:id', protect, adminOrStaffOnly, vehicleEnquiryController.deleteEnquiry);

module.exports = router;
