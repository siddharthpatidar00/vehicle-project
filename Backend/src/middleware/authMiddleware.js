const jwt = require('jsonwebtoken');
const User = require('../models/UsersModel');
const Admin = require('../models/Admin');
const Staff = require('../models/StaffModel');

// Protect route middleware (requires authentication)
exports.protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        token = req.headers.authorization.split(' ')[1];

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Check for Admin
            if (decoded.role === 'Admin') {
                const admin = await Admin.findById(decoded.id).select('-password');
                if (!admin) {
                    return res.status(401).json({ message: 'Unauthorized: Admin not found' });
                }
                req.user = { id: admin._id, email: admin.email, role: 'Admin' };
            }
            // Check for Staff
            else if (decoded.role === 'Staff') {
                const staff = await Staff.findById(decoded.id).select('-password');
                if (!staff) {
                    return res.status(401).json({ message: 'Unauthorized: Staff not found' });
                }
                req.user = { id: staff._id, email: staff.email, role: 'Staff' };
            }
            // Check for User
            else if (decoded.role === 'User') {
                const user = await User.findById(decoded.id).select('-password -otp');
                if (!user) {
                    return res.status(401).json({ message: 'Unauthorized: User not found' });
                }
                req.user = { id: user._id, email: user.email, role: 'User' };
            }
            else {
                return res.status(401).json({ message: 'Invalid role in token' });
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

// Optional authentication middleware (does not block if no token)
exports.protectOptional = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        token = req.headers.authorization.split(' ')[1];

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            if (decoded.role === 'Admin') {
                const admin = await Admin.findById(decoded.id).select('-password');
                if (admin) req.user = { id: admin._id, email: admin.email, role: 'Admin' };
            } else if (decoded.role === 'Staff') {
                const staff = await Staff.findById(decoded.id).select('-password');
                if (staff) req.user = { id: staff._id, email: staff.email, role: 'Staff' };
            } else if (decoded.role === 'User') {
                const user = await User.findById(decoded.id).select('-password -otp');
                if (user) req.user = { id: user._id, email: user.email, role: 'User' };
            }
        } catch (err) {
            console.error('JWT optional error:', err.message);
        }
    }

    // ✅ If no token or invalid token, treat as Guest
    if (!req.user) {
        req.user = { id: null, email: null, role: 'Guest' };
    }

    next();
};


// Middleware to allow only Admins
exports.adminOnly = (req, res, next) => {
    if (!req.user || req.user.role !== 'Admin') {
        return res.status(403).json({ message: 'Access denied: Admins only' });
    }
    next();
};

// Middleware to allow Admin or Staff
exports.adminOrStaffOnly = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Not authorized' });
    }
    if (!['Admin', 'Staff'].includes(req.user.role)) {
        return res.status(403).json({ message: 'Access denied: Admin or Staff only' });
    }
    next();
};












// const jwt = require('jsonwebtoken');
// const User = require('../models/UsersModel');
// const Admin = require('../models/Admin');
// const Staff = require('../models/StaffModel');

// // Centralized roles
// const ROLES = {
//     ADMIN: 'Admin',
//     STAFF: 'Staff',
//     USER: 'User',
// };

// // Generic function to get user by role
// const getUserByRole = async (role, id) => {
//     switch (role) {
//         case ROLES.ADMIN:
//             return await Admin.findById(id).select('-password');
//         case ROLES.STAFF:
//             return await Staff.findById(id).select('-password');
//         case ROLES.USER:
//             return await User.findById(id).select('-password -otp');
//         default:
//             return null;
//     }
// };

// // Middleware: Protect route (required authentication)
// exports.protect = async (req, res, next) => {
//     const authHeader = req.headers.authorization;

//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//         return res.status(401).json({ code: 'NO_TOKEN', message: 'No token provided' });
//     }

//     const token = authHeader.split(' ')[1];

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);

//         const user = await getUserByRole(decoded.role, decoded.id);

//         if (!user) {
//             return res.status(401).json({ code: 'USER_NOT_FOUND', message: 'Unauthorized: User not found' });
//         }

//         req.user = { id: user._id, email: user.email, role: decoded.role };
//         next();
//     } catch (err) {
//         console.error('JWT Error:', err.message);

//         // Specific JWT error handling
//         if (err.name === 'TokenExpiredError') {
//             return res.status(401).json({ code: 'TOKEN_EXPIRED', message: 'Token has expired' });
//         }
//         if (err.name === 'JsonWebTokenError') {
//             return res.status(401).json({ code: 'INVALID_TOKEN', message: 'Invalid token' });
//         }

//         return res.status(401).json({ code: 'TOKEN_ERROR', message: 'Not authorized, token failed' });
//     }
// };

// // Middleware: Optional authentication (does not block if token missing)
// exports.protectOptional = async (req, res, next) => {
//     const authHeader = req.headers.authorization;

//     if (authHeader && authHeader.startsWith('Bearer ')) {
//         const token = authHeader.split(' ')[1];

//         try {
//             const decoded = jwt.verify(token, process.env.JWT_SECRET);
//             const user = await getUserByRole(decoded.role, decoded.id);

//             if (user) {
//                 req.user = { id: user._id, email: user.email, role: decoded.role };
//             }
//         } catch (err) {
//             console.error('JWT optional error:', err.message);
//             // Do not block, just skip attaching req.user
//         }
//     }

//     next();
// };

// // Middleware: Authorize roles
// exports.authorizeRoles = (allowedRoles = []) => (req, res, next) => {
//     if (!req.user) {
//         return res.status(401).json({ code: 'NOT_AUTHORIZED', message: 'Not authorized' });
//     }

//     if (!allowedRoles.includes(req.user.role)) {
//         return res.status(403).json({ code: 'ACCESS_DENIED', message: 'Access denied' });
//     }

//     next();
// };
