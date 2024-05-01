const express = require("express");
const courseRoutes = express.Router();
const userRoutes = express.Router();
const bcrypt = require("bcrypt");

// Require Course model in our routes module
let CourseModel = require("../models/CourseModel");
let UserModel = require("../models/UserModel");

// Defined store route
courseRoutes.route("/add").post(function (req, res) {
  let course = new CourseModel(req.body);
  course
    .save()
    .then((course) => {
      res.status(200).json({ course: "course added successfully" });
    })
    .catch((err) => {
      res.status(400).send("unable to save to database");
    });
});

// Defined get data(index or listing) route
courseRoutes.route("/").get(function (req, res) {
  CourseModel.find({})
    .then((courses) => {
      res.status(200).json(courses);
    })
    .catch((err) => {
      res.status(400).send("Not Found");
    });
});

// Defined edit route
courseRoutes.route("/edit/:id").get(function (req, res) {
  let id = req.params.id;
  CourseModel.findById(id)
    .then((course) => {
      res.status(200).json(course);
    })
    .catch((err) => {
      res.status(400).send("Not Found");
    });
});

//  Defined update route
courseRoutes.route("/update/:id").post(function (req, res) {
  CourseModel.findById(req.params.id).then((course) => {
    if (!course) return new Error("Could not load Document");
    else {
      course.course_name = req.body.course_name;
      course.course_description = req.body.course_description;

      course
        .save()
        .then((course) => {
          res.json("Update complete");
        })
        .catch((err) => {
          res.status(400).send("unable to update the database");
        });
    }
  });
});

// Defined delete | remove | destroy route
courseRoutes.route("/delete/:id").get(function (req, res) {
  let id = req.params.id;
  CourseModel.findOneAndDelete(id)
    .then((course) => {
      res.status(200).json("course deleted");
    })
    .catch((err) => {
      res.status(400).send("Not Found");
    });
});

// Defined user saving route
userRoutes.route("/add").post(function (req, res) {
  let user = new UserModel(req.body);
  user
    .save()
    .then((user) => {
      res.status(200).json({ user: "user added successfully" });
    })
    .catch((err) => {
      res.status(400).send("unable to save to database");
    });
});

// Defined get data(index or listing) route
userRoutes.route("/").get(function (req, res) {
  UserModel.find({})
    .then((users) => {
      res.status(200).json(users);
      if (users == null) {
        res.status(200).json("Users not found ");
      }
    })
    .catch((err) => {
      res.status(400).send("Error");
    });
});

// Defined edit route
userRoutes.route("/edit/:id").get(function (req, res) {
  let id = req.params.id;
  UserModel.findById(id, function (err, user) {
    res.json(user);
  });
});

//  Defined update route
userRoutes.route("/update/:id").post(function (req, res) {
  UserModel.findById(req.params.id).then((user) => {
    if (!user) return new Error("Could not load Document");
    else {
      user.user_name = req.body.user_name;
      user.user_email = req.body.user_email;
      user.user_password = req.body.user_password;

      user
        .save()
        .then((user) => {
          res.json("Update complete");
        })
        .catch((err) => {
          res.status(400).send("unable to update the database");
        });
    }
  });
});

// Defined delete | remove | destroy route
userRoutes.route("/delete/:id").get(function (req, res) {
  UserModel.findOneAndDelete({ _id: req.params.id })
    .then((user) => {
      res.status(200).json("User deleted");
    })
    .catch((err) => {
      res.status(400).send("Unable to delete user");
    });
});

// login route by username and password
userRoutes.route("/login").post(async function (req, res) {
  try {
    UserModel.findOne({
      user_name: req.body.user_name,
    }).then((user) => {
      if (user) {
        bcrypt.compare(
          req.body.user_password,
          user.user_password,
          function (err, result) {
            if (result) {
              res.status(200).json({
                user_name: user.user_name,
                user_role: user.user_role,
              });
            } else {
              res.status(401).send("Invalid password");
            }
            if (err) {
              throw err;
            }
          }
        );
      } else {
        res.status(404).send("User not found");
      }
    });
  } catch (error) {
    res.status(402).send({ msg: error });
  }
});

module.exports = { courseRoutes, userRoutes };
