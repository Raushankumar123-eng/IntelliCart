require("dotenv").config({ path: __dirname + "/config/config.env" });

const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary");

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🚀 Final CORS Fix for Cross-Site Cookies
app.use(
  cors({
    origin: [
      "https://intelli-cart.vercel.app",  // LIVE Frontend
      "http://localhost:3000"             // Dev Frontend
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  })
);

// Required for Cookies
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

// Cookie Parser
app.use(cookieParser());

// File Upload
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// Cloudinary Config
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Routes
app.use("/api/v1", require("./routes/userRoute"));
app.use("/api/v1", require("./routes/productRoute"));
app.use("/api/v1", require("./routes/orderRoute"));

// Error Middleware
app.use(require("./middlewares/error"));

// DB Connection
require("./config/database")();

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on ${PORT}`);
});
