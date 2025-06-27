const express = require('express');
const router = express.Router();
const vehicleEnquiryController = require('../controllers/vehicleEnquiryController');
const { protect } = require('../middleware/authMiddleware');


router.post('/', protect, vehicleEnquiryController.createEnquiry);

router.get('/', protect, vehicleEnquiryController.getAllEnquiries);

router.get('/:id', protect, vehicleEnquiryController.getEnquiryById);

router.put('/:id', protect, vehicleEnquiryController.updateEnquiry);

router.delete('/:id', protect, vehicleEnquiryController.deleteEnquiry);

module.exports = router;
