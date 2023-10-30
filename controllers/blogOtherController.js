const expressAsyncHandler = require("express-async-handler");
const User = require("../models/user");
const Category = require("../models/category");
const Tag = require("../models/tag");
const Blog = require("../models/blog");

const addCategory = expressAsyncHandler(async (req, res) => {
  const { categoryName } = req.body;
  const user = await User.findById(req?.user?._id);
  if (!user) {
    res.status(404);
    throw new Error("user not found");
  }
  const adminRole = user?.role?.includes("admin");
  if (adminRole) {
    const categoryExists = await Category.findOne({ categoryName });
    if (categoryExists) {
      res.status(404);
      throw new Error("category already exits");
    }
    const category = await Category.create({
      categoryName,
    });
    if (!category) {
      res.status(404);
      throw new Error("category not found");
    }

    return res.status(201).json(category);
  } else {
    res.status(404);
    throw new Error("user role not allowed");
  }
});

const addTag = expressAsyncHandler(async (req, res) => {
  const { tagName } = req.body;
  console.log({ tagName });
  const user = await User.findById(req?.user?._id);
  if (!user) {
    res.status(404);
    throw new Error("user not found");
  }
  const adminRole = user?.role?.includes("admin");
  if (adminRole) {
    const tagExists = await Tag.findOne({ tagName });
    if (tagExists) {
      res.status(404);
      throw new Error("tag already exits");
    }
    const tag = await Tag.create({
      tagName,
    });
    if (!tag) {
      res.status(404);
      throw new Error("tag not found");
    }
    return res.status(201).json(tag);
  } else {
    res.status(404);
    throw new Error("user role not allowed");
  }
});

const getAllCategory = expressAsyncHandler(async (req, res) => {
  const user = await User.findById(req?.user?._id);
  if (!user) {
    res.status(404);
    throw new Error("user not found");
  }
  const adminRole = user?.role?.includes("admin");
  if (adminRole) {
    const allCategories = await Category.find({}).sort({ createdAt: -1 });
    if (!allCategories) {
      res.status(404);
      throw new Error("category not found");
    }
    return res.status(201).json(allCategories);
  } else {
    res.status(404);
    throw new Error("user role not allowed");
  }
});

const getAllTag = expressAsyncHandler(async (req, res) => {
  const user = await User.findById(req?.user?._id);
  if (!user) {
    res.status(404);
    throw new Error("user not found");
  }
  const adminRole = user?.role?.includes("admin");
  if (adminRole) {
    const allTags = await Tag.find({}).sort({ createdAt: -1 });
    if (!allTags) {
      res.status(404);
      throw new Error("tag not found");
    }
    return res.status(201).json(allTags);
  } else {
    res.status(404);
    throw new Error("user role not allowed");
  }
});

const updateCategory = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  const { categoryName } = req.body;
  const user = await User.findById(req?.user?._id);
  if (!user) {
    res.status(404);
    throw new Error("user not found");
  }
  const adminRole = user?.role?.includes("admin");
  if (adminRole) {
    const categoryUpdate = await Category.findById(id);
    if (!categoryUpdate) {
      res.status(404);
      throw new Error("category not found");
    }
    categoryUpdate.categoryName = categoryName || categoryUpdate?.categoryName;
    await categoryUpdate.save();
    return res.status(201).json(categoryUpdate);
  } else {
    res.status(404);
    throw new Error("user role not allowed");
  }
});

const updateTag = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  const { tagName } = req.body;
  const user = await User.findById(req?.user?._id);
  if (!user) {
    res.status(404);
    throw new Error("user not found");
  }
  const adminRole = user?.role?.includes("admin");
  if (adminRole) {
    const tagUpdate = await Tag.findById(id);
    if (!tagUpdate) {
      res.status(404);
      throw new Error("tag not found");
    }
    tagUpdate.tagName = tagName || tagUpdate?.tagName;
    await tagUpdate.save();
    return res.status(201).json(tagUpdate);
  } else {
    res.status(404);
    throw new Error("user role not allowed");
  }
});

const deleteCategory = expressAsyncHandler(async (req, res) => {
  const user = await User.findById(req?.user?._id);
  if (!user) {
    res.status(404);
    throw new Error("user not found");
  }
  const id = req?.params?.id;
  const adminRole = user?.role?.includes("admin");
  if (adminRole) {
    const categoryDelete = await Category.findByIdAndDelete(id);
    if (!categoryDelete) {
      res.status(404);
      throw new Error("category not found");
    }
    return res.json(categoryDelete);
  } else {
    res.status(404);
    throw new Error("user role not allowed");
  }
});

const deleteTag = expressAsyncHandler(async (req, res) => {
  const user = await User.findById(req?.user?._id);
  if (!user) {
    res.status(404);
    throw new Error("user not found");
  }
  const id = req?.params?.id;
  const adminRole = user?.role?.includes("admin");
  if (adminRole) {
    const tagDelete = await Tag.findByIdAndDelete(id);
    if (!tagDelete) {
      res.status(404);
      throw new Error("tag not found");
    }
    return res.json(tagDelete);
  } else {
    res.status(404);
    throw new Error("user role not allowed");
  }
});

// blog routes
const addBlog = expressAsyncHandler(async (req, res) => {
  const { title, description, category, tag, publishDate } = JSON.parse(
    req.body?.data
  );
  if (
    !title ||
    !description ||
    !category ||
    !tag ||
    !publishDate ||
    !req.file?.path
  ) {
    throw new Error("Please fill up all fields");
  }
  const categoryName = category;
  const tagName = tag;
  const user = await User.findById(req?.user?._id);
  if (!user) {
    res.status(404);
    throw new Error("user not found");
  }
  const adminRole = user?.role?.includes("admin");
  if (adminRole) {
    const findCategory = await Category.findOne({ categoryName });
    const findTag = await Tag.findOne({ tagName });
    if (!findCategory || !findTag) {
      res.status(404);
      throw new Error("category or tag not found ");
    }
    const blogTitleExists = await Blog.findOne({ title });
    if (blogTitleExists) {
      res.status(404);
      throw new Error("blog title already exits,create new title with blog");
    }
    const blog = await Blog.create({
      title,
      description,
      publishDate,
      category,
      tag,
      user: user?._id,
      blogImg: req.file?.path,
    });
    console.log(blog);
    if (!blog) {
      res.status(404);
      throw new Error("blog not found");
    }
    blog.categories.push(findCategory?._id);
    blog.tags.push(findTag?._id);
    await blog.save();
    user.blogs.push(blog._id);
    await user.save();
    findCategory.blogs.push(blog?._id);
    findTag.blogs.push(blog?._id);
    await findCategory.save();
    await findTag.save();
    return res.status(201).json(blog);
  } else {
    res.status(404);
    throw new Error("user role not allowed");
  }
});

module.exports = {
  addCategory,
  addTag,
  addBlog,
  getAllCategory,
  getAllTag,
  updateCategory,
  updateTag,
  deleteCategory,
  deleteTag,
};
