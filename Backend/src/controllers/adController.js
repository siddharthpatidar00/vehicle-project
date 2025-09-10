const Advertisement = require("../models/Advertisement");

// Create Advertisement
exports.createAd = async (req, res) => {
    try {
        const { type, imageTitle, startDate, endDate, isActive } = req.body;
        const image = req.file ? `/uploads/${req.file.filename}` : null;

        if (!image) return res.status(400).json({ message: "Ad image is required" });

        const ad = new Advertisement({ type, image, imageTitle, startDate, endDate, isActive });
        await ad.save();

        res.status(201).json({ message: "Ad created successfully", ad });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all ads
exports.getAds = async (req, res) => {
    try {
        const ads = await Advertisement.find();
        res.json(ads);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update ad
exports.updateAd = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        // If a new image is uploaded, automatically resize via middleware
        if (req.file) updates.image = `/uploads/${req.file.filename}`;

        const ad = await Advertisement.findByIdAndUpdate(id, updates, { new: true });
        if (!ad) return res.status(404).json({ message: "Ad not found" });

        res.json({ message: "Ad updated successfully", ad });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete ad
exports.deleteAd = async (req, res) => {
    try {
        const { id } = req.params;
        await Advertisement.findByIdAndDelete(id);
        res.json({ message: "Ad deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
