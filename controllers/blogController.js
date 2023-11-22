const expressAsyncHandler = require("express-async-handler");
const Blog = require("../models/blog");
const User = require("../models/user");
const Category = require("../models/category");
const Tag = require("../models/tag");
const About = require("../models/about");

const retroBlogs = expressAsyncHandler(async (req, res) => {
  const blogs = await Blog.find({});

  if (!blogs) {
    res.status(400);
    throw new Error("blogs not found");
  }
  const completedBlogs = blogs?.filter((blog) => {
    if (blog?.completed) {
      return blog;
    }
  });

  return res.status(200).json({
    success: true,
    data: completedBlogs,
  });
});

const getDesignBlogs = expressAsyncHandler(async (req, res) => {
  const categories = await Category.find({});
  const categoryOne = categories[6]?.categoryName;
  let blogs = [];

  if (!categories) {
    res.status(400);
    throw new Error("categories not found");
  }
  const designBlogs = categories?.find((category, i) => {
    if (category?.categoryName === categoryOne) {
      return category;
    }
  });

  for (const cat of designBlogs?.blogs) {
    const findBlog = await Blog.findById(cat);
    if (findBlog?.completed) {
      blogs.push(findBlog);
    }
  }
  return res.status(200).json({
    success: true,
    category: designBlogs,
    data: blogs.reverse().slice(0, 9),
  });
});

const getDatabaseBlogs = expressAsyncHandler(async (req, res) => {
  const categories = await Category.find({});
  const categoryOne = categories[7]?.categoryName;
  let blogs = [];
  if (!categories) {
    res.status(400);
    throw new Error("categories not found");
  }
  const databaseBlogs = categories?.find((category) => {
    if (category?.categoryName === categoryOne) {
      return category;
    }
  });

  for (const cat of databaseBlogs?.blogs) {
    const findBlog = await Blog.findById(cat);
    if (findBlog?.completed) {
      blogs.push(findBlog);
    }
  }
  return res.status(200).json({
    success: true,
    category: databaseBlogs,
    data: blogs.reverse(),
  });
});

const getAllDashboardUser = expressAsyncHandler(async (req, res) => {
  const users = await User.find().populate({
    path: "profile",
    select: "firstName lastName website bio image social resume",
  });

  if (!users) {
    res.status(400);
    throw new Error("users not found");
  }
  return res.status(200).json(users);
});

const getAllCategoryAndTag = expressAsyncHandler(async (req, res) => {
  const categories = await Category.find().sort({ createdAt: -1 });
  const tags = await Tag.find().sort({ createdAt: -1 });

  if (!categories || !tags) {
    res.status(400);
    throw new Error("categories or tags not found");
  }
  return res.status(200).json({
    categories,
    tags,
  });
});

const getCategoryWiseBlog = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  let blogs = [];
  const category = await Category.findById(id);
  if (!category) {
    res.status(400);
    throw new Error("category not found");
  }
  for (const cat of category?.blogs) {
    const findBlog = await Blog.findById(cat);
    if (findBlog?.completed) {
      blogs.push(findBlog);
    }
  }
  return res.status(200).json(blogs);
});

const getTagWiseBlog = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  let blogs = [];
  const tag = await Tag.findById(id);
  if (!tag) {
    res.status(400);
    throw new Error("tag not found");
  }
  for (const t of tag?.blogs) {
    const findBlog = await Blog.findById(t);
    blogs.push(findBlog);
  }
  return res.status(200).json(blogs);
});

const getBlogyAbout = expressAsyncHandler(async (req, res) => {
  const about = await About.find({});
  if (!about) {
    res.status(404);
    throw new Error("about not found");
  }
  return res.status(201).json(about);
});

module.exports = {
  getBlogyAbout,
  retroBlogs,
  getDatabaseBlogs,
  getDesignBlogs,
  getTagWiseBlog,
  getAllDashboardUser,
  getAllCategoryAndTag,
  getCategoryWiseBlog,
};
