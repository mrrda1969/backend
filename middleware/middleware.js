const express = require("express");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const logger = require("morgan");
const cors = require("cors");
const Admin = require("../models/Admin");

const middleware = express();

middleware.use(logger("dev"));
middleware.use(bodyParser.json());
middleware.use(cors());

// Function to create a default admin user
async function createDefaultAdmin() {
  const existingAdmin = await Admin.findOne({ username: "admin" });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash("defaultpassword", 10);

    const newAdmin = new Admin({
      email: "admin@example.com",
      password: hashedPassword,
      firstName: "Admin",
      lastName: "User",
    });

    await newAdmin.save();
    console.log("Default admin user created.");
  } else {
    console.log("Default admin user already exists.");
  }
}

// Middleware to check if password is "defaultpassword" and prompt for change
async function checkPassword(req, res, next) {
  const user = await Admin.findOne({ email: req.body.email });

  if (user && (await bcrypt.compare("defaultpassword", user.password))) {
    res.status(401).json({
      message:
        "Your password is the default password. Please change your password before logging in.",
    });
  } else {
    next();
  }
}

module.exports = middleware;
module.exports.createDefaultAdmin = createDefaultAdmin;
module.exports.checkPassword = checkPassword;
