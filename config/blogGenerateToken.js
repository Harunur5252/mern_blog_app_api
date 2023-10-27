const jwt = require("jsonwebtoken");
// generate token
function blogGenerateToken(res, id) {
  const token = jwt.sign({ id }, process.env.BLOG_FRONTEND_JWT_SECRET, {
    expiresIn: "30d",
  });
  res.cookie("blogJwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development", // Use secure cookies in production
    sameSite: "strict", // Prevent CSRF attacks
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });
}
module.exports = blogGenerateToken;
