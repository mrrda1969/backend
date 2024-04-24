const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;

// Define collection and schema for User
let UserModel = new Schema(
  {
    user_name: {
      type: String,
      required: [true, "Name is required"],
    },
    user_email: {
      type: String,
      required: [true, "Email is required"],
    },
    user_role: {
      type: String,
      enum: ["student", "facilitator", "admin"],
      default: "student",
      required: [true, "User Role is required"],
    },
    user_password: {
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
  if (!user.isModified("user_password")) {
    return next();
  }

  bcrypt.hash(user.user_password, 10, (err, hash) => {
    if (err) {
      return next(err);
    }
    user.user_password = hash;
    next();
  });
});

// Method to compare the password for login
// UserModel.methods.login = (user_password) => {
//   let user = this;

//   return new Promise((resolve, reject) => {
//     bcrypt.compare(user_password, user.user_password, (err, result) => {
//       if (err) {
//         reject(err);
//       }
//       if (result) {
//         resolve();
//       } else {
//         reject();
//       }
//     });
//   });
// };

module.exports = mongoose.model("UserModel", UserModel);
