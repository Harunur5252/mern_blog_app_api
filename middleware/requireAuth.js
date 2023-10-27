const jwt = require("jsonwebtoken");
const expressAsyncHandler = require("express-async-handler");
const User = require("../models/user.js");

const requireAuth = expressAsyncHandler(async (req, res, next) => {
  let token;
  token = req.cookies.jwt;
  if (token) {
    const decoded = jwt.verify(token, process.env.JWT_SECRET, (err, res) => {
      if (err) {
        return "toke expired";
      }
      return res;
    });
    if (decoded === "toke expired") {
      res.status(401);
      throw new Error("token expired");
    }
    req.time = decoded?.exp;
    req.user = await User.findById(decoded.id);
    next();
  } else {
    res.status(401);
    throw new Error("Unauthorized,no token");
  }
});

module.exports = requireAuth;
