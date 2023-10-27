const express = require("express");
const router = express.Router();
const {
  addUserProfile,
  getUserProfile,
  deleteUserProfile,
  login,
  logoutUser,
  register,
  updateUserProfile,
  getAllUserProfile,
  deleteUserByAdmin,
  updateUserRole,
  sendVerificationEmail,
  verifyAccount,
  getSingleAllUserProfile,
} = require("../controllers/authController.js");
const uploadMiddleWare = require("../middleware/fileUpload.js");
const requireAuth = require("../middleware/requireAuth.js");

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logoutUser);
router.post("/add/profile", requireAuth, uploadMiddleWare, addUserProfile);
router.get("/profile", requireAuth, getUserProfile);
router.get("/all/profile", requireAuth, getAllUserProfile);
router.get("/all/profile/:id", requireAuth, getSingleAllUserProfile);
router.put("/user-role/update/:id", requireAuth, updateUserRole);
router.delete("/all/profile/:id", requireAuth, deleteUserByAdmin);
router.post("/verify-email", requireAuth, sendVerificationEmail);
router.post("/verify-account/:token", verifyAccount);
router
  .route("/profile/:id")
  .put(requireAuth, uploadMiddleWare, updateUserProfile)
  .delete(requireAuth, deleteUserProfile);

module.exports = router;
