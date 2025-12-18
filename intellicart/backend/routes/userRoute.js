const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  getUserDetails,
  forgotPassword,
  resetPassword,
  updatePassword,
  updateProfile,
  getAllUsers,
  getSingleUser,
  updateUserRole,
  deleteUser,
} = require("../controllers/userController");

const asyncErrorHandler = require("../middlewares/asyncErrorHandler");
const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");

const router = express.Router();

// ==================== AUTH ====================
router.post("/register", asyncErrorHandler(registerUser));
router.post("/login", asyncErrorHandler(loginUser));
router.get("/logout", asyncErrorHandler(logoutUser));

// ==================== USER ====================
router.get(
  "/me",
  isAuthenticatedUser,
  asyncErrorHandler(getUserDetails)
);

router.put(
  "/me/update",
  isAuthenticatedUser,
  asyncErrorHandler(updateProfile)
);

// ==================== PASSWORD ====================
router.post(
  "/password/forgot",
  asyncErrorHandler(forgotPassword)   // ✅ FIX
);

router.put(
  "/password/reset/:token",
  asyncErrorHandler(resetPassword)
);

router.put(
  "/password/update",
  isAuthenticatedUser,
  asyncErrorHandler(updatePassword)
);

// ==================== ADMIN ====================
router.get(
  "/admin/users",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  asyncErrorHandler(getAllUsers)
);

router
  .route("/admin/user/:id")
  .get(
    isAuthenticatedUser,
    authorizeRoles("admin"),
    asyncErrorHandler(getSingleUser)
  )
  .put(
    isAuthenticatedUser,
    authorizeRoles("admin"),
    asyncErrorHandler(updateUserRole)
  )
  .delete(
    isAuthenticatedUser,
    authorizeRoles("admin"),
    asyncErrorHandler(deleteUser)
  );

module.exports = router;
