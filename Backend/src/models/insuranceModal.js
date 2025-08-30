const mongoose = require("mongoose");

const insuranceSchema = new mongoose.Schema(
    {
        fullName: { type: String },
        mobile: { type: String },
        policyNumber: { type: Number },
        insuranceType: { type: String }, 
        vehicleDetail: { type: String},
    },
    { timestamps: true }
);

module.exports = mongoose.model("Insurance", insuranceSchema);
