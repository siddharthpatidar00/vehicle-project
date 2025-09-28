const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Staff = require('../models/StaffModel');

// Generate JWT token for Staff
const generateStaffToken = (id) => {
    return jwt.sign({ id, role: 'Staff' }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

// Staff Login
exports.loginStaff = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const staff = await Staff.findOne({ email });
        if (!staff) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        if (!staff.password) {
            return res.status(500).json({ message: "Staff has no password set." });
        }

        const isMatch = await bcrypt.compare(password, staff.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const token = generateStaffToken(staff._id);

        return res.json({
            token,
            staff: {
                id: staff._id,
                first_name: staff.first_name,
                last_name: staff.last_name,
                email: staff.email,
                role: "Staff"
            }
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};


// Create Staff (Admin only)
exports.createStaff = async (req, res) => {
    try {
        // Check if user is staff
        if (req.user.user_type === 'staff') {
            return res.status(403).json({ message: 'Staff cannot create a new staff' });
        }

        const { first_name, last_name, email, password, user_type, status } = req.body;

        if (!first_name || !last_name || !email || !password) {
            return res.status(400).json({ message: 'Please fill all required fields' });
        }

        const existing = await Staff.findOne({ email });
        if (existing) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        const staff = new Staff({ first_name, last_name, email, password, user_type, status });
        await staff.save();

        return res.status(201).json({ message: 'Staff member created successfully', staff });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
};



// Get All Staff
exports.getAllStaff = async (req, res) => {
    try {
        const staffList = await Staff.find().sort({ Created_date: -1 });
        return res.json(staffList);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
};

// Get Staff by ID
exports.getStaffById = async (req, res) => {
    try {
        const staff = await Staff.findById(req.params.id);
        if (!staff) return res.status(404).json({ message: 'Not found' });
        return res.json(staff);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
};

// Update Staff
exports.updateStaff = async (req, res) => {
    try {
        const updated = await Staff.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) return res.status(404).json({ message: 'Not found' });
        return res.json({ message: 'Updated', staff: updated });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
};

// Delete Staff
exports.deleteStaff = async (req, res) => {
    try {
        const deleted = await Staff.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'Not found' });
        return res.json({ message: 'Deleted' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
};
