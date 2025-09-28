// models/VehicleCategoryModel.js
const mongoose = require('mongoose');

// models/VehicleCategoryModel.js
const VehicleCategorySchema = new mongoose.Schema({
    category_name: {
        type: String,
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
}, {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } 
});

module.exports = mongoose.model('Vehicle_categories', VehicleCategorySchema);
