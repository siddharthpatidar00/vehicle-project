const express = require('express');
const router = express.Router();
const { loginUser } = require('../controllers/authController');

// Unified login route for Admin & Staff
router.post('/', loginUser);

module.exports = router;
