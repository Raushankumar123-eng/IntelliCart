const express = require("express");
const router = express.Router();

const {
  createRazorpayOrder,
  verifyRazorpayPayment,
} = require("../controllers/paymentController");

const { isAuthenticatedUser } = require("../middleware/auth");

router.post(
  "/payment/razorpay/order",
  isAuthenticatedUser,
  createRazorpayOrder
);

router.post(
  "/payment/razorpay/verify",
  isAuthenticatedUser,
  verifyRazorpayPayment
);

module.exports = router;
