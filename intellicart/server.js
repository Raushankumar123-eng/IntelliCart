require("dotenv").config({ path: "./backend/config/config.env" });

const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary");

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(cookieParser());

// FILE UPLOAD (IMPORTANT)
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
app.use("/api/v1", require("./backend/routes/userRoute"));
app.use("/api/v1", require("./backend/routes/productRoute"));
app.use("/api/v1", require("./backend/routes/orderRoute"));

// Error Middleware
app.use(require("./backend/middlewares/error"));

// DB
require("./backend/config/database")();

// START SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
