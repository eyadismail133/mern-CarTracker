import express from "express";
import Employee from "../models/Employee.js";
import { protect } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect);

// fetch all employees for logged-in user
router.get("/", authorizeRoles("admin"), async (req, res) => {
  try {
    let employees;
    if (req.user.role === "admin") {
      employees = await Employee.find().sort({ createdAt: -1 });
    } else {
      employees = await Employee.find({ user: req.userId }).sort({
        createdAt: -1,
      });
    }
    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// create new employee
router.post("/", authorizeRoles("admin"), async (req, res) => {
  try {
    const { name, position, phone } = req.body;
    const employee = new Employee({
      name,
      position,
      phone,
      user: req.userId,
    });
    const saved = await employee.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// update employee by ID
router.put("/:id", authorizeRoles("admin"), async (req, res) => {
  try {
    const employee = await Employee.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true }
    );
    if (!employee)
      return res.status(404).json({ message: "Employee not found" });
    res.json(employee);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// delete employee by ID
router.delete("/:id", authorizeRoles("admin"), async (req, res) => {
  try {
    const deleted = await Employee.findOneAndDelete({
      _id: req.params.id,
    });
    if (!deleted)
      return res.status(404).json({ message: "Employee not found" });
    res.json({ message: "Employee deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add attendance for an employee
router.post("/:id/attendance", authorizeRoles("admin"), async (req, res) => {
  try {
    const { status } = req.body; // "present" or "absent"
    let employee;
    if (req.user.role === "admin") {
      employee = await Employee.findById(req.params.id);
    }
    if (!employee)
      return res.status(404).json({ message: "Employee not found" });

    employee.attendance.push({ status });
    await employee.save();
    res.json(employee);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get attendance for an employee
router.get("/:id/attendance", authorizeRoles("admin"), async (req, res) => {
  try {
    let employee;
    if (req.user.role === "admin") {
      employee = await Employee.findById(req.params.id);
    }
    if (!employee)
      return res.status(404).json({ message: "Employee not found" });

    res.json(employee.attendance);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
