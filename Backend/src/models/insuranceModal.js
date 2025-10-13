const mongoose = require("mongoose");

const insuranceSchema = new mongoose.Schema(
    {
        fullName: { type: String },
        mobile: { type: String },
        policyNumber: { type: Number },
        insuranceType: { type: String }, 
        vehicleDetail: { type: String},
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Insurance", insuranceSchema);
