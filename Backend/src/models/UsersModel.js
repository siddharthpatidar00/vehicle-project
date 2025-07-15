// src/models/UsersModel.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UsersSchema = new mongoose.Schema({
    first_name: { type: String},
    last_name: { type: String},
    gender: { type: String, enum: ['Male', 'Female', 'Other'] },
    email: { type: String, unique: true},
    password: { type: String },

    mobile: { type: String },
    company: { type: String },
    gst: { type: String },
    pan: { type: String },
    dob: { type: Date },
    aadhar: { type: String },
    city: { type: String },
    address: { type: String },
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active'
    },
    verified: {
        type: Boolean,
        default: true 
    }

}, {
    timestamps: { createdAt: 'Created_date', updatedAt: 'Updated_date' }
});

// Hash password before saving
UsersSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Method to compare password
UsersSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Users', UsersSchema);
