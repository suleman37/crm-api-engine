const Employee = require("../Modals/add_employee");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require('dotenv').config();

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const employee = await Employee.findOne({ email });

    if (!employee) {
      return res.status(404).json({ message: "User not found." });
    }

    const isPasswordValid = await bcrypt.compare(password, employee.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const token = jwt.sign(
      { id: employee._id, email: employee.email },
      process.env.JWT_SECRET
    );

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Server error." });
  }
};

exports.addAttendance = async (req, res) => {
  const { email, date, checkInTime, checkOutTime } = req.body;
  try {
    const employee = await Employee.findOne({ email });
    if (!employee) {
      return res.status(404).json({ message: "Employee not found." });
    }

    // Find the attendance record for the given date
    const attendanceRecord = employee.attendance.find(record => record.date === date);

    if (attendanceRecord) {
      // Update the existing record
      if (checkInTime) attendanceRecord.checkInTime = checkInTime;
      if (checkOutTime) attendanceRecord.checkOutTime = checkOutTime;
    } else {
      // Create a new record if it doesn't exist
      employee.attendance.push({ date, checkInTime, checkOutTime });
    }

    await employee.save();
    res.status(200).json({ message: "Attendance record updated successfully." });
  } catch (error) {
    console.error("Error adding attendance:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.createEmployee = async (req, res) => {
  try {
    const newEmployee = new Employee(req.body);
    await newEmployee.save();
    res.status(201).json({ message: "Employee created successfully." });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteEmployee = async (req, res) => {
  const { id } = req.params;
  try {
    const employee = await Employee.findByIdAndDelete(id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found." });
    }
    res.status(200).json({ message: "Employee deleted successfully." });
  } catch (error) {
    console.error("Error deleting employee:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};