const express = require("express");
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
  User.findOne({ username: "admin" })
    .then(async (admin) => {
      if (!admin) {
        const newAdmin = new User({
          username: "admin",
          email: "",
          role: "admin",
          password: "defaultPassword1",
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

module.exports = middleware;
module.exports.createDefaultAdmin = createDefaultAdmin;
