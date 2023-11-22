const expressAsyncHandler = require("express-async-handler");
const User = require("../models/user");
const Category = require("../models/category");
const Tag = require("../models/tag");
const Blog = require("../models/blog");
const About = require("../models/about");

const addCategory = expressAsyncHandler(async (req, res) => {
  const { categoryName, categoryItem } = req.body;
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
      categoryItem,
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
  const { categoryName, categoryItem } = req.body;
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
    categoryUpdate.categoryItem = categoryItem || categoryUpdate?.categoryItem;
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

// add blog routes
const addBlog = expressAsyncHandler(async (req, res) => {
  const { title, descriptionOne, descriptionTwo, category, tag, publishDate } =
    JSON.parse(req.body?.data);
  if (
    !title ||
    !descriptionOne ||
    !descriptionTwo ||
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
      descriptionOne,
      descriptionTwo,
      publishDate,
      category,
      tag,
      user: user?._id,
      blogImg: req.file?.path,
    });
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

// update blog routes
const updateBlog = expressAsyncHandler(async (req, res) => {
  const { title, descriptionOne, descriptionTwo, publishDate } = JSON.parse(
    req.body?.data
  );
  const id = req?.params?.id;
  const user = await User.findById(req?.user?._id);
  if (!user) {
    res.status(404);
    throw new Error("user not found");
  }
  const adminRole = user?.role?.includes("admin");
  if (adminRole) {
    const blogTitleExists = await Blog.findOne({ title });
    if (blogTitleExists) {
      res.status(404);
      throw new Error("blog title already exits,create new title with blog");
    }
    const blog = await Blog.findById(id);
    if (!blog) {
      res.status(404);
      throw new Error("blog not found");
    }
    blog.title = title || blog?.title;
    blog.descriptionOne = descriptionOne || blog?.descriptionOne;
    blog.descriptionTwo = descriptionTwo || blog?.descriptionTwo;
    blog.publishDate = publishDate || blog?.publishDate;
    blog.blogImg = req?.file?.path || blog?.blogImg;
    await blog.save();

    return res.status(201).json(blog);
  } else {
    res.status(404);
    throw new Error("user role not allowed");
  }
});

const deleteBlog = expressAsyncHandler(async (req, res) => {
  const id = req.params?.id;
  if (!id) {
    res.status(404);
    throw new Error("blog not found");
  }
  const user = await User.findById(req?.user?._id);
  if (!user) {
    res.status(404);
    throw new Error("user not found");
  }
  const adminRole = user?.role?.includes("admin");
  if (adminRole) {
    const blog = await Blog.findByIdAndDelete(id);

    // for user
    const findUserBlogIndex = user?.blogs?.findIndex((item, i) => {
      if (item?.toString() === id?.toString()) {
        return item;
      }
    });
    if (findUserBlogIndex) {
      user?.blogs?.splice(findUserBlogIndex, 1);
      await user.save();
    } else {
      res.status(404);
      throw new Error("not found");
    }

    // for category
    const totalCategories = await Category.find({});
    const findCategoryWiseBlog = totalCategories?.find((item) => {
      return item?.blogs?.find((cat) => {
        if (cat?.toString() === id?.toString()) {
          return item;
        }
      });
    });
    const findBlogIndex = findCategoryWiseBlog?.blogs?.findIndex((item, i) => {
      if (item?.toString() === id?.toString()) {
        return item;
      }
    });
    if (findCategoryWiseBlog && findBlogIndex) {
      findCategoryWiseBlog?.blogs?.splice(findBlogIndex, 1);
      await findCategoryWiseBlog.save();
    } else {
      res.status(404);
      throw new Error("not found");
    }

    // for tag
    const totalTags = await Tag.find({});
    const findTagWiseBlog = totalTags?.find((item) => {
      return item?.blogs?.find((tag) => {
        if (tag?.toString() === id?.toString()) {
          return item;
        }
      });
    });
    const findBlogIndexTwo = findTagWiseBlog?.blogs?.findIndex((item, i) => {
      if (item?.toString() === id?.toString()) {
        return item;
      }
    });
    if (findTagWiseBlog && findBlogIndexTwo) {
      findTagWiseBlog?.blogs?.splice(findBlogIndexTwo, 1);
      await findTagWiseBlog.save();
    } else {
      res.status(404);
      throw new Error("not found");
    }

    return res.status(200).json(blog);
  } else {
    res.status(404);
    throw new Error("user role not allowed");
  }
});

const getAllBlog = expressAsyncHandler(async (req, res) => {
  const user = await User.findById(req?.user?._id);
  if (!user) {
    res.status(404);
    throw new Error("user not found");
  }
  const adminRole = user?.role?.includes("admin");
  if (adminRole) {
    const allBlog = await Blog.find({}).sort({ createdAt: -1 });
    if (!allBlog) {
      res.status(404);
      throw new Error("blogs not found");
    }
    return res.status(201).json(allBlog);
  } else {
    res.status(404);
    throw new Error("user role not allowed");
  }
});

const blogPublished = expressAsyncHandler(async (req, res) => {
  const id = req.params?.id;
  const { completed } = req.body;
  const user = await User.findById(req?.user?._id);
  if (!user) {
    res.status(404);
    throw new Error("user not found");
  }
  const adminRole = user?.role?.includes("admin");
  if (adminRole) {
    const blog = await Blog.findById(id);
    if (!blog) {
      res.status(404);
      throw new Error("blog not found");
    }
    blog.completed = completed || blog?.completed;
    await blog.save();
    return res.status(201).json({
      success: true,
    });
  } else {
    res.status(404);
    throw new Error("user role not allowed");
  }
});

const addAboutBlogy = expressAsyncHandler(async (req, res) => {
  const { about } = req.body;
  const user = await User.findById(req?.user?._id);
  if (!user) {
    res.status(404);
    throw new Error("user not found");
  }
  const adminRole = user?.role?.includes("admin");
  if (adminRole) {
    const blogyAbout = await About.create({
      about,
      user: user?._id,
    });
    if (!blogyAbout) {
      res.status(404);
      throw new Error("blogyAbout not found");
    }
    return res.status(201).json({
      success: true,
    });
  } else {
    res.status(404);
    throw new Error("user role not allowed");
  }
});

const updateAboutBlogy = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  const { about } = req.body;
  const user = await User.findById(req?.user?._id);
  if (!user) {
    res.status(404);
    throw new Error("user not found");
  }
  const adminRole = user?.role?.includes("admin");
  if (adminRole) {
    const blogyAbout = await About.findById(id);
    if (!blogyAbout) {
      res.status(404);
      throw new Error("blogyAbout not found");
    }
    blogyAbout.about = about || blogyAbout?.about;
    await blogyAbout.save();
    return res.status(201).json({
      success: true,
    });
  } else {
    res.status(404);
    throw new Error("user role not allowed");
  }
});

const getBlogyAbout = expressAsyncHandler(async (req, res) => {
  const user = await User.findById(req?.user?._id);
  if (!user) {
    res.status(404);
    throw new Error("user not found");
  }
  const adminRole = user?.role?.includes("admin");
  if (adminRole) {
    const about = await About.find({});
    if (!about) {
      res.status(404);
      throw new Error("about not found");
    }
    return res.status(201).json(about);
  } else {
    res.status(404);
    throw new Error("user role not allowed");
  }
});

module.exports = {
  updateAboutBlogy,
  addCategory,
  getBlogyAbout,
  blogPublished,
  addAboutBlogy,
  deleteBlog,
  addTag,
  updateBlog,
  getAllBlog,
  addBlog,
  getAllCategory,
  getAllTag,
  updateCategory,
  updateTag,
  deleteCategory,
  deleteTag,
};
