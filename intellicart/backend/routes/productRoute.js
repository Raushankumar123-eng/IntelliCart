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
  getSliderProducts 
} = require("../controllers/productController");

const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");

const router = express.Router();

// PUBLIC
// Get ALL products (with filters)
router.route("/products").get(getAllProducts);

// Get Slider products — different route name
router.route("/products/slider").get(getSliderProducts);

// Get Single Product
router.route("/product/:id").get(getProductDetails);


// ADMIN
router.route("/admin/products")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAdminProducts);

router.route("/admin/product/new")
  .post(isAuthenticatedUser, authorizeRoles("admin"), createProduct);

router.route("/admin/product/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateProduct)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProduct);

// REVIEWS
router.route("/reviews")
  .get(isAuthenticatedUser, getProductReviews)   
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteReview);

router.route("/review")
  .put(isAuthenticatedUser, createProductReview);

module.exports = router;
