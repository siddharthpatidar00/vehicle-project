// models/VehiclesModel.js
const mongoose = require('mongoose');

const VehiclesSchema = new mongoose.Schema({
    name: { type: String },
    category_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    brand_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand' },
    brand: { type: String },
    model: { type: String },
    km_driven: { type: Number, default: 0 },
    description: { type: String },
    ownership: { type: String, enum: ['First', 'Second', 'Third', 'Fourth+'] },
    manufacture_year: { type: Number },
    isInsured: { type: Boolean, default: false },
    insuranceValidTill: { type: Date },
    img: { type: String },
    price: { type: Number, min: 0 },
    status: { type: String, enum: ['Available', 'Sold', 'Rented', 'Maintenance'], default: 'Available' },
    sell_or_rent: { type: String, enum: ['Sell', 'Rent'] }
}, {
    timestamps: { createdAt: 'Created_date', updatedAt: 'Updated_date' }
});

module.exports = mongoose.model('Vehicles', VehiclesSchema);