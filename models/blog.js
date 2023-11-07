const mongoose = require("mongoose");

const blogSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please enter blog title"],
      trim: true,
      maxLength: [500, "title must be less than or equal to  500 characters"],
      unique: [true, "title Must be Unique"],
    },
    completed: {
      type: Boolean,
      default: false,
    },
    descriptionOne: {
      type: String,
      required: [true, "Please enter blog description one"],
      trim: true,
      maxLength: [
        100000,
        "description must be less than or equal to 100000 characters",
      ],
    },
    descriptionTwo: {
      type: String,
      required: [true, "Please enter blog description two"],
      trim: true,
      maxLength: [
        100000,
        "description must be less than or equal to 100000 characters",
      ],
    },
    blogImg: {
      type: String,
    },
    category: {
      type: String,
      trim: true,
    },
    tag: {
      type: String,
      trim: true,
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
