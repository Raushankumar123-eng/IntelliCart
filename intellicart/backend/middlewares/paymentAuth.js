const ErrorHandler = require("../utils/errorHandler");

exports.isPaymentAllowed = (req, res, next) => {
  if (!req.user) {
    return next(new ErrorHandler("Login required to make payment", 401));
  }
  next();
};
