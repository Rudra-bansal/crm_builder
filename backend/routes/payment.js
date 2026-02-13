const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const Payment = require("../models/Payment");
const Booking = require("../models/Booking");

// CREATE PAYMENT (Protected)
router.post("/create", authMiddleware, async (req, res) => {
  try {
    const { bookingId, amount, method, remarks } = req.body;

    // Validate booking belongs to this company
    const booking = await Booking.findOne({
      _id: bookingId,
      companyId: req.user.companyId,
    });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found ❌" });
    }

    const payment = await Payment.create({
      companyId: req.user.companyId,
      bookingId,
      amount: Number(amount),
      method,
      remarks,
    });

    res.status(201).json(payment);
  } catch (error) {
    res.status(500).json({ message: "Payment failed", error: error.message });
  }
});

// GET ALL PAYMENTS (Protected)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const payments = await Payment.find({
      companyId: req.user.companyId,
    })
      .populate({
        path: "bookingId",
        populate: [{ path: "leadId" }, { path: "unitId" }],
      })
      .sort({ createdAt: -1 });

    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch payments", error });
  }
});

// GET PAYMENTS BY BOOKING (Protected)
router.get("/:bookingId", authMiddleware, async (req, res) => {
  try {
    // Validate booking belongs to this company
    const booking = await Booking.findOne({
      _id: req.params.bookingId,
      companyId: req.user.companyId,
    });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found ❌" });
    }

    const payments = await Payment.find({
      bookingId: req.params.bookingId,
      companyId: req.user.companyId,
    }).sort({ createdAt: -1 });

    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch booking payments", error });
  }
});

module.exports = router;
