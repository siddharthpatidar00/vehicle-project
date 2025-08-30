const express = require('express');
const router = express.Router();
const transportController = require('../controllers/vehicleTransportController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { allowRoles } = require('../middleware/authorizeRole');

//  Only USERS can create transport
router.post('/', transportController.createTransport);

//  Only ADMIN can view all transport requests
router.get('/', protect, adminOnly, allowRoles('Admin'), transportController.getAllTransports);

//  Shared: Admin and user can view by ID (optional)
router.get('/:id', protect, transportController.getTransportById);

//  Only admin can update/delete (optional)
router.put('/:id', protect, adminOnly, allowRoles('Admin'), transportController.updateTransport);
router.delete('/:id', protect, adminOnly, allowRoles('Admin'), transportController.deleteTransport);

module.exports = router;
