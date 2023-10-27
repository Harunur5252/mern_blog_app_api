const mongoose = require("mongoose");

const blogSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please enter blog title"],
      trim: true,
      maxLength: [500, "title must be maximum 500"],
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
      maxLength: [10000, "description must be maximum 10000"],
    },
    blogImg: {
      type: String,
    },
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
      },
    ],
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tag",
        required: true,
      },
    ],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BlogUser",
      required: true,
    },
    publishDate: {
      type: Date,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Blog", blogSchema);
