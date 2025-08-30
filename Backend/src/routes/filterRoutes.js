const express = require("express");
const router = express.Router();
const Vehicle = require("../models/VehiclesModel");
const Brand = require("../models/vehicleBrandModel");
const Category = require("../models/VehicleCategoryModel");

router.get("/filters", async (req, res) => {
    try {
        const { category, brand, minPrice, maxPrice } = req.query;

        // --- Build query based on what user selects ---
        const query = {};
        if (category) query.category_name = category;
        if (brand) query.brand = brand;
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        // --- Fetch only vehicles relevant to the current page/filter ---
        const vehicles = await Vehicle.find(query);
        const brandsData = await Brand.find({ status: "Active" });
        const categoriesData = await Category.find({ status: "Active" });

        if (!vehicles || vehicles.length === 0) {
            return res.json({
                code: true,
                message: "No vehicles found.",
                result: { filters: {}, counts: {} }
            });
        }

        // --- PRICE FILTER (based on filtered vehicles) ---
        const prices = vehicles
            .filter(v => v.price !== undefined && v.price !== null)
            .map(v => v.price);

        let priceFilter = null;
        if (prices.length > 0) {
            priceFilter = {
                minOriginal: Math.min(...prices),
                maxOriginal: Math.max(...prices),
                contentType: "SiteCatalogFilterRange",
                filterType: "price"
            };
        }

        // --- BRANDS FILTER (counts from filtered vehicles) ---
        const brandCounts = {};
        vehicles.forEach(v => {
            if (v.brand) {
                brandCounts[v.brand] = (brandCounts[v.brand] || 0) + 1;
            }
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

        // --- CATEGORIES FILTER (counts from filtered vehicles) ---
        const categoryCounts = {};
        vehicles.forEach(v => {
            if (v.category_name) {
                categoryCounts[v.category_name] = (categoryCounts[v.category_name] || 0) + 1;
            }
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

        // Final Response
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
                    price: priceFilter
                        ? vehicles.filter(
                            v => v.price >= priceFilter.minOriginal && v.price <= priceFilter.maxOriginal
                        ).length
                        : 0,
                    brands: brands.length,
                    categories: categories.length
                }
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ code: false, message: "Server error" });
    }
});

module.exports = router;
