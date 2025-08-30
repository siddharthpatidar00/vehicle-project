const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const { protect , adminOnly } = require('../middleware/authMiddleware');

// Public Routes
router.post('/register', usersController.createUser);
router.post('/login', usersController.loginUser);

// Protected Routes
router.get('/', protect,adminOnly, usersController.getAllUsers);

// Specific routes should be declared before generic /:id routes
router.put('/change-password', protect, usersController.changePassword);

router.get('/:id', protect, usersController.getUserById);
router.put('/:id', protect, usersController.updateUser);
router.delete('/:id', protect,adminOnly, usersController.deleteUser);

// Captcha
router.get('/captcha', (req, res) => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    res.json({ sessionCaptcha: code });
});

module.exports = router;
