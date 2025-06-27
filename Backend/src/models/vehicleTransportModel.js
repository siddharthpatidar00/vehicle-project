const mongoose = require('mongoose');

const VehicleTransportSchema = new mongoose.Schema({
    pickup_location: {
        type: String,
        required: true
    },
    drop_location: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    phone_number: {
        type: String,
        required: true
    },
    shifting_date: {
        type: Date,
        required: true
    },
    vehicle_detail: {
        type: String, 
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'In Transit', 'Completed', 'Cancelled'],
        default: 'Pending'
    },
    created_date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Vehicle_transport', VehicleTransportSchema);
