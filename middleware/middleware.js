const express = require("express");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const logger = require("morgan");
const cors = require("cors");
const User = require("../models/User");

const middleware = express();

middleware.use(logger("dev"));
middleware.use(bodyParser.json());
middleware.use(bodyParser.urlencoded({ extended: true }));
middleware.use(cors());

// Function to create a default admin user
async function createDefaultAdmin() {
  const defaultpassword = "defaultPassword1";
  User.findOne({ username: "admin" })
    .then(async (admin) => {
      if (!admin) {
        const hashedPassword = await bcrypt.hash(defaultpassword, 10);

        const newAdmin = new User({
          username: "admin",
          email: "",
          role: "admin",
          password: hashedPassword,
        });

        await newAdmin.save();
        console.log("Default admin user created.");
      } else {
        console.log("Default admin user already exists.");
      }
    })
    .catch((err) => {
      console.error(err);
    });
}

// Middleware to check if password is "defaultpassword" and prompt for change
// function checkPassword(req, res, next) {
//   const user = User.findOne({ username: req.body.username });

//   if (user && bcrypt.compare("defaultPassword1", user.password)) {
//     res.status(401).json({
//       message:
//         "Your password is the default password. Please change your password before logging in.",
//     });
//   } else {
//     next();
//   }
// }

// function to verify password
function verifyPassword(password, hashedPassword) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, hashedPassword, (err, result) => {
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
}

module.exports = middleware;
module.exports.createDefaultAdmin = createDefaultAdmin;
module.exports.verifyPassword = verifyPassword;
// module.exports.checkPassword = checkPassword;
