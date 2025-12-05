const Product = require("../models/productModel");
const asyncErrorHandler = require("../middlewares/asyncErrorHandler");
const SearchFeatures = require("../utils/searchFeatures");
const ErrorHandler = require("../utils/errorHandler");
const cloudinary = require("cloudinary");

// Get All Products
exports.getAllProducts = asyncErrorHandler(async (req, res, next) => {

    const resultPerPage = 12;

    const searchFeature = new SearchFeatures(Product.find(), req.query)
        .search()
        .filter();

    const filteredProducts = await searchFeature.query.clone();
    const filteredProductsCount = filteredProducts.length;
    const productsCount = await Product.countDocuments();

    searchFeature.pagination(resultPerPage);
    const paginatedProducts = await searchFeature.query.clone();

    res.status(200).json({
        success: true,
        products: paginatedProducts,
        productsCount,
        resultPerPage,
        filteredProductsCount,
    });
});

// Slider Products
exports.getProducts = asyncErrorHandler(async (req, res, next) => {
    const products = await Product.find();
    res.status(200).json({ success: true, products });
});

// Product Details
exports.getProductDetails = asyncErrorHandler(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler("Product Not Found", 404));
    }

    res.status(200).json({ success: true, product });
});

// Admin Get All Products
exports.getAdminProducts = asyncErrorHandler(async (req, res, next) => {
    const products = await Product.find();
    res.status(200).json({ success: true, products });
});
