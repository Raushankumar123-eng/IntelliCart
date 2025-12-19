// backend/controllers/productController.js
const Product = require("../models/productModel");
const asyncErrorHandler = require("../middlewares/asyncErrorHandler");
const SearchFeatures = require("../utils/searchFeatures");
const ErrorHandler = require("../utils/errorHandler");
const cloudinary = require("cloudinary");

// ==========================
// GET ALL PRODUCTS (User)
// - returns paginated products based on query params
// - returns total productsCount (global) and filteredProductsCount (before pagination)
// ==========================
exports.getAllProducts = asyncErrorHandler(async (req, res, next) => {
  // Debug: remove if you want
  // console.log("Incoming Query Params:", req.query);

  const resultPerPage = 12;

  // Build a SearchFeatures instance without pagination first to calculate filtered count
  const countFeature = new SearchFeatures(Product.find(), req.query);
  countFeature.search().filter();
  const filteredProductsCount = await countFeature.query.countDocuments();

  // Global total count (all products in DB)
  const productsCount = await Product.countDocuments();

  // Now build the paginated query
  const apiFeature = new SearchFeatures(Product.find(), req.query);
  apiFeature.search().filter().pagination(resultPerPage);

  const products = await apiFeature.query;

  return res.status(200).json({
    success: true,
    products,
    productsCount,
    resultPerPage,
    filteredProductsCount,
  });
});

// ==========================
// PRODUCT SLIDER (all, small set)
// ==========================
exports.getProducts = asyncErrorHandler(async (req, res, next) => {
  const products = await Product.find();
  res.status(200).json({ success: true, products });
});

// ==========================
// PRODUCT DETAILS
// ==========================
exports.getProductDetails = asyncErrorHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) return next(new ErrorHandler("Product Not Found", 404));
  res.status(200).json({ success: true, product });
});

// ==========================
// ADMIN — GET ALL PRODUCTS
// ==========================
exports.getAdminProducts = asyncErrorHandler(async (req, res, next) => {
  const products = await Product.find();
  res.status(200).json({ success: true, products });
});

// ==========================
// ADMIN — CREATE PRODUCT
// ==========================
exports.createProduct = asyncErrorHandler(async (req, res, next) => {
  req.body.user = req.user.id; // 🔴 REQUIRED

  // 1. images must be array
  let images = [];

  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  const imagesLinks = [];

  for (let i = 0; i < images.length; i++) {
    const result = await cloudinary.v2.uploader.upload(images[i], {
      folder: "products",
    });

    imagesLinks.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
  }

  req.body.images = imagesLinks;

  // 2. brand validation
  if (!req.body.brand || !req.body.brand.name) {
    return next(new ErrorHandler("Brand name is required", 400));
  }

  if (!req.body.brand.logo) {
    return next(new ErrorHandler("Brand logo is required", 400));
  }

  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    product,
  });
});


// ==========================
// ADMIN — UPDATE PRODUCT
// ==========================
exports.updateProduct = asyncErrorHandler(async (req, res, next) => {
  let product = await Product.findById(req.params.id);
  if (!product) return next(new ErrorHandler("Product Not Found", 404));

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, product });
});

// ==========================
// ADMIN — DELETE PRODUCT
// ==========================
exports.deleteProduct = asyncErrorHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) return next(new ErrorHandler("Product Not Found", 404));

  await product.deleteOne();

  res.status(200).json({ success: true, message: "Product Deleted" });
});

// ==========================
// GET PRODUCT REVIEWS
// ==========================
exports.getProductReviews = asyncErrorHandler(async (req, res, next) => {
  const product = await Product.findById(req.query.id);
  if (!product) return next(new ErrorHandler("Product Not Found", 404));
  res.status(200).json({ success: true, reviews: product.reviews });
});

// ==========================
// DELETE REVIEW (ADMIN)
// ==========================
exports.deleteReview = asyncErrorHandler(async (req, res, next) => {
  const { productId, id } = req.query;
  const product = await Product.findById(productId);
  if (!product) return next(new ErrorHandler("Product Not Found", 404));

  const reviews = product.reviews.filter((rev) => rev._id.toString() !== id.toString());
  const numOfReviews = reviews.length;
  const ratings = reviews.reduce((acc, item) => item.rating + acc, 0) / (numOfReviews || 1);

  product.reviews = reviews;
  product.ratings = ratings;
  product.numOfReviews = numOfReviews;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({ success: true, message: "Review Deleted Successfully" });
});

// ==========================
// CREATE / UPDATE REVIEW
// ==========================
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

  const isReviewed = product.reviews.find((rev) => rev.user.toString() === req.user._id.toString());
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
  product.ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / (product.reviews.length || 1);

  await product.save({ validateBeforeSave: false });
  res.status(200).json({ success: true });
});

// ==========================
// Slider products (small subset)
// ==========================
exports.getSliderProducts = asyncErrorHandler(async (req, res, next) => {
  const products = await Product.find().limit(10);
  res.status(200).json({ success: true, products });
});
