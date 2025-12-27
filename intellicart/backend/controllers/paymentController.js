const razorpay = require("../config/razorpay");
const crypto = require("crypto");
const Order = require("../models/orderModel");


// 1️⃣ Create Razorpay Order
exports.createRazorpayOrder = async (req, res, next) => {
  const { totalPrice } = req.body;

  const options = {
    amount: Math.round(totalPrice * 100),
    currency: "INR",
    receipt: `order_rcpt_${Date.now()}`,
  };

  const razorpayOrder = await razorpay.orders.create(options);

  res.status(200).json({
    success: true,
    razorpayOrder,
  });
};

// 2️⃣ Verify Payment & Save Order
exports.verifyRazorpayPayment = async (req, res, next) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    orderData,
  } = req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    return res.status(400).json({
      success: false,
      message: "Payment verification failed",
    });
  }

  // Save order in DB
  const order = await Order.create({
    ...orderData,
    user: req.user._id,
    paidAt: Date.now(),
    paymentInfo: {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      status: "paid",
    },
  });

  res.status(201).json({
    success: true,
    order,
  });
};
