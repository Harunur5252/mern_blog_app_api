const mongoose = require("mongoose");

const aboutSchema = mongoose.Schema(
  {
    about: {
      type: String,
      required: [true, "Please enter blogy about"],
      trim: true,
      maxLength: [
        100000,
        "blogy about must be less than or equal to  100000 characters",
      ],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("About", aboutSchema);
