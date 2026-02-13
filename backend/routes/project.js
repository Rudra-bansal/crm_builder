const express = require("express");
const router = express.Router();
const Project = require("../models/Project");
const authMiddleware = require("../middleware/authMiddleware");

// CREATE PROJECT (Protected)
router.post("/create", authMiddleware, async (req, res) => {
  try {
    const { name, location, totalUnits } = req.body;

    const project = await Project.create({
      companyId: req.user.companyId,
      name,
      location,
      totalUnits,
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: "Project creation failed", error });
  }
});

// GET ALL PROJECTS (Protected)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const projects = await Project.find({
      companyId: req.user.companyId,
    }).sort({ createdAt: -1 });

    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch projects", error });
  }
});

module.exports = router;
