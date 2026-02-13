const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    leadId: { type: mongoose.Schema.Types.ObjectId, ref: "Lead", required: true },
    unitId: { type: mongoose.Schema.Types.ObjectId, ref: "Unit", required: true },

    sellingPrice: { type: Number, required: true },
    bookingAmount: { type: Number, default: 0 },

    status: {
      type: String,
      enum: ["Booked", "Cancelled"],
      default: "Booked",
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },

  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
