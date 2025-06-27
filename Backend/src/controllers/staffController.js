const Staff = require('../models/StaffModel');

exports.createStaff = async (req, res) => {
    try {
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

exports.getAllStaff = async (req, res) => {
    try {
        const staffList = await Staff.find().sort({ Created_date: -1 });
        return res.json(staffList);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
};

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
