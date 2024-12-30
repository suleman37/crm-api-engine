const express = require("express");
const { createEmployee, getAllEmployees, loginUser, addAttendance, deleteEmployee } = require("../Controllers/employee_controller");

const router = express.Router();

router.post("/create", createEmployee);
router.post("/login", loginUser);
router.get("/employees", getAllEmployees);
router.post("/attendance", addAttendance);
router.delete("/employees/:id", deleteEmployee);

module.exports = router;