const User = require("../models/userModel");
const ErrorHandler = require("../utils/errorHandler");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");

/* ===================== FORGOT PASSWORD ===================== */
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return next(new ErrorHandler("Email is required", 400));
    }

    const user = await User.findOne({ email });

    if (!user) {
      return next(new ErrorHandler("User Not Found", 404));
    }

    // Generate token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    const resetPasswordUrl =
      `https://intelli-cart.vercel.app/password/reset/${resetToken}`;

    try {
      await sendEmail({
        email: user.email,
        templateId: process.env.SENDGRID_RESET_TEMPLATEID,
        data: {
          reset_url: resetPasswordUrl, // ✅ must match SendGrid template
        },
      });
    } catch (mailError) {
      // rollback token if email fails
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });

      return next(
        new ErrorHandler("Email could not be sent. Try again later.", 500)
      );
    }

    res.status(200).json({
      success: true,
      message: "Reset password email sent successfully",
    });

  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};


/* ===================== RESET PASSWORD ===================== */
exports.resetPassword = async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorHandler("Invalid or expired token", 400));
  }

  const { password, confirmPassword } = req.body;

  if (!password || !confirmPassword) {
    return next(new ErrorHandler("Both passwords are required", 400));
  }

  if (password !== confirmPassword) {
    return next(new ErrorHandler("Passwords do not match", 400));
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  res.status(200).json({
    success: true,
    message: "Password updated successfully",
  });
};
