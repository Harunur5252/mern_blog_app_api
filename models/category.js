const mongoose = require("mongoose");
const blogCategorySchema = mongoose.Schema(
  {
    categoryName: {
      type: String,
      required: true,
      unique: [true, "categoryName must be Unique"],
      trim: true,
      maxLength: [60, "categoryName must be maximum 60 characters"],
    },
    categoryItem: {
      type: String,
    },
    blogs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Blog",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Category", blogCategorySchema);
