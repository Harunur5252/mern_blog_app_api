const express = require("express");
const cors = require("cors");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db/connectDB.js");
const authRoutes = require("./routes/authRoutes.js");
const blogAuthRoutes = require("./routes/blogAuthRoutes.js");
const blogOtherRoutes = require("./routes/blogOtherRoutes.js");
const { notFound, errorHandler } = require("./middleware/errorHandler.js");
const blogRoutes = require("./routes/blogRoutes.js");

const app = express();
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

connectDB();

app.use("/api/v_1/blog/admin/panel/auth", authRoutes);
app.use("/api/v_1/blog/auth", blogAuthRoutes);
app.use("/api/v_1/blog", blogRoutes);
app.use("/api/v_1/blog/admin/panel", blogOtherRoutes);

app.use(notFound);
app.use(errorHandler);
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`server is running at port ${port}`);
});
