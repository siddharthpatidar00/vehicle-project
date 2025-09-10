const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    firstName: { type: String},
    lastName: { type: String },
    mobile: { type: String },
    email: { type: String },
    message: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Contact', contactSchema);
