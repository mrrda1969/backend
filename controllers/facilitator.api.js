const express = require("express");
const jwt = require("jsonwebtoken");
const Facilitator = require("../models/Facilitator");
const User = require("../models/User");
const authKeys = require("../lib/authKeys");

const facilitatorRoutes = express.Router();

facilitatorRoutes.route("/signup").post((req, res) => {
  const data = req.body;
  let user = new User({
    username: data.username,
    email: data.email,
    role: "facilitator",
    password: data.password,
  });
  user.save().then(() => {
    const facilitatorDetails = new Facilitator({
      staffId: data.staffId,
      faculty: data.faculty,
      department: data.department,
    });
    facilitatorDetails.save().then(() => {
      const token = jwt.sign({ _id: user._id }, authKeys.jwtSecretKey);
      res
        .json({
          token: token,
          username: user.username,
          role: user.role,
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
    });
  });
});

facilitatorRoutes.route("/").get((req, res) => {
  Facilitator.find({})
    .populate(["faculty", "department"])
    .then((facs) => {
      res.json(facs);
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = facilitatorRoutes;
