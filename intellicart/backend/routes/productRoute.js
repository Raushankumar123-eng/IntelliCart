const express = require("express");
const {
  getAllProducts,
  getProducts,
  getProductDetails,
  getAdminProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllReviews,
  getProductReviews,
  deleteReview,
  createProductReview,
} = require("../controllers/productController");

const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");

const router = express.Router();

// ---------------- PUBLIC ROUTES ----------------
router.route("/products").get(getAllProducts);
router.route("/products/all").get(getProducts);
router.route("/product/:id").get(getProductDetails);

// ---------------- ADMIN PRODUCT ROUTES ----------------
router
  .route("/admin/products")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAdminProducts);

router
  .route("/admin/product/new")
  .post(isAuthenticatedUser, authorizeRoles("admin"), createProduct);

router
  .route("/admin/product/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateProduct)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProduct);

// ---------------- REVIEWS ----------------
router
  .route("/reviews")
  .get(isAuthenticatedUser, getProductReviews)   // GET reviews of product
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteReview); // DELETE review

router
  .route("/review")
  .put(isAuthenticatedUser, createProductReview); // ADD/UPDATE review

module.exports = router;
