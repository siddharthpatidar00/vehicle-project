// models/VehiclesModel.js
const mongoose = require('mongoose');

const VehiclesSchema = new mongoose.Schema({
    name: { type: String },
    category_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle_categories' },
    category_name: { type: String },
    brand_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle_brands' },
    brand: { type: String },
    model: { type: String },
    km_driven: { type: Number, default: 0 },
    description: { type: String },
    ownership: { type: String, enum: ['First', 'Second', 'Third', 'Fourth+'] },
    manufacture_year: { type: Number },
    isInsured: { type: Boolean, default: false },
    insuranceValidTill: { type: Date },
    img: {
        type: [String],
        validate: {
            validator: function (val) {
                return val.length <= 5;
            },
            message: 'You can upload a maximum of 5 images.'
        }
    },
    price: { type: Number, min: 0 },
    status: {
        type: String,
        enum: ['Inactive', 'Available', 'Sold', 'Rented', 'Maintenance'],
        default: 'Inactive'
    },
    sell_or_rent: { type: String, enum: ['Sell', 'Rent'] },
    phone: { type: String, default: null },
    // This tells us whether an Admin or User created the record
    createdBy: { type: String, enum: ['Admin', 'User'], required: true },

}, {
    timestamps: { createdAt: 'Created_date', updatedAt: 'Updated_date' }
});

module.exports = mongoose.model('Vehicles', VehiclesSchema);