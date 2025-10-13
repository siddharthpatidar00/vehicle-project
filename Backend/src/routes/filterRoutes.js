const express = require("express");
const router = express.Router();
const Vehicle = require("../models/VehiclesModel");
const Brand = require("../models/vehicleBrandModel");
const Category = require("../models/VehicleCategoryModel");

router.get("/filters", async (req, res) => {
    try {
        const { category, brand, category_name, brand_name, minPrice, maxPrice } = req.query;

        const query = {};
        if (category || category_name) {
            query.category_name = { $regex: new RegExp(`^${(category || category_name).trim()}$`, 'i') };
        }
        if (brand || brand_name) {
            query.brand = { $regex: new RegExp(`^${(brand || brand_name).trim()}$`, 'i') };
        }

        // Fetch vehicles filtered by brand/category first
        let vehicles = await Vehicle.find(query);

        // Determine price range
        let minPriceValue = Number(minPrice);
        let maxPriceValue = Number(maxPrice);

        // If minPrice is invalid, default to 0
        if (isNaN(minPriceValue)) minPriceValue = 0;

        // If maxPrice is invalid, get max price from filtered vehicles
        if (isNaN(maxPriceValue)) {
            const prices = vehicles.map(v => v.price || 0);
            maxPriceValue = prices.length ? Math.max(...prices) : 0;
        }

        // Apply price filter only if maxPrice > 0
        if (maxPriceValue > 0) {
            query.price = { $gte: minPriceValue, $lte: maxPriceValue };
            vehicles = await Vehicle.find(query); // Re-fetch vehicles with price filter
        }

        console.log('Final Mongo Query:', query);

        // Fetch brands and categories for filters
        const brandsData = await Brand.find({ status: "Active" });
        const categoriesData = await Category.find({ status: "Active" });

        // --- PRICE FILTER object for frontend ---
        const priceFilter = {
            minOriginal: 0,
            maxOriginal: maxPriceValue,
            contentType: "SiteCatalogFilterRange",
            filterType: "price"
        };

        // --- BRANDS FILTER ---
        const brandCounts = {};
        vehicles.forEach(v => {
            if (v.brand) brandCounts[v.brand] = (brandCounts[v.brand] || 0) + 1;
        });

        const brands = brandsData.map(b => ({
            _id: b._id,
            name: b.brand_name,
            slug: b.brand_name.toLowerCase().replace(/\s+/g, "-"),
            count: brandCounts[b.brand_name] || 0,
            image: b.brand_image,
            description: b.brand_description,
            contentType: "SiteCatalogFilterList",
            filterType: "brand"
        }));

        // --- CATEGORIES FILTER ---
        const categoryCounts = {};
        vehicles.forEach(v => {
            if (v.category_name) categoryCounts[v.category_name] = (categoryCounts[v.category_name] || 0) + 1;
        });

        const categories = categoriesData.map(c => ({
            _id: c._id,
            name: c.category_name,
            slug: c.category_name.toLowerCase().replace(/\s+/g, "-"),
            count: categoryCounts[c.category_name] || 0,
            image: c.category_image,
            description: c.category_description,
            level: "root",
            parentId: null,
            subCategories: [],
            contentType: "SiteCatalogFilterList",
            filterType: "category"
        }));

        // --- Final Response ---
        res.json({
            code: true,
            message: "Successfully retrieved filters.",
            result: {
                filters: {
                    ...(priceFilter ? { price: priceFilter } : {}),
                    brands,
                    categories
                },
                counts: {
                    price: vehicles.length,
                    brands: brands.length,
                    categories: categories.length
                },
                vehicles: vehicles 
            }
        });


    } catch (err) {
        console.error(err);
        res.status(500).json({ code: false, message: "Server error" });
    }
});

module.exports = router;
