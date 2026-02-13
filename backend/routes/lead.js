const express = require("express");
const router = express.Router();
const Lead = require("../models/Lead");
const authMiddleware = require("../middleware/authMiddleware");

// CREATE LEAD (Protected)
router.post("/create", authMiddleware, async (req, res) => {
  try {
    const { name, phone, budget, source, status } = req.body;

    const lead = await Lead.create({
      companyId: req.user.companyId,
      name,
      phone,
      budget,
      source,
      status,
    });

    res.status(201).json(lead);
  } catch (error) {
    res.status(500).json({ message: "Lead creation failed", error });
  }
});

// GET ALL LEADS (Protected)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const leads = await Lead.find({
      companyId: req.user.companyId,
    }).sort({ createdAt: -1 });

    res.json(leads);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch leads", error });
  }
});

// UPDATE STATUS (Protected)
router.put("/update-status/:id", authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;

    const updatedLead = await Lead.findOneAndUpdate(
      { _id: req.params.id, companyId: req.user.companyId },
      { status },
      { new: true }
    );

    if (!updatedLead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    res.json(updatedLead);
  } catch (error) {
    res.status(500).json({ message: "Failed to update lead", error });
  }
});

// UPDATE FOLLOWUP DATE (Protected)
router.put("/update-followup/:id", authMiddleware, async (req, res) => {
  try {
    const { followUpDate } = req.body;

    const updatedLead = await Lead.findOneAndUpdate(
      { _id: req.params.id, companyId: req.user.companyId },
      { followUpDate },
      { new: true }
    );

    if (!updatedLead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    res.json(updatedLead);
  } catch (error) {
    res.status(500).json({ message: "Failed to update follow-up", error });
  }
});

// ADD NOTE (Protected) ✅ NEW ROUTE
router.post("/add-note/:id", authMiddleware, async (req, res) => {
  try {
    const { note } = req.body;

    if (!note || note.trim() === "") {
      return res.status(400).json({ message: "Note is required" });
    }

    const lead = await Lead.findOne({
      _id: req.params.id,
      companyId: req.user.companyId,
    });

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    lead.notes.push({
      note,
      date: new Date(),
    });

    await lead.save();

    res.json({ message: "Note added successfully", lead });
  } catch (error) {
    res.status(500).json({ message: "Failed to add note", error });
  }
});

// GET SINGLE LEAD BY ID (Protected)
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const lead = await Lead.findOne({
      _id: req.params.id,
      companyId: req.user.companyId,
    });

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    res.json(lead);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch lead", error });
  }
});
module.exports = router;
