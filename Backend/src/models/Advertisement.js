const mongoose = require("mongoose");

const adSchema = new mongoose.Schema(
    {
        type: { type: String, enum: ["ad1", "ad2", "ad3"] },
        image: { type: String},
        imageTitle: { type: String},
        isActive: { type: Boolean},
        startDate: { type: Date},
        endDate: { type: Date },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Advertisement", adSchema);
