const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
const Staff = require('../models/StaffModel');

// Generate JWT token
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

// Unified login for Admin and Staff
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Check Admin first
        let user = await Admin.findOne({ email });
        let role = 'Admin';

        // If not Admin, check Staff
        if (!user) {
            user = await Staff.findOne({ email });
            role = 'Staff';
        }

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Compare password
        let isMatch;
        if (role === 'Admin') {
            // Admin password may have a method matchPassword
            isMatch = await user.matchPassword
                ? await user.matchPassword(password)
                : await bcrypt.compare(password, user.password);
        } else {
            isMatch = await bcrypt.compare(password, user.password);
        }

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = generateToken(user._id, role);

        return res.json({
            token,
            user: {
                id: user._id,
                email: user.email,
                role,
                ...(role === 'Staff' ? { first_name: user.first_name, last_name: user.last_name } : {})
            }
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
};
