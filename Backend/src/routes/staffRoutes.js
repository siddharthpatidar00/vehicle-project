const express = require('express');
const router = express.Router();
const staffController = require('../controllers/staffController');
const { protect, adminOnly } = require("../middleware/authMiddleware");

// Create a staff member
router.post('/', protect, adminOnly, staffController.createStaff);
// Get all staff
router.get('/', protect, adminOnly, staffController.getAllStaff);
// Get single staff
router.get('/:id', protect, adminOnly, staffController.getStaffById);
// Update staff
router.put('/:id', protect, adminOnly, staffController.updateStaff);
// Delete staff
router.delete('/:id', protect, adminOnly, staffController.deleteStaff);

module.exports = router;