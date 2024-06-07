const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;

// Define collection and schema for User
let UserModel = new Schema(
  {
    username: {
      type: String,
      required: [true, "Name is required"],
      unique: [true, "User already exists"],
    },
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
    },
    role: {
      type: String,
      enum: ["student", "facilitator", "admin"],
      default: "student",
      required: [true, "User Role is required"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
  },
  {
    collection: "user",
  }
);

// Method to hash the password before saving the user

UserModel.pre("save", function (next) {
  let user = this;

  // if the data is not modified
  if (!user.isModified("password")) {
    return next();
  }

  bcrypt.hash(user.password, 10, (err, hash) => {
    if (err) {
      return next(err);
    }
    user.password = hash;
    next();
  });
});

// Method to compare the password for login
UserModel.methods.comparePassword = function (password) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, this.password, (err, result) => {
      if (err) {
        reject(err);
      }
      if (result) {
        resolve();
      } else {
        reject();
      }
    });
  });
};

module.exports = mongoose.model("UserModel", UserModel);
