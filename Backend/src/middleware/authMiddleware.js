const jwt = require('jsonwebtoken');
const { ADMIN_EMAIL } = require('../config/adminConfig');
const User = require('../models/UsersModel');

exports.protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        token = req.headers.authorization.split(' ')[1];

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // ✅ Admin logic
            if (decoded.email === ADMIN_EMAIL) {
                req.user = {
                    id: 'admin-id',
                    email: ADMIN_EMAIL,
                    role: 'admin'
                };
            } else {
                // ✅ User logic
                const user = await User.findById(decoded.id).select('-password -otp');
                if (!user) {
                    return res.status(401).json({ message: 'Unauthorized: user not found' });
                }

                req.user = {
                    id: user._id,
                    email: user.email,
                    role: 'user' 
                };
            }

            next();
        } catch (err) {
            console.error('JWT Error:', err.message);
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        return res.status(401).json({ message: 'No token provided' });
    }
};
