const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const { protect } = require('../middleware/authMiddleware');

// ✅ Public Routes
router.post('/register', usersController.createUser);
router.post('/login', usersController.loginUser);

// 🔐 Protected Routes
router.get('/', protect, usersController.getAllUsers);
router.get('/:id', protect, usersController.getUserById);
router.put('/:id', protect, usersController.updateUser);
router.delete('/:id', protect, usersController.deleteUser);

router.get('/captcha', (req, res) => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase(); 
    res.json({ sessionCaptcha: code });
});



module.exports = router;
