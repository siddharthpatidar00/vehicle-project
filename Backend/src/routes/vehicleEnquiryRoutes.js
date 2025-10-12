// const express = require('express');
// const router = express.Router();
// const vehicleEnquiryController = require('../controllers/vehicleEnquiryController');
// const { protect, protectOptional,adminOrStaffOnly,authorizeRoles } = require('../middleware/authMiddleware');

// // Anyone can submit an enquiry
// router.post('/',protectOptional, vehicleEnquiryController.createEnquiry);

// // User routes - must come before admin routes
// router.get('/my-enquiries', protect, vehicleEnquiryController.getMyEnquiries);
// router.get('/my-enquiries/:id', protect, vehicleEnquiryController.getMyEnquiryById);

// // Admin-only routes
// router.get('/', protect, adminOrStaffOnly, vehicleEnquiryController.getAllEnquiries);
// router.get('/:id', protect, adminOrStaffOnly, vehicleEnquiryController.getEnquiryById);
// router.put('/:id', protect, adminOrStaffOnly, vehicleEnquiryController.updateEnquiry);
// router.delete('/:id', protect, adminOrStaffOnly, vehicleEnquiryController.deleteEnquiry);

// module.exports = router;






const express = require('express');
const router = express.Router();
const vehicleEnquiryController = require('../controllers/vehicleEnquiryController');
const { protect, protectOptional, adminOrStaffOnly } = require('../middleware/authMiddleware');

// Anyone can submit an enquiry (User or Guest)
router.post('/', protectOptional, vehicleEnquiryController.createEnquiry);

// User routes
router.get('/my-enquiries', protect, vehicleEnquiryController.getMyEnquiries);
router.get('/my-enquiries/:id', protect, vehicleEnquiryController.getMyEnquiryById);

// Admin-only routes
router.get('/', protect, adminOrStaffOnly, vehicleEnquiryController.getAllEnquiries);
router.get('/:id', protect, adminOrStaffOnly, vehicleEnquiryController.getEnquiryById);
router.put('/:id', protect, adminOrStaffOnly, vehicleEnquiryController.updateEnquiry);
router.delete('/:id', protect, adminOrStaffOnly, vehicleEnquiryController.deleteEnquiry);

module.exports = router;



