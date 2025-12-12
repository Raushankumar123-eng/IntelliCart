// backend/routes/productRoute.js
const express = require("express");
const {
  getAllProducts,
  getProducts,
  getProductDetails,
  getAdminProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductReviews,
  deleteReview,
  createProductReview,
  getSliderProducts,
} = require("../controllers/productController");

const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");
const router = express.Router();

// PUBLIC
// Get ALL products (with filters, pagination etc.)
router.get("/products", getAllProducts);

// Slider products
router.route("/products/slider").get(getSliderProducts);

// Single product details
router.route("/product/:id").get(getProductDetails);

// ADMIN product routes
router.route("/admin/products").get(isAuthenticatedUser, authorizeRoles("admin"), getAdminProducts);

router.route("/admin/product/new").post(isAuthenticatedUser, authorizeRoles("admin"), createProduct);

router.route("/admin/product/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateProduct)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProduct);

// REVIEWS
router.route("/reviews")
  .get(isAuthenticatedUser, getProductReviews) // get reviews by product id
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteReview); // admin delete review

router.route("/review").put(isAuthenticatedUser, createProductReview); // add/update review

module.exports = router;
