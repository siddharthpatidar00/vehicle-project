const mongoose = require('mongoose');

const VehicleBrandSchema = new mongoose.Schema({
    brand_name: {
        type: String,
        required: true,
        unique: true
    },
    brand_description: {
        type: String
    },
    brand_image: {
        type: String 
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active'
    }
});

module.exports = mongoose.model('Vehicle_brands', VehicleBrandSchema);
