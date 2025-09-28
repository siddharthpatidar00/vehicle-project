// const mongoose = require('mongoose');

// const StaffSchema = new mongoose.Schema({
//     first_name: { type: String, required: true },
//     last_name: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
//     password: { type: String, required: true },
//     user_type: { type: String, enum: ['subadmin', 'manager', 'admin', 'ceo'], default: 'subadmin' },
//     status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' }
// }, {
//     timestamps: { createdAt: 'Created_date', updatedAt: 'Updated_date' }
// });

// module.exports = mongoose.model('Staff', StaffSchema);





const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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

// Hash password before save
StaffSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

module.exports = mongoose.model('Staff', StaffSchema);
