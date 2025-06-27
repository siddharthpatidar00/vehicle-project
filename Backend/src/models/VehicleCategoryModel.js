// models/VehicleCategoryModel.js
const mongoose = require('mongoose');

const VehicleCategorySchema = new mongoose.Schema({
    category_name: {
        type: String,
        required: true,
    },
    category_description: {
        type: String
    },
    category_image: {
        type: String
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active'
    }
});

module.exports = mongoose.model('Vehicle_categories', VehicleCategorySchema);