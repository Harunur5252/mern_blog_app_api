const mongoose = require("mongoose");

const blogSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please enter blog title"],
      trim: true,
      maxLength: [200, "title must be less than or equal to  200 characters"],
      unique: [true, "title Must be Unique"],
    },
    completed: {
      type: Boolean,
      default: false,
    },
    description: {
      type: String,
      required: [true, "Please enter blog description"],
      trim: true,
      maxLength: [
        10000,
        "description must be less than or equal to 10000 characters",
      ],
    },
    blogImg: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      trim: true,
      required: true,
    },
    tag: {
      type: String,
      trim: true,
      required: true,
    },
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tag",
      },
    ],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    publishDate: {
      type: Date,
      trim: true,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Blog", blogSchema);
