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

authRoutes.route("/new").post((req, res) => {
  const data = req.body;
  let user = new UserModel({
    username: data.username,
    email: data.email,
    role: data.role,
    password: data.password,
  });
  user
    .save()
    .then((savedUser) => {
      const username = savedUser.username;
      const userDetails =
        user.role == "student"
          ? new Student({
              userId: user._id,
              firstname: data.firstname,
              lastname: data.lastname,
              dateOfBirth: data.dateOfBirth,
              studentId: data.studentId,
              program: data.program,
              username: username,
            })
          : user.role == "facilitator"
          ? new Facilitator({
              userId: user._id,
              firstname: data.firstname,
              lastname: data.lastname,
              dateOfBirth: data.dateOfBirth,
              staffId: data.staffId,
              department: data.department,
              username: username,
            })
          : new Admin({
              userId: user._id,
              firstname: data.firstname,
              lastname: data.lastname,
              dateOfBirth: data.dateOfBirth,
              staffId: data.staffId,
              username: username,
            });

      userDetails
        .save()
        .then(() => {
          const token = jwt.sign({ _id: user._id }, authKeys.jwtSecretKey);
          res.json({
            token: token,
            username: user.username,
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
    if (user.role == "facilitator" || user.role == "admin") {
      res.json({
        token: token,
        username: user.username,
        role: user.role,
        staffId: user.staffId,
      });
    } else {
      res.json({
        token: token,
        username: user.username,
        role: user.role,
        studentId: user.studentId,
      });
    }
  } catch (error) {
    console.error(error);

    res.status(500).json({ message: "Internal Server Error" });
  }
});

authRoutes.route("/").get(function (req, res) {
  UserModel.find({})
    .then((users) => {
      res.status(200).json(users);
      if (users == null) {
        ``;
        res.status(200).json("Users not found ");
      }
    })
    .catch((err) => {
      res.status(400).send("Error", err);
    });
});

module.exports = authRoutes;
