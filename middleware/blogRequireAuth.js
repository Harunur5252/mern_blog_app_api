const jwt = require("jsonwebtoken");
const expressAsyncHandler = require("express-async-handler");
const BlogUser = require("../models/blogUser");

const blogRequireAuth = expressAsyncHandler(async (req, res, next) => {
  let token;
  token = req.cookies.blogJwt;
  if (token) {
    const decoded = jwt.verify(
      token,
      process.env.BLOG_FRONTEND_JWT_SECRET,
      (err, res) => {
        if (err) {
          return "toke expired";
        }
        return res;
      }
    );
    if (decoded === "toke expired") {
      res.status(401);
      throw new Error("token expired");
    }
    req.time = decoded?.exp;
    req.user = await BlogUser.findById(decoded?.id);
    next();
  } else {
    res.status(401);
    throw new Error("Unauthorized,no token");
  }
});

module.exports = blogRequireAuth;
