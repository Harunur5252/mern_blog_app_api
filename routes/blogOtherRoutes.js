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
} = require("../controllers/blogOtherController");
const requireAuth = require("../middleware/requireAuth");
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
module.exports = router;
