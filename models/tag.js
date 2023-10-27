const mongoose = require("mongoose");
const blogTagSchema = mongoose.Schema(
  {
    tagName: {
      type: String,
      required: true,
      unique: [true, "tagName must be Unique"],
      trim: true,
      maxLength: [20, "tagName must be less than 20 characters"],
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

module.exports = mongoose.model("Tag", blogTagSchema);
