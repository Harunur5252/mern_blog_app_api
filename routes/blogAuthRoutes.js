const { blogUserRegister, blogUserLogin, blogUserLogout, blogUserProfile, addBlogUserProfile, updateBlogUserProfile, deleteBlogUserProfile } = require("../controllers/blogAuthController");
const express = require("express");
const blogRequireAuth = require("../middleware/blogRequireAuth");
const uploadMiddleWare = require("../middleware/fileUpload");

const router = express.Router();

// auth route
router.post("/blog_user_register", blogUserRegister);
router.post("/blog_user_login", blogUserLogin);
router.post("/blog_user_logout", blogUserLogout);

// profile route
router.get("/blog_user_profile", blogRequireAuth, blogUserProfile);
router.post(
  "/add/blog_user_profile",
  blogRequireAuth,
  uploadMiddleWare,
  addBlogUserProfile
);
router
  .route("/profile/:id")
  .put(blogRequireAuth, uploadMiddleWare, updateBlogUserProfile)
  .delete(blogRequireAuth,deleteBlogUserProfile);
module.exports = router;
