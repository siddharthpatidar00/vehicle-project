const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const { protect } = require('../middleware/authMiddleware');

// ✅ Public Routes
router.post('/register', usersController.createUser);
router.post('/verify-otp', usersController.verifyOtp);
router.post('/resend-otp', usersController.resendOtp);
router.post('/login', usersController.loginUser);

// 🔐 Protected Routes
router.get('/', protect, usersController.getAllUsers);
router.get('/:id', protect, usersController.getUserById);
router.put('/:id', protect, usersController.updateUser);
router.delete('/:id', protect, usersController.deleteUser);

module.exports = router;
