// // models/VehicleCategoryModel.js
// const mongoose = require('mongoose');

// // models/VehicleCategoryModel.js
// const VehicleCategorySchema = new mongoose.Schema({
//     category_name: {
//         type: String,
//     },
//     category_description: {
//         type: String
//     },
//     category_image: {
//         type: String
//     },
//     status: {
//         type: String,
//         enum: ['Active', 'Inactive'],
//         default: 'Active'
//     }
// }, {
//     timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } 
// });

// module.exports = mongoose.model('Vehicle_categories', VehicleCategorySchema);







const mongoose = require('mongoose');

const VehicleCategorySchema = new mongoose.Schema({
    category_name: {
        type: String,
        required: true,
        trim: true, // ✅ removes leading/trailing spaces
        set: v => v.replace(/\s+/g, ' ').trim() // ✅ compress multiple spaces
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

// ✅ Pre-save hook for extra safety
VehicleCategorySchema.pre('save', function (next) {
    if (this.category_name) {
        this.category_name = this.category_name.replace(/\s+/g, ' ').trim();
    }
    next();
});

module.exports = mongoose.model('Vehicle_categories', VehicleCategorySchema);
