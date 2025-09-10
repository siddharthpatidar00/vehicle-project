const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    name: { type: String },
    image: { type: String },
    message: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Customer', customerSchema);
