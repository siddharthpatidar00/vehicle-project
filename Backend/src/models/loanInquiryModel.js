const mongoose = require("mongoose");

const loanInquirySchema = new mongoose.Schema(
    {
        fullName: { type: String },
        email: { type: String },
        mobile: { type: String },
        loanAmount: { type: Number },
        tenure: { type: Number }, 
        annualIncome: { type: Number},
        vehicleDetail: { type: String},
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
    },
    { timestamps: true }
);

module.exports = mongoose.model("LoanInquiry", loanInquirySchema);
