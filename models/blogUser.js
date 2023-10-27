const mongoose = require("mongoose");
const blogUserSchema = mongoose.Schema(
  {
    profile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BlogProfile",
    },
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

module.exports = mongoose.model("BlogUser", blogUserSchema);
