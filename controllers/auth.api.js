const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const UserModel = require("../models/User");
const Student = require("../models/Student");
const Facilitator = require("../models/Facilitator");
const Admin = require("../models/Admin");
const authKeys = require("../lib/authKeys");
const {
  createDefaultAdmin,
  checkPassword,
} = require("../middleware/middleware");

const authRoutes = express.Router();

// Route to handle login
authRoutes.post("/login", checkPassword, async (req, res) => {
  try {
    const { username, password } = req.body;
    const isMatch = bcrypt.compareSync(password, user.password);
    const user = await UserModel.findOne({ username }).then(() => {
      pas;
    });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Call createDefaultAdmin on server start
createDefaultAdmin();

module.exports = authRoutes;
