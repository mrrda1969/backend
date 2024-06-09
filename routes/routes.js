const express = require("express");
const facultyRoutes = require("../controllers/faculty.api");
const departmentRoutes = require("../controllers/department.api");
const programRoutes = require("../controllers/program.api");
const facilitatorRoutes = require("../controllers/facilitator.api");
const authRoutes = require("../controllers/auth.api");

const router = express();

router.use("/faculty", facultyRoutes);
router.use("/department", departmentRoutes);
router.use("/program", programRoutes);
router.use("/facilitator", facilitatorRoutes);
router.use("/auth", authRoutes);

module.exports = router;
