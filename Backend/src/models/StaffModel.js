const mongoose = require('mongoose');

const StaffSchema = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    user_type: { type: String, enum: ['subadmin', 'manager', 'admin', 'ceo'], default: 'subadmin' },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' }
}, {
    timestamps: { createdAt: 'Created_date', updatedAt: 'Updated_date' }
});

module.exports = mongoose.model('Staff', StaffSchema);
