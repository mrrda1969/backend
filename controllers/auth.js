const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const UserModel = require("../models/UserModel");
const Student = require("../models/Student");
const Facilitator = require("../models/Facilitator");
const Admin = require("../models/Admin");
const authKeys = require("../lib/authKeys");

const authRoutes = express.Router();

// Adding a new user

authRoutes.route("/adduser").post((req, res) => {
  const data = req.body;
  let user = new UserModel({
    username: data.username,
    email: data.email,
    role: data.role,
    password: data.password,
  });
  user
    .save()
    .then(() => {
      const userDetails =
        user.role == "student"
          ? new Student({
              userId: user._id,
              firstname: data.firstname,
              lastname: data.lastname,
              dateOfBirth: data.dateOfBirth,
              studentId: data.studentId,
              program: data.program,
            })
          : user.role == "facilitator"
          ? new Facilitator({
              userId: user._id,
              firstname: data.firstname,
              lastname: data.lastname,
              dateOfBirth: data.dateOfBirth,
              staffId: data.staffId,
              department: data.department,
            })
          : new Admin({
              userId: user._id,
              firstname: data.firstname,
              lastname: data.lastname,
              dateOfBirth: data.dateOfBirth,
              staffId: data.staffId,
            });

      userDetails
        .save()
        .then(() => {
          const token = jwt.sign({ _id: user._id }, authKeys.jwtSecretKey);
          res.json({
            token: token,
            role: user.role,
          });
        })
        .catch((err) => {
          user
            .deleteOne()
            .then(() => {
              res.status(400).json(err);
            })
            .catch((err) => {
              res.json({ error: err });
            });
          err;
        });
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

// login api

authRoutes.route("/login").post(async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await UserModel.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Invalid Password" });
    }

    const token = jwt.sign({ _id: user._id }, authKeys.jwtSecretKey, {
      expiresIn: "24h",
    });
    res.json(token);
  } catch (error) {
    console.error(error);

    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = authRoutes;
