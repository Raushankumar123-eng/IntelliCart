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


// Delete Review
exports.deleteReview = asyncErrorHandler(async (req, res, next) => {
    const product = await Product.findById(req.query.productId);

    if (!product) {
        return next(new ErrorHandler("Product Not Found", 404));
    }

    const reviews = product.reviews.filter(
        (rev) => rev._id.toString() !== req.query.id
    );

    const numOfReviews = reviews.length;
    const avg =
        reviews.reduce((acc, item) => acc + item.rating, 0) / (numOfReviews || 1);

    await Product.findByIdAndUpdate(
        req.query.productId,
        {
            reviews,
            ratings: avg,
            numOfReviews,
        },
        { new: true, runValidators: true, useFindAndModify: false }
    );

    res.status(200).json({
        success: true,
        message: "Review Deleted Successfully",
    });
});




// Get Reviews
exports.getProductReviews = asyncErrorHandler(async (req, res, next) => {
    const product = await Product.findById(req.query.id);
    if (!product) return next(new ErrorHandler("Product Not Found", 404));

    res.status(200).json({ success: true, reviews: product.reviews });
});

// Delete Review
exports.deleteReview = asyncErrorHandler(async (req, res, next) => {
    const product = await Product.findById(req.query.productId);
    if (!product) return next(new ErrorHandler("Product Not Found", 404));

    const reviews = product.reviews.filter(
        rev => rev._id.toString() !== req.query.id.toString()
    );

    const ratings =
        reviews.reduce((acc, item) => item.rating + acc, 0) /
        (reviews.length || 1);

    product.reviews = reviews;
    product.ratings = ratings;
    product.numOfReviews = reviews.length;

    await product.save({ validateBeforeSave: false });

    res.status(200).json({ success: true });
});


// Create or Update Review
exports.createProductReview = asyncErrorHandler(async (req, res, next) => {
    const { rating, comment, productId } = req.body;

    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment,
    };

    const product = await Product.findById(productId);
    if (!product) return next(new ErrorHandler("Product Not Found", 404));

    const isReviewed = product.reviews.find(
        rev => rev.user.toString() === req.user._id.toString()
    );

    if (isReviewed) {
        product.reviews.forEach(rev => {
            if (rev.user.toString() === req.user._id.toString()) {
                rev.rating = rating;
                rev.comment = comment;
            }
        });
    } else {
        product.reviews.push(review);
    }

    product.numOfReviews = product.reviews.length;

    product.ratings =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        (product.reviews.length || 1);

    await product.save({ validateBeforeSave: false });

    res.status(200).json({ success: true });
});

