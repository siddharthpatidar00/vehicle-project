// routes/adminRoutes.js
const express = require('express');
const { loginAdmin, registerAdmin } = require('../controllers/adminController');
const router = express.Router();

// Middleware to protect /register route
const protectRegisterRoute = (req, res, next) => {
    const secretKey = req.headers['x-internal-key'];
    if (!secretKey) {
        return res.status(400).json({ message: 'Missing x-internal-key header' });
    }
    if (secretKey !== process.env.INTERNAL_REGISTER_KEY) {
        return res.status(403).json({ message: 'Forbidden: Invalid internal key' });
    }
    next();
};

// Admin Login Route
router.post('/login', loginAdmin);

// Protected Admin Register Route
router.post('/register', protectRegisterRoute, registerAdmin);

module.exports = router;
