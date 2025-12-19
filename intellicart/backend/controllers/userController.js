const User = require("../models/userModel");
const ErrorHandler = require("../utils/errorHandler");
const asyncErrorHandler = require("../middlewares/asyncErrorHandler");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const cloudinary = require("cloudinary");

/* ================= REGISTER ================= */
exports.registerUser = asyncErrorHandler(async (req, res, next) => {
  if (!req.files || !req.files.avatar) {
    return next(new ErrorHandler("Avatar is required", 400));
  }

  const myCloud = await cloudinary.v2.uploader.upload(
    req.files.avatar.tempFilePath,
    { folder: "avatars", width: 150, crop: "scale" }
  );

  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    gender: req.body.gender,
    password: req.body.password,
    avatar: {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    },
  });

  res.status(201).json({ success: true, user });
});

/* ================= LOGIN ================= */
exports.loginUser = asyncErrorHandler(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    return next(new ErrorHandler("Please Enter Email & Password", 400));

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.comparePassword(password)))
    return next(new ErrorHandler("Invalid Email or Password", 401));

  res.status(200).json({ success: true, user });
});

/* ================= LOGOUT ================= */
exports.logoutUser = asyncErrorHandler(async (req, res) => {
  res.cookie("token", null, { expires: new Date(Date.now()), httpOnly: true });
  res.status(200).json({ success: true, message: "Logged Out" });
});

/* ================= LOAD USER ================= */
exports.getUserDetails = asyncErrorHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({ success: true, user });
});

/* ================= FORGOT PASSWORD ================= */
exports.forgotPassword = asyncErrorHandler(async (req, res, next) => {
  const { email } = req.body;
  if (!email) return next(new ErrorHandler("Email is required", 400));

  const user = await User.findOne({ email });
  if (!user) return next(new ErrorHandler("User Not Found", 404));

  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  const resetUrl = `https://intelli-cart.vercel.app/password/reset/${resetToken}`;

  try {
    await sendEmail({
      email: user.email,
      templateId: process.env.SENDGRID_RESET_TEMPLATEID,
      data: { reset_url: resetUrl },
    });
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler("Email could not be sent", 500));
  }

  res.status(200).json({
    success: true,
    message: "Reset password email sent successfully",
  });
});

/* ================= RESET PASSWORD ================= */
exports.resetPassword = asyncErrorHandler(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) return next(new ErrorHandler("Invalid or expired token", 400));

  const { password, confirmPassword } = req.body;
  if (!password || !confirmPassword)
    return next(new ErrorHandler("Both passwords required", 400));
  if (password !== confirmPassword)
    return next(new ErrorHandler("Passwords do not match", 400));

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  res.status(200).json({
    success: true,
    message: "Password updated successfully",
  });
});

/* ================= UPDATE PASSWORD ================= */
exports.updatePassword = asyncErrorHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  if (!(await user.comparePassword(req.body.oldPassword)))
    return next(new ErrorHandler("Old password incorrect", 400));

  user.password = req.body.newPassword;
  await user.save();

  res.status(200).json({ success: true });
});

/* ================= UPDATE PROFILE ================= */
exports.updateProfile = asyncErrorHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user.id, {
    name: req.body.name,
    email: req.body.email,
  });
  res.status(200).json({ success: true });
});

/* ================= ADMIN ================= */
exports.getAllUsers = asyncErrorHandler(async (req, res) => {
  const users = await User.find();
  res.status(200).json({ success: true, users });
});

exports.getSingleUser = asyncErrorHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) return next(new ErrorHandler("User not found", 404));
  res.status(200).json({ success: true, user });
});

exports.updateUserRole = asyncErrorHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, req.body);
  res.status(200).json({ success: true });
});

exports.deleteUser = asyncErrorHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) return next(new ErrorHandler("User not found", 404));
  await user.deleteOne();
  res.status(200).json({ success: true });
});
