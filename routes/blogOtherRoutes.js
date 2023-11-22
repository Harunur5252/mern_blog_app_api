const express = require("express");
const {
  addCategory,
  addTag,
  getAllCategory,
  getAllTag,
  updateCategory,
  updateTag,
  deleteCategory,
  deleteTag,
  addBlog,
  getAllBlog,
  updateBlog,
  deleteBlog,
  blogPublished,
  addAboutBlogy,
  getBlogyAbout,
  updateAboutBlogy,
} = require("../controllers/blogOtherController");
const requireAuth = require("../middleware/requireAuth");
const uploadMiddleWare = require("../middleware/fileUpload");
const router = express.Router();

router.post("/add/category", requireAuth, addCategory);
router.post("/add/tag", requireAuth, addTag);
router.get("/all/category", requireAuth, getAllCategory);
router.get("/all/tag", requireAuth, getAllTag);
router
  .route("/category/:id")
  .put(requireAuth, updateCategory)
  .delete(requireAuth, deleteCategory);
router
  .route("/tag/:id")
  .put(requireAuth, updateTag)
  .delete(requireAuth, deleteTag);

// blog routes
router.post("/add/blog", requireAuth, uploadMiddleWare, addBlog);
router
  .route("/blog/:id")
  .put(requireAuth, uploadMiddleWare, updateBlog)
  .delete(requireAuth, deleteBlog);
router.get("/all/blog", requireAuth, getAllBlog);
router.put("/blog/published/:id", requireAuth, blogPublished);
router.post("/add/blogy/about", requireAuth, addAboutBlogy);
router.get("/blogy/about", requireAuth, getBlogyAbout);
router.put("/blogy/about/:id", requireAuth, updateAboutBlogy);
module.exports = router;
