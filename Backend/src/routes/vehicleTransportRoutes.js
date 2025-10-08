const express = require('express');
const router = express.Router();
const transportController = require('../controllers/vehicleTransportController');
const { protect, adminOrStaffOnly,protectOptional } = require('../middleware/authMiddleware');
const { allowRoles } = require('../middleware/authorizeRole');


router.post('/',protectOptional, transportController.createTransport);

// Logged-in users can view their own transports
router.get('/my-transports', transportController.getMyTransports);

//  Only ADMIN can view all transport requests
router.get('/', protect, adminOrStaffOnly, allowRoles('Admin'), transportController.getAllTransports);

//  Shared: Admin and user can view by ID (optional)
router.get('/:id', protect, transportController.getTransportById);

//  Only admin can update/delete (optional)
router.put('/:id', protect, adminOrStaffOnly, allowRoles('Admin'), transportController.updateTransport);
router.delete('/:id', protect, adminOrStaffOnly, allowRoles('Admin'), transportController.deleteTransport);

module.exports = router;
