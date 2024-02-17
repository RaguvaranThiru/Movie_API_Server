const { Schema, model, Model } = require("mongoose");
const { string } = require("zod");

const userSchema = new Schema(
  {
    firstname: {
      type: String,
      require: true,
    },
    lastname: {
      type: String,
      require: false,
    },
    email: {
      type: String,
      require: true,
      unique: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    password: {
      type: String,
      require: true,
    },
    salt: {
      type: String,
      require: true,
    },
  },
  { timestamps: true }
);

const User = model("user", userSchema);

module.exports = User;
