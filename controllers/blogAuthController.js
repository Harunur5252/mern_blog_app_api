const expressAsyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const BlogUser = require("../models/blogUser");
const BlogProfile = require("../models/blogProfile");
const blogGenerateToken = require("../config/blogGenerateToken");

const blogUserRegister = expressAsyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!password || !email) {
    res.status(400);
    throw new Error("Add all fields");
  }
  const userExists = await BlogUser.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }
  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  // Create user
  const user = await BlogUser.create({
    email,
    password: hashedPassword,
  });
  if (user) {
    blogGenerateToken(res, user._id);
    return res.status(201).json({
      _id: user.id,
      email: user.email,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

const blogUserLogin = expressAsyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("Add all fields");
  }
  const user = await BlogUser.findOne({ email });
  if (user && (await bcrypt.compare(password, user.password))) {
    blogGenerateToken(res, user._id);
    return res.json({
      _id: user.id,
      email: user.email,
    });
  } else {
    res.status(400);
    throw new Error("Invalid credentials");
  }
});

const blogUserLogout = (req, res) => {
  res.cookie("blogJwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  return res.status(200).json({ message: "Logged out successfully" });
};

const blogUserProfile = expressAsyncHandler(async (req, res) => {
  const userId = req?.user?._id;
  const user = await BlogUser.findById(userId).populate({
    path: "profile",
    select: "firstName lastName website bio image social",
  });
  // const data = {
  //   user,
  //   time: req?.time,
  // };
  if (user) {
    return res.json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

const addBlogUserProfile = expressAsyncHandler(async (req, res) => {
  const user = await BlogUser.findById(req?.user?._id);
  const {
    firstName,
    lastName,
    website,
    bio,
    facebook,
    youtube,
    instagram,
    linkedin,
    twitter,
  } = JSON.parse(req.body?.data);

  if (!user) {
    res.status(404);
    throw new Error("user not found");
  }
  const profile = await BlogProfile.create({
    firstName,
    lastName,
    website,
    bio,
    image: req?.file?.path,
    ["social.facebook"]: facebook,
    ["social.youtube"]: youtube,
    ["social.instagram"]: instagram,
    ["social.twitter"]: twitter,
    user: user?._id,
  });
  if (!profile) {
    res.status(404);
    throw new Error("profile not found");
  }
  user.profile = profile._id;
  await user.save();
  return res.status(201).json(profile);
});

const updateBlogUserProfile = expressAsyncHandler(async (req, res) => {
  const user = await BlogUser.findById(req?.user?._id);
  const id = req?.params?.id;
  const profile = await BlogProfile.findById(id);

  const {
    email,
    password,
    firstName,
    lastName,
    website,
    bio,
    facebook,
    youtube,
    twitter,
    instagram,
  } = JSON.parse(req.body?.data);

  if (user && profile) {
    user.email = email || user.email;
    if (password) {
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      user.password = hashedPassword;
    }
    // updated with profiles fields
    const updatedUser = await user.save();
    profile.firstName = firstName || profile?.firstName;
    profile.lastName = lastName || profile?.lastName;
    profile.website = website || profile?.website;
    profile.bio = bio || profile?.bio;
    profile.image = req?.file?.path || profile?.image;
    profile.social.facebook = facebook || profile?.social?.facebook;
    profile.social.youtube = youtube || profile?.social?.youtube;
    profile.social.instagram = instagram || profile?.social?.instagram;
    profile.social.twitter = twitter || profile?.social?.twitter;
    const updatedProfile = await profile.save();

    return res.status(200).json({
      _id: updatedProfile?._id,
      email: updatedUser?.email,
      firstName: updatedProfile?.firstName,
      lastName: updatedProfile?.lastName,
      website: updatedProfile?.website,
      bio: updatedProfile?.bio,
      image: updatedProfile?.image,
      facebook: updatedProfile?.social?.facebook,
      youtube: updatedProfile?.social?.youtube,
      instagram: updatedProfile?.social?.instagram,
      twitter: updatedProfile?.social?.twitter,
    });
  } else {
    res.status(404);
    throw new Error("User or profile not found");
  }
});

const deleteBlogUserProfile = expressAsyncHandler(async (req, res) => {
  const user = await BlogUser.findById(req?.user?._id);
  if (!user) {
    res.status(404);
    throw new Error("user not found");
  }
  const id = req?.params?.id;
  const profile = await BlogProfile.findById(id);
  if (user && profile) {
    const userDelete = await BlogProfile.findByIdAndDelete(profile._id);
    user.profile = null;
    await user.save();
    res.json(userDelete);
  } else {
    res.status(404);
    throw new Error("profile not found");
  }
});
module.exports = {
  blogUserRegister,
  blogUserLogin,
  blogUserLogout,
  blogUserProfile,
  addBlogUserProfile,
  updateBlogUserProfile,
  deleteBlogUserProfile,
};
