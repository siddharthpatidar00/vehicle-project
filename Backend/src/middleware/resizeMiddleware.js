const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

// Dimensions for each ad type
const adDimensions = {
    ad1: { width: 1350, height: 65 },
    ad2: { width: 1350, height: 65 },
    ad3: { width: 503, height: 620 },
};

const resizeImage = async (req, res, next) => {
    if (!req.file) return next();

    const { type } = req.body;
    if (!type || !adDimensions[type]) {
        return res.status(400).json({ message: "Invalid or missing ad type" });
    }

    const { width, height } = adDimensions[type];
    const filePath = path.join(__dirname, `../uploads/${req.file.filename}`);

    try {
        // Resize and overwrite the original file directly
        await sharp(filePath)
            .resize(width, height)
            .toFile(filePath + "-resized.jpg");

        // Replace original file with resized
        fs.renameSync(filePath + "-resized.jpg", filePath);

        next();
    } catch (error) {
        return res.status(500).json({ message: "Image resize error", error: error.message });
    }
};


module.exports = resizeImage;
