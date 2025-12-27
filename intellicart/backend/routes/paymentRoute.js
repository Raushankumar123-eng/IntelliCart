const express = require("express");
const router = express.Router();

const {
  createRazorpayOrder,
  verifyRazorpayPayment,
} = require("../controllers/paymentController");

const { isAuthenticatedUser } = require("../middlewares/auth");

router.post("/razorpay/order", isAuthenticatedUser, createRazorpayOrder);
router.post("/razorpay/verify", isAuthenticatedUser, verifyRazorpayPayment);


module.exports = router;
