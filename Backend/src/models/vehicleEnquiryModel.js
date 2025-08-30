const mongoose = require('mongoose');

const VehicleEnquirySchema = new mongoose.Schema({
    vehicle_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicles' },
    name: String,
    company: String,
    city: String,
    email: String,
    phone_number: String,
    message: String,
    brand: String,
    category: String,
    vehicle_details: String,
    buy_sell_rent: { type: String, enum: ['Buy', 'Sell', 'Rent'] },
    created_by: { type: String, enum: ['Guest', 'User']},
    status: { type: String, enum: ['New', 'In Progress', 'Closed'], default: 'New' },
    enquiry_type: { type: String, enum: ['Individual', 'Company'], default: 'Individual' },

    // Admin-only loan fields
    loan: { type: String, enum: ['yes', 'no'] },
    bank_name: { type: String },
    loan_status: { type: String, enum: ['initiated', 'approved', 'rejected'] },

    // Admin-only delivery process
    expected_delivery_date: { type: Date },
    delivery_status: { type: String, enum: ['pending', 'in transit', 'ready for delivery'] },
    delivery_location: { type: String },

    // Admin-only delivered fields
    delivered_date: { type: Date },
    customer_feedback: { type: String },
    delivery_proof: { type: String } 
}, {
    timestamps: { createdAt: 'created_date', updatedAt: 'updated_date' }
});

module.exports = mongoose.model('Vehicle_Enquiry', VehicleEnquirySchema);
