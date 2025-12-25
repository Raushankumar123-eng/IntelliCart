require("dotenv").config({ path: __dirname + "/config/config.env" });

const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary");
const mongoose = require("mongoose");

mongoose.set("debug", true);

// ==============================
// 🔥 CORS CONFIG (FIXED)
// ==============================
const allowedOrigins = [
  "https://intelli-cart.vercel.app", // LIVE Frontend
  "http://localhost:3000"            // Local Dev
];

app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,DELETE,OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, Accept"
  );

  // Handle preflight request
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

// ==============================
// Body Parsers
// ==============================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==============================
// Cookie Parser
// ==============================
app.use(cookieParser());

// ==============================
// File Upload
// ==============================
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// ==============================
// Cloudinary Config
// ==============================
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ==============================
// Routes
// ==============================
app.use("/api/v1", require("./routes/userRoute"));
app.use("/api/v1", require("./routes/productRoute"));
app.use("/api/v1", require("./routes/orderRoute"));

// ==============================
// Error Middleware
// ==============================
app.use(require("./middlewares/error"));

// ==============================
// DB Connection
// ==============================
require("./config/database")();

// ==============================
// Start Server
// ==============================
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on ${PORT}`);
});
