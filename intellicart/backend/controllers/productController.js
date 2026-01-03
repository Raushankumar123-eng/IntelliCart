// backend/controllers/productController.js
const Product = require("../models/productModel");
const asyncErrorHandler = require("../middlewares/asyncErrorHandler");
const SearchFeatures = require("../utils/searchFeatures");
const ErrorHandler = require("../utils/errorHandler");
const cloudinary = require("cloudinary");

// ==========================
// GET ALL PRODUCTS
// ==========================
exports.getAllProducts = asyncErrorHandler(async (req, res) => {
  const resultPerPage = 12;

  const countFeature = new SearchFeatures(Product.find(), req.query);
  countFeature.search().filter();
  const filteredProductsCount = await countFeature.query.countDocuments();

  const productsCount = await Product.countDocuments();

  const apiFeature = new SearchFeatures(Product.find(), req.query);
  apiFeature.search().filter().pagination(resultPerPage);

  const products = await apiFeature.query;

  res.status(200).json({
    success: true,
    products,
    productsCount,
    resultPerPage,
    filteredProductsCount,
  });
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
// ADMIN — GET PRODUCTS
// ==========================
exports.getAdminProducts = asyncErrorHandler(async (req, res) => {
  const products = await Product.find();
  res.status(200).json({ success: true, products });
});

// ==========================
// ✅ ADMIN — CREATE PRODUCT (FIXED)
// ==========================
exports.createProduct = asyncErrorHandler(async (req, res, next) => {
  // attach user
  req.body.user = req.user.id;

  // =========================
  // 1️⃣ PRODUCT IMAGES
  // =========================
  let images = [];

  if (typeof req.body.images === "string") {
    images = [req.body.images];
  } else {
    images = req.body.images || [];
  }

  if (images.length === 0) {
    return next(new ErrorHandler("Product images required", 400));
  }

  const imagesLinks = [];

  for (let img of images) {
    const uploaded = await cloudinary.v2.uploader.upload(img, {
      folder: "products",
    });

    imagesLinks.push({
      public_id: uploaded.public_id,
      url: uploaded.secure_url,
    });
  }

  req.body.images = imagesLinks;

  // =========================
  // 2️⃣ BRAND VALIDATION (NO UPLOAD)
  // =========================
  if (!req.body.brand || !req.body.brand.name) {
    return next(new ErrorHandler("Brand name is required", 400));
  }

  if (!req.body.brand.logo || !req.body.brand.logo.url) {
    return next(new ErrorHandler("Brand logo is required", 400));
  }

  // ⚠️ IMPORTANT:
  // Brand logo is already base64 → save directly
  // ❌ DO NOT upload again to cloudinary

  // =========================
  // 3️⃣ CREATE PRODUCT
  // =========================
  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    message: "Product added successfully",
    product,
  });
});

// ==========================
// UPDATE PRODUCT
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
// DELETE PRODUCT
// ==========================
exports.deleteProduct = asyncErrorHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) return next(new ErrorHandler("Product Not Found", 404));

  await product.deleteOne();
  res.status(200).json({ success: true });
});
