const expressAsyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const User = require("../models/user.js");
const Profile = require("../models/profile.js");
const generateToken = require("../config/generateToken.js");
const jwt = require("jsonwebtoken");
const transporter = require("../config/email/email.js");

// for dashboard users

const register = expressAsyncHandler(async (req, res) => {
  const { email, password, role } = req.body;
  if (!password || !email) {
    res.status(400);
    throw new Error("Add all fields");
  }
  if (role === "admin") {
    res.status(400);
    throw new Error("Admin role not allowed");
  }
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }
  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  // Create user
  const user = await User.create({
    email,
    password: hashedPassword,
  });
  if (user) {
    generateToken(res, user._id, user?.isVerified);
    return res.status(201).json({
      _id: user.id,
      email: user.email,
      isVerified: user?.isVerified,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

const login = expressAsyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("Add all fields");
  }
  const user = await User.findOne({ email });
  if (user && (await bcrypt.compare(password, user.password))) {
    generateToken(res, user._id, user?.isVerified);
    return res.json({
      _id: user.id,
      email: user.email,
      isVerified: user?.isVerified,
    });
  } else {
    res.status(400);
    throw new Error("Invalid credentials");
  }
});

const logoutUser = (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  return res.status(200).json({ message: "Logged out successfully" });
};

const getUserProfile = expressAsyncHandler(async (req, res) => {
  const userId = req?.user?._id;
  const user = await User.findById(userId).populate({
    path: "profile",
    select: "firstName lastName website bio image social resume",
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

const getSingleAllUserProfile = expressAsyncHandler(async (req, res) => {
  const userId = req?.params?.id;
  const user = await User.findById(userId).populate({
    path: "profile",
    select: "firstName lastName website bio image social",
  });
  if (user) {
    return res.json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// admin role
const getAllUserProfile = expressAsyncHandler(async (req, res) => {
  const userId = req?.user?._id;
  const user = await User.findById(userId);
  const { page } = req.query;
  const limit = 2;
  const pageNumber = parseInt(page) || 1;
  const limitNumber = parseInt(limit) || 2;
  const skip = (pageNumber - 1) * limitNumber;
  if (!user) {
    res.status(404);
    throw new Error("user not found");
  }
  const adminRole = user?.role?.includes("admin");

  if (adminRole) {
    const total = await User.countDocuments({});
    const totalPages = Math.ceil(total / limit);
    const totalUsers = await User.find({});
    const allUser =
      pageNumber <= totalPages
        ? await User.find()
            .populate({
              path: "profile",
              select: "firstName lastName website bio image social",
            })
            .skip(skip)
            .limit(limitNumber)
            .sort({ createdAt: -1 })
        : null;
    if (!allUser) {
      res.status(404);
      throw new Error("page does not exists");
    }
    if (!totalUsers) {
      res.status(404);
      throw new Error("users not found");
    }
    const data = {
      allUser: allUser && [...allUser],
      currentPage: pageNumber,
      totalPages,
      totalUsers,
    };
    const userObj = {};
    const filterUser = data?.allUser?.filter((item) => {
      if (!item.role.includes("admin")) {
        return item;
      }
    });
    userObj.data = data;
    userObj.filterUser = filterUser;
    return res.status(200).json(userObj);
  } else {
    res.status(404);
    throw new Error("you are not authorized or not admin");
  }
});
// admin role
const updateUserRole = expressAsyncHandler(async (req, res) => {
  const role = req.body?.role;
  const id = req?.params?.id;
  const userAdmin = await User.findById(req?.user?._id);
  const user = await User.findById(id);
  const checkAmin = userAdmin?.role?.includes("admin");
  if (!checkAmin) {
    res.status(404);
    throw new Error("not allow to update user role");
  }
  if (!user) {
    res.status(404);
    throw new Error("user not found");
  }
  if (checkAmin) {
    user.role = role || user?.role[0];
    await user.save();
    return res.status(201).json(user);
  } else {
    res.status(404);
    throw new Error("not allow to update user role");
  }
});

// admin role
const deleteUserByAdmin = expressAsyncHandler(async (req, res) => {
  const user = await User.findById(req?.user?._id);
  const id = req?.params?.id;
  const findUser = await User.findById(id);
  if (!user || !findUser) {
    res.status(404);
    throw new Error("user not found");
  }
  const adminRole = user?.role?.includes("admin");
  // finding normal user profile
  const profile = await Profile.findById(findUser?.profile);
  // checking normal user role is admin send error. even an admin will not delete other admin.
  if (findUser?.role?.includes("admin")) {
    res.status(404);
    throw new Error(
      "one admin can not delete other admin or you are not admin!"
    );
  }

  // finally user is admin role and can delete other normal user and that user profile
  if (adminRole) {
    const userDelete = await User.findByIdAndDelete(findUser?._id);
    if (profile) {
      await Profile.findByIdAndDelete(profile?._id);
    }
    return res.json(userDelete);
  } else {
    res.status(404);
    throw new Error("you are not admin!");
  }
});

const addUserProfile = expressAsyncHandler(async (req, res) => {
  const user = await User.findById(req?.user?._id);
  const {
    firstName,
    lastName,
    website,
    resume,
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

  const profile = await Profile.create({
    firstName,
    lastName,
    website,
    resume,
    bio,
    image: req?.file?.path,
    ["social.facebook"]: facebook,
    ["social.youtube"]: youtube,
    ["social.instagram"]: instagram,
    ["social.twitter"]: twitter,
    ["social.linkedin"]: linkedin,
    user: user?._id,
  });
  if (!profile) {
    res.status(404);
    throw new Error("profile not found");
  }
  user.profile = profile._id;
  await user.save();
  return res.json(profile);
});

const updateUserProfile = expressAsyncHandler(async (req, res) => {
  const user = await User.findById(req?.user?._id);
  const id = req?.params?.id;
  const profile = await Profile.findById(id);

  const {
    email,
    password,
    firstName,
    lastName,
    website,
    resume,
    bio,
    facebook,
    youtube,
    twitter,
    instagram,
    linkedin,
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
    profile.resume = resume || profile?.resume;
    profile.bio = bio || profile?.bio;
    profile.image = req?.file?.path || profile?.image;
    profile.social.facebook = facebook || profile?.social?.facebook;
    profile.social.youtube = youtube || profile?.social?.youtube;
    profile.social.instagram = instagram || profile?.social?.instagram;
    profile.social.twitter = twitter || profile?.social?.twitter;
    profile.social.linkedin = linkedin || profile?.social?.linkedin;
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
      linkedin: updatedProfile?.social?.linkedin,
    });
  } else {
    res.status(404);
    throw new Error("User or profile not found");
  }
});

const deleteUserProfile = expressAsyncHandler(async (req, res) => {
  const user = await User.findById(req?.user?._id);
  if (!user) {
    res.status(404);
    throw new Error("user not found");
  }
  const id = req?.params?.id;
  const profile = await Profile.findById(id);
  if (user && profile) {
    const userDelete = await Profile.findByIdAndDelete(profile._id);
    user.profile = null;
    await user.save();
    res.json(userDelete);
  } else {
    res.status(404);
    throw new Error("profile not found");
  }
});

const sendVerificationEmail = expressAsyncHandler(async (req, res) => {
  const id = req.user?._id;
  const userId = req.body?.id;
  const checkId = id.toString() === userId;
  const user = checkId ? await User.findById(id && userId) : null;

  if (!user) {
    res.status(404);
    throw new Error("user not found");
  }
  if (user.isVerified) {
    res.status(400);
    throw new Error("account already verified");
  }
  const token = jwt.sign(
    { email: user?.email, id: user?._id },
    process.env.JWT_ACTIVATE_ACCOUNT,
    {
      expiresIn: "24h",
    }
  );

  const activationLink = `${process.env.BASE_URL}/account-activation?token=${token}`;

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: user?.email,
    subject: "Activate your account",
    html: `<p><a href=${activationLink}>${activationLink}</a></p>`,
  };
  const info = await transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      return res.status(500).json("email sending failed");
    } else {
      return res.status(200).json("email send success");
    }
  });
});

const verifyAccount = expressAsyncHandler(async (req, res) => {
  const token = req?.params?.token;
  const userToken = req?.body?.token;
  const checkToken = token === userToken;
  const decodedToken = checkToken
    ? jwt.verify(token && userToken, process.env.JWT_ACTIVATE_ACCOUNT)
    : null;
  const userId = decodedToken?.id;
  if (!decodedToken || !userId) {
    res.status(404);
    throw new Error("token does not matched");
  }
  const user = await User.findById(userId);
  if (!user) {
    res.status(404);
    throw new Error("user not found");
  }
  if (user.isVerified) {
    res.status(400);
    throw new Error("account already verified");
  }
  user.isVerified = true;
  await user.save();
  return res.status(200).json("account verified successfully");
});

module.exports = {
  register,
  sendVerificationEmail,
  getSingleAllUserProfile,
  verifyAccount,
  getAllUserProfile,
  deleteUserByAdmin,
  addUserProfile,
  deleteUserProfile,
  login,
  updateUserRole,
  getUserProfile,
  updateUserProfile,
  logoutUser,
};
