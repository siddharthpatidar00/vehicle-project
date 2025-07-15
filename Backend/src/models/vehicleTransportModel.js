const mongoose = require('mongoose');

const VehicleTransportSchema = new mongoose.Schema({
    pickup_location: {
        type: String,
    },
    drop_location: {
        type: String,
    },
    name: {
        type: String,
    },
    phone_number: {
        type: String,
    },
    shifting_date: {
        type: Date,
    },
    vehicle_detail: {
        type: String, 
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
