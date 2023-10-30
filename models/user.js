const mongoose = require("mongoose");
const userSchema = mongoose.Schema(
  {
    profile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile",
    },
    blogs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Blog",
      },
    ],
    email: {
      type: String,
      required: [true, "Value is Required"],
      unique: [true, "Email Must be Unique"],
      trim: true,
      lowercase: true,
      validate: {
        validator: (value) => {
          return /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(value);
        },
        message: (props) => `${props.value} is not a valid email`,
      },
    },
    password: {
      type: String,
      required: true,
      minlength: [8, "please Provide a password of at least 8 character"],
    },
    role: {
      type: [
        {
          type: String,
          enum: ["user", "admin"],
        },
      ],
      default: ["user"],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    resetToken: {
      type: String,
    },
    resetTokenExpiry: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
