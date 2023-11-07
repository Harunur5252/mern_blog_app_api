const expressAsyncHandler = require("express-async-handler");
const Blog = require("../models/blog");

const getAllBlogs = expressAsyncHandler(async (req, res) => {
  const blogs = await Blog.find({});
  if (!blogs) {
    res.status(400);
    throw new Error("blogs not found");
  }
  return res.status(200).json({
    success: true,
    data: blogs,
  });
});

module.exports = {
  getAllBlogs,
};
