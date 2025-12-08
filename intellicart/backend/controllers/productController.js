const Product = require("../models/productModel");
const asyncErrorHandler = require("../middlewares/asyncErrorHandler");
const SearchFeatures = require("../utils/searchFeatures");
const ErrorHandler = require("../utils/errorHandler");
const cloudinary = require("cloudinary");

// Get All Products (User & Admin)
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

// Product Slider
exports.getProducts = asyncErrorHandler(async (req, res, next) => {
    const products = await Product.find();
    res.status(200).json({ success: true, products });
});

// Product Details
exports.getProductDetails = asyncErrorHandler(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product) return next(new ErrorHandler("Product Not Found", 404));
    res.status(200).json({ success: true, product });
});

// Admin — Get All Products
exports.getAdminProducts = asyncErrorHandler(async (req, res, next) => {
    const products = await Product.find();
    res.status(200).json({ success: true, products });
});

// Admin — Create Product
exports.createProduct = asyncErrorHandler(async (req, res, next) => {
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, product });
});

// Admin — Update Product
exports.updateProduct = asyncErrorHandler(async (req, res, next) => {
    let product = await Product.findById(req.params.id);
    if (!product) return next(new ErrorHandler("Product Not Found", 404));

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    res.status(200).json({ success: true, product });
});

// Admin — Delete Product
exports.deleteProduct = asyncErrorHandler(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product) return next(new ErrorHandler("Product Not Found", 404));

    await product.deleteOne();
    res.status(200).json({ success: true, message: "Product Deleted" });
});
