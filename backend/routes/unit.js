const express = require("express");
const router = express.Router();
const Unit = require("../models/Unit");
const authMiddleware = require("../middleware/authMiddleware");

// CREATE UNIT (Protected)
router.post("/create", authMiddleware, async (req, res) => {
  try {
    const {
      projectId,
      tower,
      floor,
      unitNumber,
      type,
      area,
      basePrice,
      status,
    } = req.body;

    const unit = await Unit.create({
      companyId: req.user.companyId,
      projectId,
      tower,
      floor,
      unitNumber,
      type,
      area,
      basePrice,
      status: status || "Available",
    });

    res.status(201).json(unit);
  } catch (error) {
    res.status(500).json({ message: "Unit creation failed", error });
  }
});

// GET UNITS BY PROJECT (Protected)
router.get("/:projectId", authMiddleware, async (req, res) => {
  try {
    const units = await Unit.find({
      projectId: req.params.projectId,
      companyId: req.user.companyId,
    }).sort({ createdAt: -1 });

    res.json(units);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch units", error });
  }
});

// UPDATE UNIT STATUS (Protected)
router.put("/update-status/:id", authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;

    const updatedUnit = await Unit.findOneAndUpdate(
      { _id: req.params.id, companyId: req.user.companyId },
      { status },
      { new: true }
    );

    if (!updatedUnit) {
      return res.status(404).json({ message: "Unit not found" });
    }

    res.json(updatedUnit);
  } catch (error) {
    res.status(500).json({ message: "Failed to update unit status", error });
  }
});

module.exports = router;
