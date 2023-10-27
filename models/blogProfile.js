const mongoose = require("mongoose");
const blogProfileSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "Please enter your firstName"],
    },
    lastName: {
      type: String,
      required: [true, "Please enter your lastName"],
    },
    image: {
      type: String,
    },
    website: {
      type: String,
    },
    bio: {
      type: String,
    },
    social: {
      facebook: {
        type: String,
      },
      youtube: {
        type: String,
      },
      twitter: {
        type: String,
      },
      instagram: {
        type: String,
      },
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BlogUser",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("BlogProfile", blogProfileSchema);
