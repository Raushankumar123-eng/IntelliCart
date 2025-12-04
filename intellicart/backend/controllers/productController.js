const Product = require('../models/productModel');
const asyncErrorHandler = require('../middlewares/asyncErrorHandler');
const SearchFeatures = require('../utils/searchFeatures');
const ErrorHandler = require('../utils/errorHandler');
const cloudinary = require('cloudinary');

// Get All Products
exports.getAllProducts = asyncErrorHandler(async (req, res, next) => {

    const resultPerPage = 12;
    const productsCount = await Product.countDocuments();

    const searchFeature = new SearchFeatures(Product.find(), req.query)
        .search()
        .filter();

    let products = await searchFeature.query;
    let filteredProductsCount = products.length;

    searchFeature.pagination(resultPerPage);
    products = await searchFeature.query.clone();

    res.status(200).json({
        success: true,
        products,
        productsCount,
        resultPerPage,
        filteredProductsCount,
    });
});

// Get All Products ---Product Sliders
exports.getProducts = asyncErrorHandler(async (req, res, next) => {
    const products = await Product.find();
    res.status(200).json({ success: true, products });
});

// Get Product Details
exports.getProductDetails = asyncErrorHandler(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product) return next(new ErrorHandler("Product Not Found", 404));

    res.status(200).json({ success: true, product });
});

// Get All Products ---ADMIN
exports.getAdminProducts = asyncErrorHandler(async (req, res, next) => {
    const products = await Product.find();
    res.status(200).json({ success: true, products });
});

// Create Product ---ADMIN
exports.createProduct = asyncErrorHandler(async (req, res, next) => {
    let images = typeof req.body.images === "string" ? [req.body.images] : req.body.images;

    const imagesLink = [];
    for (let i = 0; i < images.length; i++) {
        const result = await cloudinary.v2.uploader.upload(images[i], { folder: "products" });
        imagesLink.push({ public_id: result.public_id, url: result.secure_url });
    }

    const logoUpload = await cloudinary.v2.uploader.upload(req.body.logo, { folder: "brands" });
    const brandLogo = {
        public_id: logoUpload.public_id,
        url: logoUpload.secure_url,
    };

    req.body.brand = { name: req.body.brandname, logo: brandLogo };
    req.body.images = imagesLink;
    req.body.user = req.user.id;

    let specs = [];
    if (req.body.specifications) {
        req.body.specifications.forEach((s) => specs.push(JSON.parse(s)));
    }
    req.body.specifications = specs;

    const product = await Product.create(req.body);
    res.status(201).json({ success: true, product });
});

// Update Product ---ADMIN
exports.updateProduct = asyncErrorHandler(async (req, res, next) => {
    let product = await Product.findById(req.params.id);
    if (!product) return next(new ErrorHandler("Product Not Found", 404));

    if (req.body.images !== undefined) {
        let images = typeof req.body.images === "string" ? [req.body.images] : req.body.images;

        for (let i = 0; i < product.images.length; i++) {
            await cloudinary.v2.uploader.destroy(product.images[i].public_id);
        }

        const imagesLink = [];
        for (let i = 0; i < images.length; i++) {
            const result = await cloudinary.v2.uploader.upload(images[i], { folder: "products" });
            imagesLink.push({ public_id: result.public_id, url: result.secure_url });
        }
        req.body.images = imagesLink;
    }

    if (req.body.logo?.length > 0) {
        await cloudinary.v2.uploader.destroy(product.brand.logo.public_id);
        const logoUpload = await cloudinary.v2.uploader.upload(req.body.logo, { folder: "brands" });
        req.body.brand = { name: req.body.brandname, logo: { public_id: logoUpload.public_id, url: logoUpload.secure_url } };
    }

    let specs = [];
    if (req.body.specifications) {
        req.body.specifications.forEach((s) => specs.push(JSON.parse(s)));
    }
    req.body.specifications = specs;
    req.body.user = req.user.id;

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    res.status(200).json({ success: true, product });
});

// Delete Product ---ADMIN
exports.deleteProduct = asyncErrorHandler(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product) return next(new ErrorHandler("Product Not Found", 404));

    for (let i = 0; i < product.images.length; i++) {
        await cloudinary.v2.uploader.destroy(product.images[i].public_id);
    }

    await product.deleteOne();
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
        (rev) => rev.user.toString() === req.user._id.toString()
    );

    if (isReviewed) {
        product.reviews.forEach((rev) => {
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
        product.reviews.length;

    await product.save({ validateBeforeSave: false });

    res.status(200).json({ success: true });
});

// Get All Reviews
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
        (rev) => rev._id.toString() !== req.query.id.toString()
    );

    const ratings =
        reviews.reduce((acc, item) => item.rating + acc, 0) /
        (reviews.length || 1);

    await Product.findByIdAndUpdate(req.query.productId, {
        reviews,
        ratings,
        numOfReviews: reviews.length,
    });

    res.status(200).json({ success: true });
});
