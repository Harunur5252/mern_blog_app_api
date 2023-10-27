const path = require("path");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "dashboard-user-img",
    format: async (req, file) => "png", // supports promises as well
    public_id: (req, file) => "computed-filename-using-request",
  },
});

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "./config/images");
//   },
//   filename: function (req, file, cb) {
//     const fileData = path.parse(file.originalname);
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, fileData.name + "-" + uniqueSuffix + fileData.ext);
//   },
// });
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/png"
    ) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type!"), false);
    }
  },
  limits: {
    fileSize: 1024 * 1024 * 2,
  },
}).single("image");

const uploadMiddleWare = (req, res, next) => {
  upload(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({
            success: false,
            error: "File size is too large!",
          });
        } else {
          return res.status(400).json({
            success: false,
            error: err.message,
          });
        }
      } else {
        return res.status(400).json({
          success: false,
          error: err.message,
        });
      }
    }
    // if (!req.file) {
    //   return res.status(400).json({
    //     success: false,
    //     error: "image file is required",
    //   });
    // }
    next();
  });
};
module.exports = uploadMiddleWare;
