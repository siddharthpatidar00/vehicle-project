// src/models/UsersModel.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UsersSchema = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    email: { type: String, required: true, unique: true },
    mobile: { type: String },
    company: { type: String },
    gst: { type: String },
    pan: { type: String },
    dob: { type: Date },
    aadhar: { type: String },
    password: { type: String, required: true },
    city: { type: String },
    address: { type: String },
    status: { type: String, enum: ['Active', 'Inactive', null], default: 'Active' },
    otp: { type: String },
    otpExpire: { type: Date },
    verified: { type: Boolean, default: false },
}, {
    timestamps: { createdAt: 'Created_date', updatedAt: 'Updated_date' }
});

UsersSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

UsersSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Users', UsersSchema);
