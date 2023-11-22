const express = require("express");
const {
  retroBlogs,
  getAllDashboardUser,
  getAllCategoryAndTag,
  getCategoryWiseBlog,
  getTagWiseBlog,
  getDesignBlogs,
  getDatabaseBlogs,
  getBlogyAbout,
} = require("../controllers/blogController");
const router = express.Router();

router.get("/all/blogs", retroBlogs);
router.get("/all/design/blogs", getDesignBlogs);
router.get("/all/database/blogs", getDatabaseBlogs);
router.get("/dashboard/all/users", getAllDashboardUser);
router.get("/dashboard/all/category-tags", getAllCategoryAndTag);
router.get("/dashboard/all/category-wise-blog/:id", getCategoryWiseBlog);
router.get("/dashboard/all/tag-wise-blog/:id", getTagWiseBlog);
router.get("/dashboard/about/blogy", getBlogyAbout);
module.exports = router;

