const express = require("express");
const router = express.Router();
const { createAd, getAds, updateAd, deleteAd } = require("../controllers/adController");
const upload = require("../config/multerConfig");
const resizeImage = require("../middleware/resizeMiddleware");

// Upload + resize handled automatically
router.post("/", upload.single("image"), resizeImage, createAd);
router.put("/:id", upload.single("image"), resizeImage, updateAd);

router.get("/", getAds);
router.delete("/:id", deleteAd);

module.exports = router;
