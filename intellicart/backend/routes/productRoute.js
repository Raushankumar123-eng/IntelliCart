const express = require("express");
const {
  getAllProducts,
  getProducts,
  getProductDetails,
  getAdminProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");

const router = express.Router();

// Public Routes
router.route("/products").get(getAllProducts);
router.route("/products/all").get(getProducts);
router.route("/product/:id").get(getProductDetails);

// Admin Routes
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

// Get all reviews of a product
router
  .route("/reviews")
  .get(isAuthenticatedUser, getAllReviews);


// Delete Review
router
  .route("/reviews")
  .delete(isAuthenticatedUser, deleteReview);


module.exports = router;
