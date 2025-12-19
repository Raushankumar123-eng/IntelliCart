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

const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");

const router = express.Router();

// AUTH
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);

// USER
router.get("/me", isAuthenticatedUser, getUserDetails);
router.put("/me/update", isAuthenticatedUser, updateProfile);

// PASSWORD
router.post(
  "/password/forgot",
  asyncErrorHandler(forgotPassword)
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

// ADMIN
router.get(
  "/admin/users",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  getAllUsers
);

router
  .route("/admin/user/:id")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getSingleUser)
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateUserRole)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteUser);

module.exports = router;
