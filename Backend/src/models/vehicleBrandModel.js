// const mongoose = require('mongoose');

// const VehicleBrandSchema = new mongoose.Schema({
//     brand_name: {
//         type: String,
//         required: true,
//         unique: true
//     },
//     brand_description: {
//         type: String
//     },
//     brand_image: {
//         type: String 
//     },
//     status: {
//         type: String,
//         enum: ['Active', 'Inactive'],
//         default: 'Active'
//     }
// },
// {
//     timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } 
// });

// module.exports = mongoose.model('Vehicle_brands', VehicleBrandSchema);











const mongoose = require('mongoose');

const VehicleBrandSchema = new mongoose.Schema({
    brand_name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        set: v => v.replace(/\s+/g, ' ').trim()
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
}, {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
});

VehicleBrandSchema.pre('save', function (next) {
    if (this.brand_name) {
        this.brand_name = this.brand_name.replace(/\s+/g, ' ').trim();
    }
    next();
});

module.exports = mongoose.model('Vehicle_brands', VehicleBrandSchema);
