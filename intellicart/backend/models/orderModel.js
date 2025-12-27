const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },

  orderItems: [
    {
      name: String,
      price: Number,
      quantity: Number,
      image: String,
      product: {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
      },
    },
  ],

  shippingInfo: {
    address: String,
    city: String,
    state: String,
    country: String,
    pinCode: Number,
    phoneNo: Number,
  },

  paymentInfo: {
    razorpay_order_id: String,
    razorpay_payment_id: String,
    razorpay_signature: String,
    status: {
      type: String,
      enum: ["created", "paid", "failed"],
      default: "created",
    },
  },

  itemsPrice: Number,
  taxPrice: Number,
  shippingPrice: Number,
  totalPrice: Number,

  orderStatus: {
    type: String,
    default: "Processing",
  },

  paidAt: Date,
  deliveredAt: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Order", orderSchema);
