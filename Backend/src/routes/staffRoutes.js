// const express = require('express');
// const router = express.Router();
// const staffController = require('../controllers/staffController');
// const { protect, adminOnly } = require("../middleware/authMiddleware");

// // Create a staff member
// router.post('/', protect, adminOnly, staffController.createStaff);
// // Get all staff
// router.get('/', protect, adminOnly, staffController.getAllStaff);
// // Get single staff
// router.get('/:id', protect, adminOnly, staffController.getStaffById);
// // Update staff
// router.put('/:id', protect, adminOnly, staffController.updateStaff);
// // Delete staff
// router.delete('/:id', protect, adminOnly, staffController.deleteStaff);

// module.exports = router;





const express = require('express');
const router = express.Router();
const staffController = require('../controllers/staffController');
const { protect, adminOrStaffOnly, adminOnly } = require("../middleware/authMiddleware");

// =====================
// Public Route
// =====================

// Staff login (public)
router.post('/login', staffController.loginStaff);
router.post('/', protect, adminOnly, staffController.createStaff);

// =====================
// Admin-only route
// =====================

// Create staff - Admin only
// router.post('/', protect, (req, res, next) => {
//     if (req.user.role !== 'Admin') {
//         return res.status(403).json({ message: 'Access denied: Admin only' });
//     }
//     next();
// }, staffController.createStaff);

// =====================
// Admin + Staff shared routes
// =====================

// Get all staff
router.get('/', protect, adminOrStaffOnly, staffController.getAllStaff);

// Get single staff by ID
router.get('/:id', protect, adminOrStaffOnly, staffController.getStaffById);

// Update staff
router.put('/:id', protect, adminOrStaffOnly, staffController.updateStaff);

// Delete staff
router.delete('/:id', protect, adminOrStaffOnly, staffController.deleteStaff);

module.exports = router;
