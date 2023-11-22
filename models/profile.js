const mongoose = require("mongoose");

const profileSchema = mongoose.Schema(
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
    resume: {
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
      linkedin: {
        type: String,
      },
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Profile", profileSchema);
