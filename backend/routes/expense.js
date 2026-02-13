const express = require("express");
const router = express.Router();

const Expense = require("../models/Expense");
const Project = require("../models/Project");
const authMiddleware = require("../middleware/authMiddleware");

// CREATE EXPENSE (Protected)
router.post("/create", authMiddleware, async (req, res) => {
  try {
    const { projectId, title, category, amount, remarks } = req.body;

    // Validate project belongs to same company
    const project = await Project.findOne({
      _id: projectId,
      companyId: req.user.companyId,
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found ❌" });
    }

    const expense = await Expense.create({
      companyId: req.user.companyId,
      projectId,
      title,
      category,
      amount: Number(amount),
      remarks,
    });

    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ message: "Expense creation failed", error: error.message });
  }
});

// GET EXPENSES BY PROJECT (Protected)
router.get("/:projectId", authMiddleware, async (req, res) => {
  try {
    // Validate project belongs to same company
    const project = await Project.findOne({
      _id: req.params.projectId,
      companyId: req.user.companyId,
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found ❌" });
    }

    const expenses = await Expense.find({
      projectId: req.params.projectId,
      companyId: req.user.companyId,
    }).sort({ createdAt: -1 });

    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch expenses", error });
  }
});

module.exports = router;
