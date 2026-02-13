const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const Booking = require("../models/Booking");
const Unit = require("../models/Unit");
const Lead = require("../models/Lead");
const Payment = require("../models/Payment");

// CREATE BOOKING (Protected)
router.post("/create", authMiddleware, async (req, res) => {
  try {
    const { leadId, unitId, sellingPrice, bookingAmount } = req.body;

    // Check Lead belongs to same company
    const lead = await Lead.findOne({
      _id: leadId,
      companyId: req.user.companyId,
    });

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    // Check Unit belongs to same company
    const unit = await Unit.findOne({
      _id: unitId,
      companyId: req.user.companyId,
    });

    if (!unit) {
      return res.status(404).json({ message: "Unit not found" });
    }

    // Prevent double booking
    if (unit.status === "Sold") {
      return res.status(400).json({ message: "Unit is already Sold ❌" });
    }

    // Mark unit sold
    unit.status = "Sold";
    await unit.save();

    // Create Booking
    const booking = await Booking.create({
      companyId: req.user.companyId,
      leadId,
      unitId,
      sellingPrice: Number(sellingPrice),
      bookingAmount: Number(bookingAmount || 0),
    });

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: "Booking failed", error: error.message });
  }
});

// GET ALL BOOKINGS (Protected)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find({
      companyId: req.user.companyId,
    })
      .populate("leadId")
      .populate("unitId")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch bookings", error });
  }
});

// BOOKING SUMMARY (Selling vs Received vs Due) (Protected)
router.get("/summary/all", authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find({
      companyId: req.user.companyId,
    })
      .populate("leadId")
      .populate("unitId")
      .sort({ createdAt: -1 });

    const result = [];

    for (let b of bookings) {
      const payments = await Payment.find({
        bookingId: b._id,
        companyId: req.user.companyId,
      });

      const received = payments.reduce((sum, p) => sum + p.amount, 0);
      const due = b.sellingPrice - received;

      result.push({
        bookingId: b._id,
        leadName: b.leadId?.name,
        phone: b.leadId?.phone,
        unitNumber: b.unitId?.unitNumber,
        unitType: b.unitId?.type,
        sellingPrice: b.sellingPrice,
        receivedAmount: received,
        dueAmount: due,
      });
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch summary", error });
  }
});

module.exports = router;
